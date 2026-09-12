---
layout: page
permalink: /blog/
title: writings
heading: Writings
subtitle: Long-form thoughts on agentic AI, NLP, and building systems that hold up in production.
description: Blog posts by Isuru Wijesiri on NLP, agentic AI, code generation, and machine learning research.
nav: true
nav_order: 1
# Set to true to show the in-page search bar (the script only loads with it).
search: false
---

<div class="writings">
  {% if page.search %}
    <input
      type="text"
      id="writings-search"
      class="writings-search"
      placeholder="Search posts..."
      spellcheck="false"
      autocomplete="off"
    >
  {% endif %}

{% assign tag_pairs = '' | split: ',' %}
{% for tag in site.tags %}
{% assign count = tag[1].size %}
{% assign padded = count | prepend: '000' | slice: -3, 3 %}
{% assign pair = padded | append: '::' | append: tag[0] %}
{% assign tag_pairs = tag_pairs | push: pair %}
{% endfor %}
{% assign sorted_pairs = tag_pairs | sort | reverse %}

{% if sorted_pairs.size > 0 %}

<div class="writings-tags">
{% for pair in sorted_pairs limit: 8 %}
{% assign parts = pair | split: '::' %}
{% assign tag = parts[1] %}
{% assign count = parts[0] | plus: 0 %}
<a class="chip" href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">{{ tag }} <span>{{ count }}</span></a>
{% endfor %}
</div>
{% endif %}

{% assign posts_by_year = site.posts | group_by_exp: 'post', 'post.date | date: "%Y"' %}
{% for group in posts_by_year %}

<h2 class="entry-group">{{ group.name }}</h2>
{% for post in group.items %}
{% include post_item.liquid %}
{% endfor %}
{% endfor %}

</div>

{% if page.search %}

  <script defer src="{{ '/assets/js/writings-search.js' | relative_url | bust_file_cache }}"></script>

{% endif %}
