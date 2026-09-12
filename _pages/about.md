---
layout: about
title: about
permalink: /
description: Isuru Wijesiri - AI researcher and engineer at WSO2 and an external volunteer researcher with the University of Moratuwa, working on NLP, agentic code generation, and graph ML.
subtitle: >
  Associate Technical Lead (AI R&D) at <a href="https://wso2.com" target="_blank">WSO2</a> &
  external volunteer researcher with the <a href="https://uom.lk" target="_blank">University of Moratuwa</a>

profile:
  align: right
  image: prof_pic.jpg
  image_circular: false
  more_info: >
    <p>Colombo, Sri Lanka</p>
    <p><a href="mailto:imwijesiri@gmail.com">imwijesiri@gmail.com</a></p>

social: true

announcements:
  enabled: true
  scrollable: true
  limit: 5

# GitHub contribution graph on the homepage.
activity: true
---

I build AI systems that have to survive contact with real users. Lately that means two very different problems: coding agents for a domain no model was trained on, and language technology for Sinhala and Tamil, which is about as low-resource as it gets.

At WSO2 I lead the AI-for-code sub-team in the Integration team, which builds agent harnesses and small language models. The main thing I have built is [WSO2 Integrator Copilot](https://mi.docs.wso2.com/en/latest/develop/mi-for-vscode/mi-copilot/), a coding agent that turns plain English into Synapse DSL and Ballerina code. It does version-aware retrieval so it does not confidently invent a connector API from 2019, and it checks its own work by actually running it. Both sound like obvious requirements until you watch a model get them wrong with complete confidence. **700+ developers use it every day**, which is either a great validation or a lot of pressure, depending on the morning. I wrote a [technical deep dive](/blog/2026/building-claude-code-style-agent/) on how it works, and a series called [Harness Engineering 101](/blog/2026/harness-engineering-101/) that builds an agent from a single JSON array up. On the side I maintain [One Code](/projects/one_code/), an open-source agent harness that runs the Claude Code workflow on any model or provider, on the theory that the harness is the part worth keeping.

The research half of my life is an external volunteer collaboration with the University of Moratuwa, where I lead **Google-funded** work on automatic post-editing for Sinhala and Tamil. Machine translation into these languages is rough, and fixing it by hand is expensive, so we teach models to fix it themselves. A lot of that work is catching the moments where a model quietly gives up and copies the input instead of translating, and it does that with the same confidence as when it translates well. That work produced a constrained-decoding diagnostic for post-editing (**Findings of EMNLP 2026**, first author) and EnSiTa, a trilingual dataset and benchmark (preprint, under submission). I also lead IntegrationBench, which grades LLM agents by whether the integrations they build actually run.

Before that I spent a lot of time on graphs and on hardware that was not supposed to handle them. My federated GCN trained on billion-edge graphs on commodity machines (**IEEE Big Data 2020**), and an earlier project used video and IMU data to catch failing drones without any labels (**IEEE Signal Processing Cup 2020, runner-up**).

**Interests:** NLP, Knowledge-grounded reasoning, AI agents and code synthesis, Retrieval-augmented generation, Federated and graph learning, Privacy-preserving ML

<a class="entry-link" href="{{ '/long/' | relative_url }}">the long version</a>
