---
layout: page
title: projects
permalink: /projects/
heading: Projects
subtitle: A mix of production systems, research code, and side projects I could not leave alone.
description: Projects by Isuru Wijesiri including WSO2 Integrator Copilot, federated GNN, code retrieval models, and agentic AI frameworks.
nav: true
nav_order: 3
display_categories: [work, research]
---

<div class="project-list">
  {% for category in page.display_categories %}
    {% assign categorized_projects = site.projects | where: "category", category | sort: "importance" %}
    {% if categorized_projects.size > 0 %}
      <h2 class="entry-group">{{ category }}</h2>
      {% for project in categorized_projects %}
        {% include project_item.liquid %}
      {% endfor %}
    {% endif %}
  {% endfor %}
</div>
