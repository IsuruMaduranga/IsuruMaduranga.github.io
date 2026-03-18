---
layout: page
title: MI Copilot
description: Cursor/Claude Code style coding agent for WSO2 Micro Integrator with 300+ daily active users
img:
importance: 1
category: work
---

MI Copilot is a production-deployed AI coding assistant for WSO2 Micro Integrator (MI), similar in design to Cursor or Claude Code. It enables developers to generate, debug, and refine WSO2 Synapse integration artifacts through natural language.

**Key Capabilities:**

- **Natural Language to Synapse DSL** with version-aware retrieval (connector-specific + schema-aware context)
- **Agent Mode:** A Cursor/Claude Code-style upgrade that turns MI Copilot into an agentic integration engineer inside VS Code
  - End-to-end agent architecture using Vercel AI SDK with streaming, multi-step tool calling, and autonomous task execution
  - 22 tools across 8 categories: read/edit projects, manage connectors, validate via XML LSP (LemMinx), run builds, and control runtime workflows
  - Ask / Edit / Plan modes with safe tool-gating, plan approval, todo tracking, and user-question blocking for guided autonomy
- **Execution-guided verification:** XSD/Schematron validation, LSP diagnostics, MI sandbox tests + automated repair loops
- **Developer experience:** Multi-session chat persistence, @file mentions, undo/checkpoint system, conversation compaction, multimodal attachments
- **Operational efficiency:** Advanced prompt caching (~90% cost reduction) and production hardening/observability hooks

**Impact:** **300+ active daily users**

**Impact:** Hardened for enterprise use with security controls, throttling, caching, and production stability.

**Links:** [Documentation](https://mi.docs.wso2.com/en/latest/develop/mi-for-vscode/mi-copilot/) | [Source](https://github.com/wso2/vscode-extensions) | [Agent Mode Branch](https://github.com/wso2/vscode-extensions/tree/mi-agent-mode)
