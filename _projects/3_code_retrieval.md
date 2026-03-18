---
layout: page
title: Lightweight Code Retrieval Models
description: MiniLM-based sentence-transformer models (22M/33M parameters) fine-tuned for domain-specific code retrieval achieving 97% Recall@10
img:
importance: 3
category: research
---

Designed and fine-tuned MiniLM-based sentence-transformer models (512-dim embeddings) for domain-specific code retrieval using contrastive learning. Optimized for low-latency semantic search in RAG systems.

**Results:** 97% Recall@10 and 95% MRR@10 on internal benchmarks.

**Models (public on Hugging Face):**

- [L6 (22M parameters)](https://huggingface.co/isuruwijesiri/all-MiniLM-L6-v2-code-search-512)
- [L12 (33M parameters)](https://huggingface.co/isuruwijesiri/all-MiniLM-L12-v2-code-search-512)
