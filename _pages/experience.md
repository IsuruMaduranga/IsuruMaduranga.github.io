---
layout: default
permalink: /experience/
title: experience
description: Experience of Isuru Wijesiri - AI research and engineering at WSO2, an external volunteer research collaboration with the University of Moratuwa, and earlier work in graph learning and machine learning.
nav: true
nav_order: 4
---

<a class="back-link" href="{{ '/' | relative_url }}">back home</a>

<div class="page-header">
  <h1>Experience</h1>
  <p>Research and engineering, from distributed graph learning to production AI agents.</p>
</div>

{% assign cv = site.data.cv.cv %}
{% assign skills = "NLP|LLM agents|Knowledge graphs|Code synthesis|RAG|Multi-agent systems|Prompt caching|Code retrieval|Federated learning|Graph ML|Python|TypeScript" | split: "|" %}

<h2 class="exp-heading">Top Skills</h2>
<div class="exp-skills">
  {% for skill in skills %}
    <span class="chip">{{ skill }}</span>
  {% endfor %}
</div>

{% assign experiences = cv.sections.Experience %}
{% assign work = experiences | where_exp: "e", "e.company != 'University of Moratuwa'" %}
{% assign research = experiences | where_exp: "e", "e.company == 'University of Moratuwa'" %}

<h2 class="exp-heading">Work</h2>
{% assign work_by_company = work | group_by: "company" %}
{% for group in work_by_company %}
  <h3 class="exp-company">{{ group.name }}</h3>
  <div class="timeline">
    {% for role in group.items %}
      {% assign start = role.start_date %}
      {% if start contains "-" %}
        {% assign start = start | append: "-01" | date: "%b %Y" %}
      {% endif %}
      {% assign end = role.end_date %}
      {% if end %}
        {% if end contains "-" %}
          {% assign end = end | append: "-01" | date: "%b %Y" %}
        {% endif %}
      {% else %}
        {% assign end = "now" %}
      {% endif %}
      <div class="exp-item">
        <div class="exp-head">
          <span class="exp-role">{{ role.position }}</span>
          <span class="exp-date">{{ start }} - {{ end }}</span>
        </div>
        {% if role.location %}
          <div class="exp-sub">{{ role.location }}</div>
        {% endif %}
        {% if role.summary %}
          <p class="exp-summary">{{ role.summary }}</p>
        {% endif %}
        {% if role.highlights %}
          <ul class="exp-points">
            {% for highlight in role.highlights %}
              <li>{{ highlight | markdownify | remove: "<p>" | remove: "</p>" }}</li>
            {% endfor %}
          </ul>
        {% endif %}
      </div>
    {% endfor %}
  </div>
{% endfor %}

<h2 class="exp-heading">Research</h2>
{% assign research_by_company = research | group_by: "company" %}
{% for group in research_by_company %}
  <h3 class="exp-company">{{ group.name }}</h3>
  <div class="timeline">
    {% for role in group.items %}
      {% assign start = role.start_date %}
      {% if start contains "-" %}
        {% assign start = start | append: "-01" | date: "%b %Y" %}
      {% endif %}
      {% assign end = role.end_date %}
      {% if end %}
        {% if end contains "-" %}
          {% assign end = end | append: "-01" | date: "%b %Y" %}
        {% endif %}
      {% else %}
        {% assign end = "now" %}
      {% endif %}
      <div class="exp-item">
        <div class="exp-head">
          <span class="exp-role">{{ role.position }}</span>
          <span class="exp-date">{{ start }} - {{ end }}</span>
        </div>
        {% if role.location %}
          <div class="exp-sub">{{ role.location }}</div>
        {% endif %}
        {% if role.summary %}
          <p class="exp-summary">{{ role.summary }}</p>
        {% endif %}
        {% if role.highlights %}
          <ul class="exp-points">
            {% for highlight in role.highlights %}
              <li>{{ highlight | markdownify | remove: "<p>" | remove: "</p>" }}</li>
            {% endfor %}
          </ul>
        {% endif %}
      </div>
    {% endfor %}
  </div>
{% endfor %}

<h2 class="exp-heading">Education</h2>
<div class="timeline">
  {% for edu in cv.sections.Education %}
    <div class="exp-item">
      <div class="exp-head">
        <span class="exp-role">{{ edu.institution }}</span>
        <span class="exp-date">{{ edu.start_date }} - {{ edu.end_date }}</span>
      </div>
      <div class="exp-sub">{{ edu.studyType }}{% if edu.area %}, {{ edu.area }}{% endif %}</div>
      <ul class="exp-points">
        {% if edu.score %}
          <li>{{ edu.score }}</li>
        {% endif %}
        {% for highlight in edu.highlights %}
          <li>{{ highlight | markdownify | remove: "<p>" | remove: "</p>" }}</li>
        {% endfor %}
      </ul>
    </div>
  {% endfor %}
</div>

<h2 class="exp-heading">Awards</h2>
<div class="timeline">
  {% for award in cv.sections.Awards %}
    <div class="exp-item">
      <div class="exp-head">
        <span class="exp-role">{{ award.name }}</span>
        <span class="exp-date">{{ award.date }}</span>
      </div>
      {% if award.highlights %}
        <ul class="exp-points">
          {% for highlight in award.highlights %}
            <li>{{ highlight | markdownify | remove: "<p>" | remove: "</p>" }}</li>
          {% endfor %}
        </ul>
      {% endif %}
    </div>
  {% endfor %}
</div>
