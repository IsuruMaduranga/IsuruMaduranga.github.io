---
layout: page
title: Lightweight Code Retrieval Models
description: MiniLM-based sentence-transformer models (22M/33M parameters) fine-tuned for domain-specific code retrieval achieving 97% Recall@10
img:
importance: 3
category: research
---

Lightweight sentence-transformer embedding models (512-dim) for code search, small enough to run fast over a whole codebase.

- Fine-tuned a MiniLM-based model for code-to-code and text-to-code retrieval.
- Built for low-latency similarity search in RAG and developer tooling.
- Released on Hugging Face, ready to drop into an embedding pipeline or vector database.

**Results:** 97% Recall@10 and 95% MRR@10 on internal benchmarks.

**Models (public on Hugging Face):**

- [L6 (22M parameters)](https://huggingface.co/isuruwijesiri/all-MiniLM-L6-v2-code-search-512)
- [L12 (33M parameters)](https://huggingface.co/isuruwijesiri/all-MiniLM-L12-v2-code-search-512)
