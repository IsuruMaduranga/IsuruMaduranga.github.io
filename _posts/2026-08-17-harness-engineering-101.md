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

## Read the series

The full series is a short book — sidebar, search, and all sixteen chapters
plus the appendices in reading order. It grows a toy harness in plain Python
(raw HTTP, no SDK) alongside the text; by the epilogue it's a working mini
coding agent in about 300 lines.

**[Read Harness Engineering 101 →](/harness-engineering-101/)**

The runnable harness and every chapter's source are on
[GitHub](https://github.com/IsuruMaduranga/harness-engineering-101).
