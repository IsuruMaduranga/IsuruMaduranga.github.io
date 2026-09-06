---
layout: post
title: "Context Beats the Model: Building a Domain-Specific Coding Agent"
date: 2026-03-18
description: "How we built WSO2 MI Copilot, a domain-specific coding agent with 23 tools, 4 subagents, an on-demand knowledge graph, and a caching strategy that hits 81-90% prompt cache reuse."
tags: [agentic-ai, NLP, context-engineering, multi-agent, LLM]
categories: [research]
featured: true
toc:
  sidebar: left
---

_How we built WSO2 MI Copilot, a domain-specific coding agent with 23 tools, 4 subagents, an on-demand knowledge graph, and a caching strategy that hits 81-90% prompt cache reuse._

---

## Introduction

Agentic coding assistants like Claude Code, Cursor, Windsurf, and Codex all make the same bet: an LLM gets far more useful when you give it tools to act on the world instead of only generating text. Those tools are general-purpose. What happens when you take the same patterns and point them at one narrow, unusual development environment?

We built **WSO2 MI Copilot**: an AI assistant that lives inside VS Code and helps developers build enterprise integrations on the WSO2 Micro Integrator platform. The design borrows heavily from Claude Code, including the reason-and-act loop, tool-based autonomy, multi-agent delegation, conversation compaction, and undo checkpoints. But the domain is constrained, and that changes the hard part of the job: getting the right information in front of the model.

> If you want the ground-up version of the ideas below, I wrote a companion series, [**Harness Engineering 101**](/blog/2026/harness-engineering-101/), that builds an agent from a single JSON array up. This post is that theory applied to one hard production domain, so I link to the relevant chapter whenever a pattern shows up.

This is a technical deep dive. Here is the tour:

1. **The reason-and-act loop** - how streaming tool calls turn a model into an autonomous agent
2. **Why domain-specific is harder** - the edge cases that make a model fail without engineered context
3. **Context engineering** - the three-layer setup that makes a domain agent far more effective
4. **On-demand knowledge** - a structured knowledge graph the agent queries when it needs it
5. **Multi-agent orchestration** - spawning subagents, running them in the background, and compacting the conversation
6. **Prompt caching and context economics** - reaching 81-90% cache reuse, and keeping tool results from flooding the window
7. **Shell sandboxing** - letting an agent run commands without letting it wreck your machine
8. **Language server integration** - real XML validation as the agent's self-correction loop
9. **The mode system** - controlled autonomy through Ask, Edit, and Plan
10. **What didn't work** - the approaches we tried and threw away
11. **What's next** - local embeddings, vector search, and semantic code retrieval

Where a pattern lines up with published research, I cite it, and I give concrete implementation detail throughout.

---

## 1. The Reason-and-Act Loop

At its core, MI Copilot runs the ReAct loop (Reasoning + Acting), introduced by Yao et al. (2023) [^1]. The idea is simple: the model thinks about the problem, calls a tool, reads the result, thinks again, calls another tool, and repeats until the task is done. This is the same agent loop covered in [Chapter 4 of the series](/blog/2026/harness-04-agent-loop/) - a `while` loop that keeps calling the model until it stops asking for tools.

### How it runs: streaming tool calls

The agent uses the Vercel AI SDK's `streamText` function with `stopWhen: stepCountIs(50)`. That gives the model up to 50 tool calls in a row for a single user message:

```
STREAM_TO_CLIENT(
    model       = Claude Sonnet 4.6 (or Opus 4.6),
    max_tokens  = 15,000,
    messages    = [system_prompt, ...chat_history, current_user_message],
    tools       = 23 registered tools (filtered by active mode),
    stop_after  = 50 tool-call steps,
    reasoning   = adaptive,        // model decides when to think deeply
    effort      = low              // bias toward direct responses
)

// Callback: fires before EACH API call in the multi-step loop
BEFORE_EACH_STEP(messages):
    mark last message with cache-control = ephemeral   // prompt caching
```

Every step in that loop follows the same rhythm:

```
Observe → Think (optional reasoning block) → Act (tool call) → Observe result → Think → Act → ...
```

The `prepareStep` callback fires before each API call inside the loop. We use it to move the cache breakpoint forward as the conversation grows with tool results. This one detail is load-bearing: without it, every step would resend the whole conversation with no caching, and the bill would balloon. Section 6 goes into the caching in detail, and [Chapter 5 of the series](/blog/2026/harness-05-caching/) explains why the order of the array decides your cost.

### Extended thinking: reasoning only when it pays off

Claude's extended thinking adds a private reasoning trace before the model answers. We turn it on by default but set `effort: 'low'`, which lets the model decide when a problem is actually worth the extra thought:

```
thinking_start → thinking_delta (streamed) → thinking_end → text or tool_call
```

The system prompt is blunt about it: _"Extended thinking adds latency and should only be used when it will meaningfully improve answer quality - typically for problems that require multi-step reasoning. When in doubt, respond directly. More importantly: Do not Overthink."_

That matches the chain-of-thought research [^4]: simple problems get no benefit from an explicit reasoning trace, and forcing one can actually make easy tasks worse.

{% include figure.liquid loading="eager" path="assets/img/react_loop.svg" class="img-fluid rounded z-depth-1" %}

### Reading the stream

The loop reads several kinds of events as they arrive and updates the UI live:

| Stream Event                | Handler               | UI Effect                                |
| --------------------------- | --------------------- | ---------------------------------------- |
| `text-delta`                | Accumulate text       | Live markdown rendering                  |
| `reasoning-start/delta/end` | Track thinking blocks | Collapsible thinking display             |
| `tool-input-start`          | Early tool detection  | Show "Running tool..." immediately       |
| `tool-call`                 | Execute tool          | Status indicator (spinner → check/error) |
| `tool-result`               | Feed back to model    | Next reasoning step                      |
| `finish`                    | Persist to JSONL      | Save conversation state                  |

The `tool-input-start` event is worth calling out. It fires the moment the model starts writing a tool's input, before the tool runs. We use it to show a loading indicator right away, so the interface feels responsive instead of frozen.

### A watchdog so it never hangs

Two timeouts keep the agent from getting stuck:

```
WATCHDOG = create_stream_watchdog(
    idle_timeout   = 2 minutes,      // max silence between stream events
    total_timeout  = 10 minutes,     // hard circuit breaker for entire run
    pause_idle_when = tool_is_executing OR waiting_for_user_input
)
```

The idle timeout pauses while a tool is running (some, like `build_project`, take minutes) and while the agent waits on the user through `ask_user_question`. The total timeout is the hard stop for the whole run, no matter what.

---

## 2. Why Domain-Specific Is Harder Than General-Purpose

You might expect a domain-specific agent to be _easier_ to build than a tool like Claude Code. Smaller scope, fewer languages, a narrower problem. The opposite is true.

### The model has never really seen your domain

Frontier models have read enormous amounts of Python, JavaScript, TypeScript, Rust, and Go - languages with millions of public repositories and decades of Stack Overflow answers behind them. When Claude Code edits a React component, it is drawing on deep patterns from hundreds of thousands of similar components. [Chapter 2 of the series](/blog/2026/harness-02-the-brain/) explains why that training history predicts so much of the model's behavior.

WSO2 Synapse XML is not Python. The training data is thin. The model has seen a little Synapse, but not enough to absorb its quirks - and the quirks are exactly where integrations break.

### The edge cases

Take this Synapse expression: `"Count: " + payload.count`. It looks fine. In JavaScript, Python, or nearly any mainstream language, it joins a string to a number. In Synapse's expression engine, **it throws a runtime exception**. The `+` operator does not coerce types, so string plus integer is undefined.

Or this null check: `payload.age == null or payload.age > 18`. It looks careful. But if `payload.age` really is `null`, the second half still runs and throws `"Null source value"` before the `or` can short-circuit.

Or this equality check: `1 == 1.0`. Synapse returns `false`, because it compares the two as the strings `"1"` and `"1.0"`.

Or this reasonable-looking API definition: `<send/>` at the end of an `inSequence`. In most integration platforms, "send" means "send the response." In Synapse, `<send/>` sends the message to the _endpoint_, and `<respond/>` sends the response to the _client_. The model writes `<send/>` because every HTTP framework it trained on uses "send" for responses. The integration then hangs silently, waiting on a backend that was never called.

None of these are obscure. They are basic type-system behaviors, and a model trained mostly on mainstream languages gets them wrong _every time_, because the rule that is correct in 99% of languages is wrong in Synapse.

We wrote down **dozens** of these across type coercion, null handling, integer overflow, XML escaping, payload construction, and error propagation. Without that context, the agent writes code that _looks_ right, survives a casual review, and fails at runtime.

This is the whole challenge of a domain-specific agent in one line: **the model's instincts are wrong, and you have to override them with precise, verified context on every turn.** [Chapter 6](/blog/2026/harness-06-context-budget/) frames context as a budget you spend deliberately, which is exactly the discipline this demands.

### What a general-purpose agent can't do

A tool like Claude Code can edit Synapse XML - it is just text. But it cannot:

- **Validate the XML against the MI schema** - it has no language server
- **Know which connectors exist** for the user's runtime version - it has no Connector Store API
- **Tell whether an expression will throw** at runtime - it does not know Synapse's coercion rules
- **Notice a wrong property scope** - it does not know that `$ctx:uri.var.petId` works in API resources but not in sequences
- **Build and deploy the project** - it does not know MI's Maven build or runtime server
- **Look up what a mediator means** - it guesses from the XML tag name, and often guesses wrong

MI Copilot fills those gaps with engineered context, purpose-built tools, and a language server that checks the work. The model does not need to _know_ Synapse. It needs the right information at the right moment and tools to verify what it produced.

### The 23 tools

We keep saying "23 tools." Here is the full list. Each one exists because a general-purpose agent would need it and does not have it:

| Category                 | Tools                                                                                     | Count | Why It Exists                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------- |
| **File Operations**      | `file_read`, `file_write`, `file_edit`, `grep`, `glob`                                    | 5     | Structured editing with LSP sync, not raw filesystem writes         |
| **Connectors & Context** | `get_connector_definitions`, `load_context_reference`                                     | 2     | 100+ connectors from live Store API; 12 deep reference docs         |
| **Project Management**   | `add_or_remove_connector`                                                                 | 1     | Updates `pom.xml` dependencies -model can't guess Maven coordinates |
| **Validation**           | `validate_code`                                                                           | 1     | LemMinx LSP diagnostics with code actions                           |
| **Data Mapper**          | `create_data_mapper`, `generate_data_mapping`                                             | 2     | TypeScript schema-to-schema mappings via specialized sub-agent      |
| **Runtime**              | `build_project`, `server_management`                                                      | 2     | Maven build + MI server start/stop/status                           |
| **Planning & Subagents** | `create_subagent`, `ask_user_question`, `enter_plan_mode`, `exit_plan_mode`, `todo_write` | 5     | Multi-agent delegation, human-in-the-loop, task tracking            |
| **Shell**                | `shell`, `kill_task`, `task_output`                                                       | 3     | Sandboxed command execution with background process support         |
| **Web**                  | `web_search`, `web_fetch`                                                                 | 2     | Approval-gated web access for external information                  |

---

## 3. Context Engineering: The Domain-Specific Advantage

Context engineering means deciding, on purpose, what goes into the model's context window. For a domain agent it matters more than the model itself. Anthropic calls it "the art of providing the right information in the right format at the right time." [^2]

A general-purpose assistant has to handle whatever a user throws at it. A domain agent gets to be opinionated about what context matters - and that is its biggest edge.

### Three layers of context

MI Copilot splits its context into three layers, each with different caching behavior. The split follows a simple observation from Anthropic's context engineering guide: _"the most effective agents separate static knowledge (system prompts) from dynamic knowledge (tool results)."_

### Layer 1: the static system prompt (~3,100 lines)

The system prompt is one carefully structured document with 17 major sections. The main ones:

1. **Identity and behavior** - concise, professional, formatted for the VS Code sidebar
2. **Operating modes** - what Ask, Edit, and Plan do, and how to switch
3. **Tool usage policy** - when to parallelize, when to reach for a subagent instead of a direct tool
4. **Query workflow** - a step-by-step path: scope → requirements → design → context → implement → validate → build → test → clean up
5. **Synapse guide** - an embedded XML reference, picked by runtime version (v2 for >=4.4.0, v1 for older)
6. **Connector documentation** - usage patterns and setup templates
7. **Debugging guidelines** - common MI problems and how to fix them
8. **Reference index** - one-line descriptions of the 12 documents the agent can load on demand

The guide it embeds depends on the runtime version:

```
system_prompt = TEMPLATE
    with SYNAPSE_GUIDE    = modern_guide   IF runtime_version >= 4.4.0
                            legacy_guide   OTHERWISE
    with CONNECTOR_DOCS   = modern_docs    IF runtime_version >= 4.4.0
                            legacy_docs    OTHERWISE
```

This heads off a common failure in domain agents: writing code for the wrong version of the platform.

### Layer 2: project context

Every user message is wrapped with context pulled live from the workspace:

```xml
<project_structure>
├── src/main/synapse-config/
│   ├── api/CustomerAPI.xml
│   ├── sequences/ErrorHandler.xml
│   └── endpoints/BackendEP.xml
├── src/main/registry-resources/
└── pom.xml
</project_structure>

<ide_opened_file>src/main/synapse-config/api/CustomerAPI.xml</ide_opened_file>

<available_connectors>Database, Email, File, HTTP, Salesforce, ...</available_connectors>
<available_inbound_endpoints>HTTP, JMS, Kafka, ...</available_inbound_endpoints>

<env>
  <working_directory>/Users/dev/my-integration</working_directory>
  <mi_runtime_version>4.4.0</mi_runtime_version>
  <mi_runtime_home>/opt/mi-4.4.0</mi_runtime_home>
  <platform>darwin</platform>
  <today>2026-03-18</today>
</env>

<system_reminder>
  <mode>EDIT</mode>
  [Mode-specific policy text injected here]
</system_reminder>
```

The file tree is capped at 50 files and 10K characters, and it skips the noise (`.git`, `.mvn`, `node_modules`, `.mi-copilot`). That keeps big projects from blowing up the context while still giving the model the map it needs to navigate.

### Layer 3: dynamic knowledge (the knowledge graph)

This is where MI Copilot departs most from a general-purpose assistant. Instead of trusting the model's sparse, often outdated training data for Synapse XML, we built a **structured knowledge graph** the agent queries when it needs it, through the `load_context_reference` tool. The next section covers it in full.

{% include figure.liquid loading="eager" path="assets/img/context_layers.svg" class="img-fluid rounded z-depth-1" %}

---

## 4. On-Demand Knowledge: A Structured Reference System

### Why static context fails

Stuffing all the domain knowledge into the system prompt does not work. Our Synapse reference alone - the expression spec, function reference, mediator semantics, endpoint types, property scopes, edge cases, payload patterns, SOAP handling - would run to about 60K tokens. That is before the user even asks anything.

The key observation: **most questions need only one or two of those documents.** An agent building a REST API does not need the SOAP namespace guide. An agent debugging expressions does not need the endpoint reference. This is the "pull, don't push" idea from [Chapter 6](/blog/2026/harness-06-context-budget/): let the agent fetch what it needs instead of loading everything up front.

### The `load_context_reference` tool

So we gave the agent a tool that lets it _decide_ what knowledge it needs and load it on demand:

```
KNOWLEDGE_GRAPH = registry of context references, each with:
    name          : canonical identifier (e.g., "synapse-expression-spec")
    description   : one-line summary the agent reads to decide relevance
    full_content  : complete document (~3-6K tokens)
    sections      : map of { section_name → section_content } for granular loading
    min_version?  : optional runtime version gate
    aliases?      : alternative names the agent might use

Example entries:
    "synapse-expression-spec"     → operators, type system, coercion, null handling, JSONPath
    "synapse-function-reference"  → string, math, type-check, conversion, datetime, access
    "synapse-mediator-reference"  → enrich, call, send, payloadFactory, property, ...
    ... 9 more contexts
```

Each reference can be loaded whole or by section, using a colon:

```
load_context_reference("synapse-expression-spec")              → Full doc (~6K tokens)
load_context_reference("synapse-expression-spec:type_coercion") → One section (~1K tokens)
```

This is the same shape as the skills-and-index pattern in [Chapter 11](/blog/2026/harness-11-extending-the-body/): keep a short menu in the context, and pull the detail only when it becomes relevant.

### The 12 references

| Reference                            | Sections                                                            | Typical Load |
| ------------------------------------ | ------------------------------------------------------------------- | ------------ |
| `synapse-expression-spec`            | operators, type_system, type_coercion, null_handling, jsonpath, ... | 1-6K tokens  |
| `synapse-function-reference`         | string_functions, math_functions, datetime_functions, ...           | 1-5K tokens  |
| `synapse-variable-resolution`        | payload, headers, properties, params, configs, registry             | 1-4K tokens  |
| `synapse-mediator-expression-matrix` | per-mediator expression support, payload state transitions          | 2-5K tokens  |
| `synapse-edge-cases`                 | type gotchas, null handling, XML escaping, error catalog            | 2-4K tokens  |
| `synapse-endpoint-reference`         | HTTP, Address, WSDL, failover, loadbalance patterns                 | 2-5K tokens  |
| `synapse-mediator-reference`         | enrich, call, send, payloadFactory, property, ...                   | 3-6K tokens  |
| `synapse-payload-patterns`           | JSON/XML construction, format conversion, FreeMarker                | 2-5K tokens  |
| `synapse-property-reference`         | HTTP properties, content-type, error handling, scopes               | 2-4K tokens  |
| `synapse-soap-namespace-guide`       | SOAP calls, WSDL namespace, WS-Addressing                           | 2-4K tokens  |
| `unit-test-reference`                | test schema, assertions, mock services, examples                    | 2-5K tokens  |
| `ai-connector-app-development`       | AI connector: chat, RAG, knowledge base, agents                     | 3-5K tokens  |

### Forgiving name matching

Models mistype identifiers. The parser normalizes names on both sides so a near-miss still resolves:

```
NORMALIZE_CONTEXT_NAME(input):
    lowercase → replace underscores and spaces with hyphens
    "synapse_expression_spec"  →  "synapse-expression-spec"
    "synapse expression spec"  →  "synapse-expression-spec"

NORMALIZE_SECTION_NAME(input):
    lowercase → replace hyphens and spaces with underscores
    "type-system"   →  "type_system"
    "Type System"   →  "type_system"
```

So `synapse_expression_spec` works just as well as `synapse-expression-spec`, and a whole class of "wrong name" errors disappears. Aliases add another layer - a document answers to any of its names:

```
"unit-test-reference"  aliases: ["unit_test_reference", "unit-test-guide"]
```

### Version gating

Some references only make sense on certain runtime versions:

```
LOAD_CONTEXT("ai-connector-app-development"):
    runtime_version = detect_from_pom_xml(project_path)
    IF runtime_version < 4.4.0:
        RETURN error: "Context requires MI runtime 4.4.0+. Detected: {runtime_version}"
    ELSE:
        RETURN ai_connector_documentation
```

This stops the agent from writing code for features the user's runtime does not have - a small gate that prevents a whole category of wrong answers.

### Why not just RAG?

Vector-based RAG (Retrieval-Augmented Generation) [^5] looks like the obvious choice here. We went with structured references instead, for four reasons:

1. **Precision over recall.** A domain agent needs the _exact_ operator precedence table or coercion rule, not a "similar" chunk. Vector search can land in the right neighborhood and still miss the one table that matters.

2. **Section-level control.** Our sections let the agent choose how much to load. Vector search returns fixed-size chunks that can split a table in half or glue unrelated content together.

3. **The agent chooses on purpose.** The agent reads the section _descriptions_ and decides what to load by reasoning, not by embedding similarity. That plays to what the model is good at.

4. **Determinism.** The same question loads the same reference every time. No embedding drift, no stale index.

There is nuance here, and we come back to it. Structured references win for _platform documentation_, where precision is everything. But they are the wrong tool for a different job - searching a user's own code for a fuzzy, conceptual pattern. Sections 10 and 11 cover that split, which is the exact tension [Chapter 15 of the series](/blog/2026/harness-15-rag/) draws out: RAG was a context-loading pattern all along, and which retrieval you want depends on the query.

{% include figure.liquid loading="eager" path="assets/img/knowledge_graph.svg" class="img-fluid rounded z-depth-1" %}

---

## 5. Multi-Agent Orchestration

A single agent hits a wall when a task needs both breadth (searching a codebase) and depth (reasoning about design). MI Copilot handles this with a set of subagents, following the orchestrator-worker pattern from Anthropic's agent design guide [^3]. [Chapter 7 of the series](/blog/2026/harness-07-subagents/) makes the case for why: a subagent buys a lot of exploration for the price of a short summary in the main agent's context.

### Different agents for different jobs

Each subagent runs with its own profile - its own model, its own tools, its own step budget.

### The Explore subagent: fast codebase search

Explore is built for broad, quick investigation. It gets three read-only tools (`file_read`, `grep`, `glob`) and up to 30 steps to find what it needs:

```
EXPLORE_SUBAGENT = run_agent(
    model       = Haiku (fast, cheap),
    tools       = [file_read, grep, glob],     // read-only subset -no mutations possible
    max_tokens  = 8,000,
    temperature = 0.2,                          // focused, low creativity
    stop_after  = 30 steps                      // ~10 cycles of glob → grep → read
)
```

Its system prompt keeps it on a short leash: _"Be fast and efficient - don't read unnecessary files. Answer the specific question."_ It also lists common MI project paths so the subagent knows where to look. The 30-step limit is deliberate: it covers about ten rounds of "glob to find files, grep to search them, read to confirm," which is enough for most searches.

### The SynapseContext subagent: fast documentation lookup

SynapseContext gets the same three file tools _plus_ `load_context_reference`, so it can reach the whole knowledge graph. But it is capped at just **6 steps**, on purpose.

Its prompt is even more pointed: _"You are a subagent - the main agent is smarter than you. Your value is fast, accurate reference lookups. Load 1-2 docs, extract what's relevant, return it. Don't keep loading hoping to find it."_

The asymmetry is the point. SynapseContext retrieves; it does not reason. It loads a document, pulls out the relevant part, and hands it back. The reasoning stays with the main agent.

### Each subagent gets its own tools

A subagent's tools are built fresh, not filtered down from the main agent's:

```
Explore subagent tools:         { file_read, grep, glob }
SynapseContext subagent tools:  { file_read, grep, glob, load_context_reference }
DataMapper subagent tools:      { }   // pure generation, no tool access
Compact subagent tools:         { }   // processes message history only
```

These are new tool instances scoped to the project path. A subagent cannot modify files, start builds, or spawn its own subagents, because those tool schemas simply are not in its context. The safety comes from absence, not from a guard - the theme [Chapter 13](/blog/2026/harness-13-guardrails/) returns to.

### Background execution

Subagents can run in the background so the main agent keeps working:

```
// Main agent spawns a background subagent:
result = CREATE_SUBAGENT(
    type             = "Explore",
    prompt           = "Find all API definitions that use the Database connector",
    run_in_background = true
)
// Returns IMMEDIATELY with: { subagent_id: "task-subagent-a1b2c3" }
// Subagent executes concurrently in a fire-and-forget promise

// Later, main agent polls for results:
output = TASK_OUTPUT(task_id = "task-subagent-a1b2c3")
// Returns: { completed: true/false, output: "...", exit_code: ... }
```

Cancellation flows from parent to child:

```
subagent_abort_controller = new AbortController()

ON main_agent.abort:
    subagent_abort_controller.abort(reason)    // propagate cancellation downstream

ON kill_task("task-subagent-a1b2c3"):
    subagent_abort_controller.abort()          // kill only this subagent
```

Cancel the main agent and every background subagent stops with it. Kill one subagent with `kill_task` and only that one stops. [Chapter 9](/blog/2026/harness-09-background-work/) covers this pattern - work that outlives the tool call, and waking the agent when it finishes.

### Resumable subagents

Each subagent's conversation is saved to JSONL, so it can be resumed:

```
~/.wso2-mi/copilot/projects/{project-key}/{session-id}/subagents/{task-id}/
├── history.jsonl       # Full message history (tool calls + results)
└── metadata.json       # { subagentType: "Explore", createdAt: "..." }
```

The main agent can pick a finished subagent back up with new instructions:

```
RESUME_SUBAGENT(
    type   = "Explore",
    resume = "task-subagent-a1b2c3",                              // reference to prior run
    prompt = "Now also check the sequences directory for similar patterns"
)

// Internally, the resumed subagent receives:
messages = [
    ...previous_messages_from_jsonl,                               // full prior conversation
    { role: user, content: "Continue Exploration: {new_prompt}" }  // new instructions appended
]
```

That saves re-running expensive searches and keeps whatever the subagent already figured out. It is the same fact [Chapter 1](/blog/2026/harness-01-json-array/) opens with: a session is just a file you keep appending to.

### The Compact agent: keeping the window from filling

Long conversations creep toward the context limit. The Compact agent (Haiku) summarizes the history while keeping the technical detail:

```
COMPACT_CONVERSATION:
    1. Convert tool-call/result blocks to plain text descriptions
       (Haiku doesn't need tool schemas -just the textual content)
    2. Merge consecutive same-role messages
       (Anthropic API requires strict user/assistant alternation)
    3. Append summarization instructions as final user message

    summary = GENERATE_TEXT(
        model       = Haiku,
        system      = main_agent_system_prompt,    // full context for domain awareness
        messages    = converted_text_messages,
        tools       = all_23_tool_definitions,     // included for context, never executed
        max_tokens  = 16,000,
        temperature = 0                            // deterministic summary
    )
    4. Extract <summary> from response
    5. Replace conversation history with summary checkpoint in JSONL
```

The summary takes the place of the old history, and the main agent carries on knowing what came before. This is compaction from [Chapter 6](/blog/2026/harness-06-context-budget/): one deliberate, infrequent reset instead of constant trimming.

{% include figure.liquid loading="eager" path="assets/img/multi_agent.svg" class="img-fluid rounded z-depth-1" %}

---

## 6. Prompt Caching and Context Economics

Anthropic's prompt caching lets you mark part of a request as cacheable. A cache read costs 0.1x the base price (a 90% discount); the first write costs 1.25x. The cache lives for 5 minutes and needs at least 1,024 tokens. [Chapter 5 of the series](/blog/2026/harness-05-caching/) explains the mechanism and why the order of your array is what makes or breaks the discount.

MI Copilot caches in two tiers.

### Tier 1: the system prompt, always cached

The system prompt (~10-15K tokens with tool definitions) is marked cacheable:

```
system_message = {
    role:    "system",
    content: build_system_prompt(runtime_version),
    cache:   ephemeral     // Anthropic caches this block across requests (5-min TTL)
}
```

The first call pays 1.25x to write it. Every call after that, within five minutes, pays 0.1x to read it. Since the system prompt never changes during a session, it is effectively free after the first message.

### Tier 2: the conversation, cached as it grows

The `before_each_step` hook marks the last message in the array as cacheable before every API call:

```
BEFORE_EACH_STEP(messages):
    messages.last().cache = ephemeral    // growing conversation prefix stays cached
```

That grows the cached prefix one turn at a time:

```
Turn 1: [SYSTEM ✓cached] [User msg ✓cached]
Turn 2: [SYSTEM ✓cached] [User msg ✓cached] [Assistant ✓cached] [User msg → NEW cache write]
Turn 3: [SYSTEM ✓cached] [User+Asst+User ✓cached] [Assistant ✓cached] [User msg → NEW cache write]
```

### What it costs in practice

For a typical 10-turn conversation:

| Turn | Input Tokens | Cached Tokens | Cache Ratio | Effective Cost         |
| ---- | ------------ | ------------- | ----------- | ---------------------- |
| 1    | 12,500       | 0             | 0%          | 12,500 (+ 1.25x write) |
| 2    | 15,000       | 12,500        | 83%         | ~3,750                 |
| 3    | 20,000       | 17,000        | 85%         | ~4,700                 |
| 5    | 35,000       | 30,000        | 86%         | ~8,500                 |
| 10   | 60,000       | 52,000        | 87%         | ~13,200                |

**The session averages about 81% cache reuse, and individual turns reach 87-90% in longer chats.** The 81% average is dragged down by the first turn, which caches nothing. From turn 5 on, individual turns stay above 85%.

The agent logs the numbers on every step:

```
[agent] Cache ratio: 86.7% | Input: 8,234 | Cached: 53,412 | Output: 1,847
```

### The other cost: tool results piling up

Caching makes the _input_ cheap. But there is a second cost, and caching does nothing for it: tool results accumulate. A single `grep` across a big project can return 30KB of text. After a few tool calls, the window fills with output instead of reasoning. This is the point [Chapter 6](/blog/2026/harness-06-context-budget/) makes - tool results, not the conversation, are usually what eats your budget.

So we intercept oversized results before they land in the conversation:

```
AFTER_TOOL_EXECUTION(tool_name, result):
    IF result.length > 30KB:
        file_path = "{session_dir}/tool-results/{timestamp}-{tool_name}.txt"
        WRITE full result to file_path

        RETURN TO MODEL:
            "<persisted-output>
             Output too large ({size}). Full output saved to: {file_path}
             Preview (first 2KB):
             {result[0..2048]}...
             </persisted-output>"
    ELSE:
        RETURN result as-is

    // Recursion guard: if file_read is called on a tool-results/ path,
    // skip persistence to prevent infinite write-read-write loops
```

The model gets a 2KB preview and a file path. If it needs the rest, it reads the file - and a recursion guard keeps that read from being persisted all over again. A cleanup timer holds the line: 7-day retention, 50 files max, 20MB per session. The conversation stays lean, and nothing is actually lost.

---

## 7. Shell Sandboxing: Running Commands Safely

> _Trust the agent to reason; don't trust it with `sudo`._

An agent that can only read and write files is boxed in. Real work means running builds, starting servers, checking logs, and running project scripts. So MI Copilot gives the agent a `shell` tool - wrapped in a sandbox that blocks the catastrophic mistakes that make an unsandboxed agent dangerous. This is [Chapter 13](/blog/2026/harness-13-guardrails/) in practice: the body decides which of the brain's requests actually run.

### Three tiers of commands

Every command is parsed and classified before it runs:

```
CLASSIFY_COMMAND(command_tokens):

    TIER 1 -SAFE (auto-allowed, no user prompt):
        Read-only commands: cat, grep, ls, head, tail, pwd, which, stat,
                           tree, wc, sort, uniq, du, dirname, realpath, ...
        → Execute immediately

    TIER 2 -REQUIRES APPROVAL (shown to user first):
        Mutation commands: mkdir, cp, npm install, git commit, mvn build, ...
        Wrapper commands: env, xargs (can execute arbitrary sub-commands)
        Network commands not on safe list
        → Show command to user → wait for approve/deny

    TIER 3 -HARD BLOCKED (rejected unconditionally):
        Interactive shells: bash, sh, zsh, powershell
        Elevated execution: sudo, doas, su
        Interactive editors: vim, nano, emacs
        Process monitors: top, htop, watch, less, more, man
        → Return error: "Command '{cmd}' is blocked for safety."
```

The default is cautious: an unknown command needs approval. That way a new tool the model discovers can never quietly slip past the sandbox.

### Blocking escape through symlinks

Here is a subtle attack: the model writes a symlink inside the project that points at `/etc/passwd`, then reads it through the "safe" `file_read` tool. The sandbox stops this by resolving every path through `realpath` before it checks boundaries:

```
RESOLVE_SAFE_PATH(target_path):
    absolute = resolve_to_absolute(target_path)
    real     = realpath(absolute)         // follows symlinks to true location

    IF real does NOT exist:
        walk up parent directories until one exists
        resolve THAT parent via realpath
        rejoin the non-existent child segments
        // prevents /project/../../etc/passwd via non-existent intermediate paths

    IF real is outside [project_directory, /tmp]:
        BLOCK: "Path resolves outside project boundary"

    RETURN real
```

### Protecting sensitive files

Some paths are blocked no matter where they sit:

```
BLOCKED DIRECTORY SEGMENTS:  .ssh, .aws, .azure, .gnupg, .kube, .npm, .pypirc
BLOCKED FILE NAMES:          .env, .env.*, .bashrc, .zshrc, .netrc, .npmrc,
                             .git-credentials, id_rsa, id_ed25519, authorized_keys,
                             credentials, known_hosts, ...
```

The check looks at every segment of the path, so `cat ~/.ssh/id_rsa`, `cat /home/user/.ssh/config`, and `cat project/.env.production` are all caught, however the model phrases the command.

### Remembering approvals for the session

Asking permission for every single `npm run build` would be exhausting. The sandbox supports "remember this for the session" rules:

```
ON user approves "npm install lodash":
    STORE prefix rule: ["npm", "install"]

ON next command "npm install express":
    MATCH against stored rules: ["npm", "install"] is prefix of ["npm", "install", "express"]
    → Auto-approve (skip user prompt)

EXCEPTIONS -always re-prompt:
    Destructive commands (rm -rf, git reset --hard)
    Complex syntax (pipes, subshells, command substitution)
    Blocked commands (never auto-approve)
```

### Plan mode: read-only shell

In Plan mode, the sandbox tightens further - only read-only exploration gets through:

```
PLAN_MODE_SHELL_FILTER(command):
    ALLOW: ls, cat, grep, rg, find, git status, git diff, git log
    BLOCK: output redirection (>, >>), git mutations (add, commit, push),
           package managers (npm, pip, mvn), file operations (rm, mv, cp, mkdir),
           build tools
```

So the agent can study the project while planning without changing anything by accident.

{% include figure.liquid loading="eager" path="assets/img/shell_sandbox.svg" class="img-fluid rounded z-depth-1" %}

---

## 8. Language Server Integration: Real Validation in the Loop

This is probably MI Copilot's single biggest advantage over a general-purpose agent: **a language server that tells the agent, for real, whether its code is valid.**

### The validation problem

When Claude Code writes a Python function, the user can run it and see what happens. When an agent writes Synapse XML, the feedback loop is slow: you build the project, deploy to MI, send a test request, and read the logs. By the time you find out the XML was invalid, the agent has already moved on.

MI Copilot closes that loop by wiring the LemMinx XML Language Server straight into the agent's tools.

### How it works: every write is validated

The key decision: **every file operation goes through VS Code's WorkspaceEdit API, not a direct filesystem write.**

```
AGENT_WRITES_FILE(path, content):
    1. Create a WorkspaceEdit transaction
    2. IF file exists:
           Replace entire document range with new content
       ELSE:
           Create file + insert content at position 0
    3. Apply edit via VS Code API (atomic operation)
           → VS Code notifies LemMinx of the change (automatic)
           → LemMinx re-validates the file against the Synapse XSD schema
    4. Save the document
    5. Fetch diagnostics from LemMinx for the file
    6. RETURN structured validation result to the agent

    Result format:
    {
        validated:     true,
        error_count:   2,
        warning_count: 1,
        diagnostics: [
            { severity: "error",   line: 45, message: "Element 'api' not found in schema",
              code_actions: ["Add missing namespace declaration"] },
            { severity: "error",   line: 78, message: "Invalid attribute 'timeout'",
              code_actions: ["Use 'readTimeOut' instead"] },
            { severity: "warning", line: 123, message: "Deprecated element usage",
              code_actions: ["Replace with 'http-endpoint'"] }
        ]
    }
```

So **every `file_write` and `file_edit` validates the result automatically.** The agent gets the validation errors back as part of the tool response and fixes them on the next step, before the user ever sees broken XML.

### Code actions: the language server's fixes become the agent's hints

The result carries **code actions** - the quick fixes the language server itself would offer. These are not vague "fix this" notes; they are specific, applicable changes:

```
Diagnostics for CustomerAPI.xml:
  ✗ Line 45: Element 'send' is not valid here
    Available fixes:
      - "Replace with 'call' mediator"
      - "Move inside 'inSequence' block"
  ✗ Line 78: Attribute 'uri' is required
    Available fixes:
      - "Add required 'uri' attribute"
```

The agent gets these as structured data and uses the suggestions to correct itself. The result is a tight **generate → validate → fix** loop that usually settles in one or two rounds.

### Why not just trust the model?

Without validation, the agent falls back on its training data to produce valid XML - and as Section 2 showed, its instincts for Synapse are unreliable. The language server is a **source of truth** that catches:

- **Schema violations** - elements in the wrong place, missing required attributes
- **Namespace errors** - wrong or missing XML namespaces
- **Connector misconfiguration** - invalid operation names, wrong parameter types
- **Deprecation warnings** - old element names when newer ones exist

This is a real break from how general-purpose agents work. Claude Code writes Python and hopes the user runs it. MI Copilot writes XML, checks it against the schema immediately, and fixes problems before the user sees them. This is the lesson we come back to in the conclusion: giving the model a way to _check_ its work beats telling it to _be careful_.

### Validation as its own tool

We also expose validation as a standalone `validate_code` tool, for when the agent wants to check files it did not just write - batch-validating a whole project, say, or re-checking after adding a connector:

```
VALIDATE_CODE(file_paths = ["api/CustomerAPI.xml", "api/OrderAPI.xml"]):
    FOR EACH file:
        IF NOT xml_file: SKIP
        diagnostics = LemMinx.get_code_diagnostics(file)
        code_actions = LemMinx.get_code_actions(file, diagnostics)
    RETURN structured results for all files
```

The tool's description says plainly that `file_write` and `file_edit` already validate on their own, so the agent does not waste round-trips re-checking what it just wrote.

---

## 9. The Mode System: Controlled Autonomy

Three modes - Ask, Edit, and Plan - control how much the agent is allowed to do at any moment. [Appendix C of the series](/blog/2026/harness-appendix-c-modes/) covers modes as a general pattern; here is how they play out in one product.

### Block at execution time, not in the schema

The obvious way to restrict a mode is to remove tools from the schema. We do the opposite: **every tool stays in the schema, and a blocked tool returns a clear error when the agent tries to run it.**

```
WRAP_TOOL_FOR_MODE(tool_name, mode, original_execute):
    IF mode == "ask" AND tool_name NOT IN read_only_tools:
        RETURN error:
            "Tool '{tool_name}' is not available in ASK mode. Switch to EDIT mode."

    IF mode == "plan" AND tool_name is a mutation tool:
        IF tool_name == file_write AND target_path is within plan_directory:
            ALLOW    // plan file edits are permitted
        ELSE:
            RETURN error:
                "Tool '{tool_name}' blocked in PLAN mode. Only read-only and planning tools allowed."

    ELSE:
        RETURN original_execute(args)    // full access in EDIT mode
```

Why keep blocked tools visible? Because pulling a tool out of the schema changes the model's behavior in ways you cannot predict. It may chase the same goal another way - writing a shell command instead of using `file_edit`, for instance. Leaving the tool visible but returning a plain error lets the model understand _why_ it cannot act, and suggest the right mode switch to the user.

### Plan mode: design before build

Plan mode is a "think before you act" workflow. The agent can explore the codebase, load documentation, and ask questions, but it cannot touch project files. It writes its plan to a dedicated file:

```
~/.wso2-mi/copilot/projects/{key}/{session}/plan/plan.md
```

The `exit_plan_mode` tool holds until the user approves or rejects the plan. That gives you a human checkpoint for the tasks where a wrong implementation would be expensive.

---

## 10. What Didn't Work

No architecture arrives fully formed. Several of MI Copilot's decisions grew out of approaches that failed or fell short. They are worth writing down, because they make the design that survived feel earned rather than obvious.

### The "everything in the system prompt" phase

Our first idea was the simple one: put all the Synapse documentation - guides, connector definitions, expression references - into the system prompt. It reached about 60K tokens before the user typed a word. It failed three ways at once. The model could not find the relevant bit buried in a giant prompt. Every call was expensive. And documentation about connectors the user was not using actively pulled attention away from the ones they were.

The on-demand knowledge graph (Section 4) was the direct fix. Letting the agent _decide_ what to load cut the baseline context by 75% and improved accuracy on domain questions, because whatever got loaded was always relevant.

### One agent doing everything

The first architecture had a single agent do it all: search the codebase, look up docs, generate code, validate. For simple tasks that was fine. For complex ones, the agent would burn 15-20 tool calls just _finding_ the right files before it could start _reasoning_ - and those search steps ate the context the real work needed.

Handing search off to the lightweight Explore and SynapseContext subagents (Section 5) fixed it. The main agent stays on reasoning and implementation while subagents do the legwork. The step budgets (30 for Explore, 6 for SynapseContext) came straight from watching real usage: exploration is iterative, but a reference lookup should be fast or not attempted at all.

### The RAG attempt

Early on we prototyped vector search over the Synapse docs. It did well on broad questions ("how do I handle errors in Synapse?") and poorly on precise ones ("what is the coercion rule for integer + double?"). The problem is that our references are full of tables, precedence charts, and examples where _every row counts_. Vector search returning the five most similar chunks would often hand back the right _section_ and miss the critical _row_.

We kept the structured knowledge graph for platform documentation, where precision is everything. But our view shifted: semantic search is the right tool for a _different_ job - searching a user's own code for a conceptual pattern, not looking up an exact spec. That is what the planned vector layer (Section 11) is for, and it is the same two-tools-for-two-query-types point from [Chapter 15](/blog/2026/harness-15-rag/).

### When a subagent fails

We iterated a lot on subagent error handling. The rule we landed on is to surface failure loudly, not retry silently:

```
ON subagent error (timeout, model error, abort):
    IF background subagent:
        Mark task as completed with success = false
        Store error message in output
        Main agent discovers failure on next TASK_OUTPUT poll
        → Agent decides: retry with different prompt, try different approach, or report to user
    IF foreground subagent:
        Return error result directly to main agent's tool call
        → Agent sees: { success: false, message: "Subagent failed: {error}" }
        → Agent decides next action (no automatic retry)
```

We chose _not_ to retry automatically. The main agent (Sonnet) is smarter than the subagent (Haiku) and better placed to decide whether to retry the same way, rephrase the query, or switch strategy entirely. Silent retries would spend tokens on the same failing approach and hide the failure from the one agent equipped to reason about it. A one-hour cleanup timer clears out orphaned background subagents - a problem that only showed up under sustained real use.

---

## 11. What's Next: Local Embeddings and Semantic Code Retrieval

The current knowledge system is strong, but it has a gap: the agent explores a codebase with lexical search (`grep`, `glob`) and its own reasoning about what to look for. On a large project that gets slow - the Explore subagent might need 10-15 tool calls to find the right files.

### Planned: a local embedding model plus a SQLite vector database

We are building a **local semantic search layer** to speed code discovery up sharply:

- A small embedding model that runs locally (no API calls, no data leaving the machine)
- SQLite with vector extensions for the index (one file, zero config)
- Incremental indexing that updates as files change
- A new `semantic_search` tool for the Explore subagent, alongside `grep` and `glob`

The workflow change is the point. Instead of the Explore subagent making 10-plus `grep` calls to triangulate the right files, it starts with a semantic query:

```
semantic_search("error handling with retry logic for external API calls")
→ Returns top-5 file snippets ranked by cosine similarity
→ Agent reads 1-2 most relevant files
→ Task complete in 3 steps instead of 15
```

This sits alongside the structured knowledge graph, it does not replace it. The knowledge graph handles _platform documentation_, where precision beats recall; vector search handles _user code_, where conceptual similarity is the right way to retrieve. Two query types, two retrieval mechanisms - the split [Chapter 15](/blog/2026/harness-15-rag/) argues for.

### Planned: an MI documentation subagent

We also plan a subagent dedicated to searching WSO2 MI's external documentation - like SynapseContext, but backed by the full product docs with web search. It will handle questions beyond the core reference: deployment guides, configuration best practices, version migration paths, and community solutions.

{% include figure.liquid loading="eager" path="assets/img/future_architecture.svg" class="img-fluid rounded z-depth-1" %}

---

## Conclusion: What Surprised Us

If you have read this far, you have the architecture. Here is what we did not expect going in.

**Context engineering mattered more than the model.** We assumed the main quality lever would be upgrading from Haiku to Sonnet to Opus. It was not. The single biggest jump in accuracy came from adding the edge-case documentation - a static text file. The second came from language server validation. Model upgrades were third. For a domain agent, _what you put in the window_ matters more than _which model reads it_.

**The agent is better when it does not trust itself.** Our most counterintuitive finding: the agent does better work when you give it tools to _check_ its output than when you tell it to _be careful_. Writing "be precise with Synapse expressions" in the system prompt did almost nothing. Giving it a `validate_code` tool that returns real schema errors did a great deal. External verification beats internal confidence.

**Cheap models are surprisingly good at retrieval.** We expected to need Sonnet for the Explore and SynapseContext subagents. Haiku turned out to be enough, and often better. Finding files, loading docs, and pulling out the relevant part do not need stronger reasoning. The step limits (30 for Explore, 6 for SynapseContext) came from a simple realization: if Haiku cannot find it in that budget, more steps will not help - the query needs rephrasing, and the main agent is the one good at that.

**Sandboxing complexity grows faster than tool count.** Adding the `shell` tool was one function. Making it safe took path resolution, symlink detection, command classification, session approval rules, plan-mode restrictions, and sensitive-file matching - an order of magnitude more code than the tool itself. Every new mutation tool drags in security work that compounds.

**If we started over**, we would build the language server integration and the knowledge graph _first_, before any agent logic. Ground-truth validation and precise domain context are the foundation everything else stands on. The ReAct loop, subagents, caching, and sandboxing all matter, but they amplify the value of correct context and verified output. Without those, you have just built a fast, cheap agent that is confidently wrong.

None of this is specific to MI. Any domain coding assistant - for Terraform, Kubernetes, database schemas, game engines - would benefit from the same shape. The real insight is that _domain specificity is a feature, not a limit_. When you know your domain, you can engineer context a general-purpose assistant never could. The model does not need to be an expert in your field. It needs the right information, the right tools, and a way to check its own work.

> Want the theory behind all of this, built from scratch? The [**Harness Engineering 101**](/blog/2026/harness-engineering-101/) series develops every pattern above - the agent loop, caching, subagents, context budgets, guardrails, and RAG - from a single JSON array, one failure and one fix at a time.

---

## References

[^1]: Yao, S., et al. (2023). "ReAct: Synergizing Reasoning and Acting in Language Models." _ICLR 2023_. https://arxiv.org/abs/2210.03629

[^2]: Anthropic. (2025). "Building Effective Agents." Anthropic Documentation. https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview

[^3]: Anthropic. (2025). "Agent Design Patterns: Orchestrator-Workers." Anthropic Documentation. https://docs.anthropic.com/en/docs/build-with-claude/agentic-patterns

[^4]: Wei, J., et al. (2022). "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models." _NeurIPS 2022_. https://arxiv.org/abs/2201.11903

[^5]: Lewis, P., et al. (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." _NeurIPS 2020_. https://arxiv.org/abs/2005.11401

---

_WSO2 MI Copilot is available in the [WSO2 Integrator: MI](https://marketplace.visualstudio.com/items?itemName=WSO2.micro-integrator) VS Code extension. The architecture described here is production code, not a prototype._
