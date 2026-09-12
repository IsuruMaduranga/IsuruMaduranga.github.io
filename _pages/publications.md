---
layout: page
permalink: /publications/
title: publications
heading: Publications
subtitle: Papers, preprints, and manuscripts on post-editing for low-resource languages, graph learning, and anomaly detection.
description: Research publications by Isuru Wijesiri on NLP, federated graph learning, anomaly detection, and agentic AI systems.
nav: true
nav_order: 2
# Set to true to show the in-page bib search (the script only loads with it).
search: false
---

<!-- _pages/publications.md -->

{% if page.search %}
{% include bib_search.liquid %}
{% endif %}

<div class="publications">

{% bibliography %}

</div>
