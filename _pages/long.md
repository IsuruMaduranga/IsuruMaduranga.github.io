---
layout: default
permalink: /long/
title: long
description: The long version of Isuru Wijesiri's bio, from distributed graph research to production AI agents at WSO2.
---

<a class="back-link" href="{{ '/' | relative_url }}">back home</a>

<div class="page-header">
  <h1>The Long Version</h1>
</div>

I started out working on graphs that were too big to fit in memory.

My undergraduate research at the University of Moratuwa was on privacy-preserving machine learning over distributed graphs. The problem was easy to state and annoying to solve: train a graph neural network for link prediction across organizations without pooling everyone's private data, and without a data center to do it. We built a memory-efficient, federated training scheme on top of JasmineGraph, partitioned the graph across workers, and trained parallel GCN workers on the pieces. It trained link prediction on 10+ GB graphs like DBLP-V11 on a single commodity server, three to five times faster than the in-memory baselines, and it became a paper at IEEE Big Data 2020. A follow-up extended it to cross-organization learning, where common-attribute and common-entity aggregations align heterogeneous graphs and improve link prediction by 3 to 7 percent over single-organization baselines.

Around the same time, a small team and I built a self-supervised anomaly detector for autonomous drones. It forecast the next video frame with a conditional GAN and the next IMU vector with a pair of LSTMs, then flagged whatever did not match. It reached 94% accuracy and 0.95 F1 on video, and 100% accuracy and 0.98 F1 on IMU, and took first runner-up at the IEEE Signal Processing Cup 2020 finals.

I finished the degree with First Class Honours, a 3.87 GPA, Dean's List in seven of eight semesters, and the university's award for Best R&D Project. Before WSO2 I spent six months at Persistent Systems designing architectures and proof of concepts for an API marketplace, and before that an internship at Zeptolytics, where I built an automated machine learning pipeline for SME analytics: Word2Vec-based column identification, feature selection, and AutoML over XGBoost and CatBoost.

I joined WSO2 in 2022 as a Software Engineer, building open-source API management and integration features. One of those was a distributed transaction counter that had to count transactions at 10,000+ per second with sub-millisecond latency, which is a fun problem right up until it is a production problem. I also led a low-code generative AI framework that supported multiple LLM backends and vector stores, which is where I stopped treating language models as a research topic and started treating them as infrastructure.

In 2024 I became a Senior Software Engineer and got to build the thing I am best known for: [WSO2 Integrator Copilot](https://mi.docs.wso2.com/en/latest/develop/mi-for-vscode/mi-copilot/). The idea was to put a coding agent inside VS Code that turns plain English into Synapse DSL and Ballerina code for enterprise integration. It grew from a rough demo into a system that pairs a structured domain knowledge graph with version-aware retrieval, XSD and Schematron validation, language-server diagnostics, and automated repair loops, so the agent can check its own work instead of confidently inventing a connector API from 2019. Agent Mode added 23 tools across 8 categories, multi-step planning, and autonomous execution, with Ask, Edit, and Plan modes to keep the autonomy bounded. On HumanEval it improved 29 percentage points over the base model with zero-shot prompting. Advanced prompt caching cut operating cost by roughly 90%. It now serves **700+ developers a day**. I also embedded domain-specific retrieval models for semantic code search and started a small language model effort for on-prem, low-latency code generation, where the model turned out to be the easy part.

In 2026 I moved into an Associate Technical Lead role, where I lead the AI-for-code sub-team in the WSO2 Integration team: agent harnesses and small language models. The question I care about now is why LLMs fail at low-resource code generation, and how to measure agent behavior properly. IntegrationBench is a 100-task benchmark that grades LLM agents by whether the integrations they build actually run. Looking right does not earn credit.

The research half of my life is an external volunteer collaboration with the University of Moratuwa, where I lead **Google-funded** work on automatic post-editing for Sinhala and Tamil. Machine translation into these languages is rough, and correcting it by hand is expensive, so we teach models to correct it themselves with controllable, minimal edits. Much of the work is catching where a model copies the source instead of translating it, and does so with no less confidence. That produced Confident but Wrong, a constrained-decoding diagnostic for low-resource post-editing (first author, **Findings of EMNLP 2026**), and EnSiTa, a trilingual English-Sinhala-Tamil parallel dataset and benchmark now under submission.

Outside of work I build tools I wanted and could not find. [One Code](/projects/one_code/) runs the full Claude Code workflow on any model or provider, which is Claude Code with the model slot left open. Toolflow is a small framework for agents with structured output guarantees. Naturalpy lets you call Python functions from natural language. The code retrieval models I fine-tuned (22M and 33M parameters) hit 97% Recall@10 and 95% MRR@10 on domain-specific code search, and ship on Hugging Face. They are small enough to be unglamorous, which is the point. I write about all of it, mostly in [Harness Engineering 101](/blog/2026/harness-engineering-101/), a series that builds an agent from a single JSON array up, and in a [deep dive on how Copilot works](/blog/2026/building-claude-code-style-agent/).

One idea runs through the research: explicit structure helps when frontier models make errors under limited supervision, whether that structure is a constrained decoder for post-editing or a knowledge graph and language-server checks for code synthesis.

Since graduate school the part that keeps my interest is everything around the model: retrieval, validation, cost, and what happens when it fails. That is what decides whether a model is useful in production.
