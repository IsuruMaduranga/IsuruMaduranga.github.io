---
layout: post
title: "Harness Engineering 101"
date: 2026-08-17
description: "A blog series about building AI agents from first principles. An LLM API is stateless: every turn you send the whole conversation as a JSON array and get text back. A harness is the program that builds, maintains, and protects that array; everything the field calls agents is a set of patches to that one loop."
tags: [agentic-ai, LLM, harness-engineering-101]
categories: [harness-engineering-101]
featured: true
giscus_comments: false
related_posts: false
toc:
  sidebar: left
---

_The LLM is the brain. The harness is the body._

Everyone talks about AI agents like they're a new kind of software: tool calls,
memory, planning, RAG, MCP, multi-agent orchestration. Stack enough of those
words together and it starts to feel like there's some hard machine humming
underneath that you're supposed to already understand.

There isn't. Here's the whole thing:

> An LLM API is stateless. Every turn, you send the entire conversation as a
> JSON array and get text back. A **harness** is the program that builds,
> maintains, and protects that array. Everything the field calls "agents" is
> a set of patches to that one loop, and each patch exists because something
> concrete broke.

That's the claim this series defends. Every "agent" feature you've heard of is
one patch to that one loop, and each patch shows up because something concrete
broke. Learn the patches in the order they were invented, as fixes to real
failures, and none of it is complicated. No frameworks, no buzzword tour, no
architecture diagrams with twelve boxes.

I'm not guessing at this. I started building generative AI systems when GPT-3.5
was the frontier: no tool calls, no caching, no agents. You used the OpenAI SDK
to send a message array and got formatted text back. Everything added since was
added for a reason, and I watched most of it show up one patch at a time.

So that's the shape of every chapter: here is the failure, here is the minimal
patch, here is what the patch costs you. A toy harness in plain Python (raw
HTTP, no SDK) grows alongside the text. By the epilogue you will have a working
mini coding agent in about 300 lines, and the durable knowledge that there is
no magic anywhere in the stack.

Production harnesses (Claude Code, and [One Code](/projects/one_code/), my
reimplementation of it on another agent runtime) appear as evidence that the
patterns are real, never as the vehicle for the explanation.

## Reading order

### Part I - The Wire (nothing is magic)

| #   | Chapter                                                               | The failure it patches              |
| --- | --------------------------------------------------------------------- | ----------------------------------- |
| 1   | [It's Just a JSON Array](/blog/2026/harness-01-json-array/)           | "How do I even talk to this thing?" |
| 2   | [The Brain: A Next-Token Black Box](/blog/2026/harness-02-the-brain/) | "Why does it behave like that?"     |
| 3   | [Tools: JSON Mapped to Functions](/blog/2026/harness-03-tools/)       | The brain can't touch the world     |
| 4   | [The Agent Loop](/blog/2026/harness-04-agent-loop/)                   | One tool call isn't enough          |
| 5   | [Caching: Why Order Is Load-Bearing](/blog/2026/harness-05-caching/)  | Resending the array gets expensive  |

### Part II - Running Long (the array under pressure)

| #   | Chapter                                                                 | The failure it patches                   |
| --- | ----------------------------------------------------------------------- | ---------------------------------------- |
| 6   | [Context Is a Budget, Not a Bag](/blog/2026/harness-06-context-budget/) | The window fills up                      |
| 7   | [Subagents: Fork the Context](/blog/2026/harness-07-subagents/)         | One array can't hold all the work        |
| 8   | [Steering the Running Loop](/blog/2026/harness-08-steering/)            | The brain drifts mid-task                |
| 9   | [Background Work and Time](/blog/2026/harness-09-background-work/)      | The loop is synchronous; the world isn't |

### Part III - The Ecosystem (naming what you already understand)

| #   | Chapter                                                                                               | The failure it patches                 |
| --- | ----------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 10  | [Every Framework Is a Wrapper Around Chapter 1](/blog/2026/harness-10-frameworks/)                    | Abstraction anxiety                    |
| 11  | [Extending the Body: MCP, Skills, Deferred Loading, Hooks](/blog/2026/harness-11-extending-the-body/) | Capabilities don't fit in the array    |
| 12  | [Debugging the Array](/blog/2026/harness-12-debugging/)                                               | You can't fix the prompt you can't see |

### Part IV - Trust, Domains, and Data

| #   | Chapter                                                           | The failure it patches                    |
| --- | ----------------------------------------------------------------- | ----------------------------------------- |
| 13  | [Reflexes and Guardrails](/blog/2026/harness-13-guardrails/)      | The loop will do something dumb           |
| 14  | [Case Study: Coding Agents](/blog/2026/harness-14-coding-agents/) | How specialized does the body need to be? |
| 15  | [RAG Was a Harness Pattern All Along](/blog/2026/harness-15-rag/) | A thousand names for one idea             |

### Epilogue

|     | Chapter                                           |                                     |
| --- | ------------------------------------------------- | ----------------------------------- |
| E   | [Build Your Own](/blog/2026/harness-16-epilogue/) | The complete toy harness, annotated |

### Appendix - Advanced Topics

Standalone pieces. Read them when you need them.

- [A. One Harness, Many Brains](/blog/2026/harness-appendix-a-model-routing/) - model routing, prompt tiers, cost engineering
- [B. Worktrees and Isolation](/blog/2026/harness-appendix-b-worktrees/) - giving parallel agents separate copies of the world
- [C. Modes and Plan Mode](/blog/2026/harness-appendix-c-modes/) - harness-enforced operating states (coding-specific)
- [D. Retries, Rate Limits, and Streaming](/blog/2026/harness-appendix-d-retries/) - the unglamorous plumbing, plus how streaming works on the wire

## The toy harness

The running example is a single Python program, built up chapter by chapter.
Each version is the previous one plus that chapter's patch: `v1_chat.py` (the
30-line chat loop) grows into `v2_tools.py`, then `v3_agent.py`, then
`v4_subagents.py`, and finally the complete ~300-line agent in the epilogue.

Python 3.10+, zero dependencies (raw `urllib`), Anthropic Messages API by
default. Swapping the wire format for OpenAI's is chapter 1 homework, and the
point of the whole series is that it's _only_ the wire format you'd swap.

## Out of scope

Training or fine-tuning models, TUI implementation, provider billing and
OAuth plumbing. This series is about the body, not about growing a brain.
