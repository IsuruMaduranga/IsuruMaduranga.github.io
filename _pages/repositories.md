---
layout: page
permalink: /repositories/
title: github
heading: GitHub
subtitle: Open-source projects and GitHub contributions, mostly AI tooling and research code.
description: Open-source projects and GitHub contributions by Isuru Wijesiri - AI tools, NLP frameworks, and research code.
nav: true
nav_order: 5
---

{% assign gh_user = site.data.repositories.github_users | first %}

{% if gh_user %}

## Activity

<div class="activity">
  <img
    src="https://ghchart.rshah.org/{{ site.activity_color | default: 'dc2626' }}/{{ gh_user }}"
    alt="GitHub contribution graph for {{ gh_user }}"
    loading="lazy"
  >
</div>
{% endif %}

{% if site.data.repositories.github_repos %}

## GitHub Repositories

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo.liquid repository=repo %}
  {% endfor %}
</div>
{% endif %}
