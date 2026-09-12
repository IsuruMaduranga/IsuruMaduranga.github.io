---
layout: page
title: One Code
description: Claude Code with the model slot left open. The full workflow, open source, on any model or provider.
img:
importance: 1
category: research
tags: [agentic-ai, LLM, developer-tools]
---

One Code runs the whole Claude Code workflow (subagents, git worktrees, auto mode, ultracode workflows, plan mode) on the model of your choice. Claude Code is a good harness; it just ships bolted to one model. One Code unbolts it. Keep Claude Code for the work that earns its best model, and reach for One Code whenever a cheaper or different model fits the job.

**What it does:**

- **Any model, any provider.** Anthropic, OpenAI, Gemini, or a local model. Bring your own and switch mid-session with `/model`. Nothing stops you.
- **Mix providers in a single session.** The parent and each subagent choose their own model and provider, so an ultracode workflow can fan out to a cheap tier while the parent stays on a frontier model. A single-gateway setup cannot do this, which is usually the reason people switch.
- **Your Claude Code setup runs unchanged.** `CLAUDE.md`, `.claude/commands`, `.claude/skills`, `.claude/agents`, `.mcp.json`, plugins, and permission rules are all picked up as they are. No migration, and no second config file to keep in sync.
- **Capability-tiered prompting.** A weaker model gets more guidance, not less. Not out of politeness; it is how you get output you can use.
- **Built as a [pi](https://github.com/earendil-works/pi) package, not a fork**, so it is extensible with your own extensions, themes, and settings. Forks go stale; packages do not have to.
- **Free and open source (MIT).**

The features that make Claude Code good (the steering, the permission gate, the context management) live in the harness, not the model. One Code brings all of them across, because the good part was never the logo. It is the practical companion to my [Harness Engineering 101](/blog/2026/harness-engineering-101/) series, which builds these ideas up from first principles.

**Source:** [GitHub](https://github.com/IsuruMaduranga/one-code) | Install: `npm install -g @one-ai/one-code`
