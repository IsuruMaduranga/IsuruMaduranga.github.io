---
layout: page
title: Lightweight Code Retrieval Models
description: MiniLM-based sentence-transformer models (22M/33M parameters) fine-tuned for domain-specific code retrieval achieving 97% Recall@10
img:
importance: 3
category: research
---

Trained and published lightweight sentence-transformer embedding models optimized for code search (512-dim) to enable fast semantic retrieval over codebases and technical text.

- Fine-tuned a MiniLM-based embedding model for code-to-code / text-to-code retrieval use cases.
- Designed for low-latency similarity search and practical deployment in RAG and developer tooling.
- Packaged and released on Hugging Face for easy integration into embedding pipelines and vector databases.

**Results:** 97% Recall@10 and 95% MRR@10 on internal benchmarks.

**Models (public on Hugging Face):**

- [L6 (22M parameters)](https://huggingface.co/isuruwijesiri/all-MiniLM-L6-v2-code-search-512)
- [L12 (33M parameters)](https://huggingface.co/isuruwijesiri/all-MiniLM-L12-v2-code-search-512)
