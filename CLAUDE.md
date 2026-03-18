# CLAUDE.md

## Project Overview

Personal academic website for **Isuru Wijesiri** built with the [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme. Deployed via **Cloudflare Pages** (primary) and **GitHub Pages** (gh-pages branch, secondary).

- **Live site:** https://isuruwijesiri.com
- **Owner:** Isuru Wijesiri - Associate Technical Lead (AI R&D) at WSO2
- **Stack:** Jekyll 4.x, Ruby, Liquid templates, SCSS, Bootstrap/MDB

## Build & Development

### Local Development

```bash
# Using Ruby directly (Ruby 4.0.2+ required)
bundle exec jekyll serve

# Using Docker
docker compose pull && docker compose up
# Site at http://localhost:8080
```

### Before Committing

```bash
# Format all files (required - CI checks this)
npx prettier . --write

# Verify build
bundle exec jekyll build
```

### Deployment

- **Cloudflare Pages:** Auto-builds on push to `main`
  - Build command: `RUBYOPT="-E utf-8" bundle exec jekyll build`
  - Output directory: `_site`
  - ImageMagick is NOT available (disabled in config)
- **GitHub Pages:** `deploy.yml` workflow builds and pushes to `gh-pages` branch

## Key Files

| Path | Purpose |
|------|---------|
| `_config.yml` | Site configuration (url, features, plugins) |
| `_data/cv.yml` | CV data in RenderCV format |
| `_data/repositories.yml` | GitHub repos shown on repositories page |
| `_bibliography/papers.bib` | Publications (BibTeX, must be ASCII-only) |
| `_pages/about.md` | Homepage (permalink: /) |
| `_posts/` | Blog posts |
| `_projects/` | Project pages (categories: `work`, `research`) |
| `_news/` | News announcements on homepage |
| `_teachings/` | Course pages |
| `CNAME` | Custom domain: isuruwijesiri.com |
| `_headers` | Cloudflare Pages cache rules |

## Important Conventions

### Content Rules
- **No em dashes** (`—`) anywhere - use hyphens with spaces (` - `) instead. Em dashes look AI-generated.
- **No emojis** in content unless explicitly requested.
- **ASCII only** in `_bibliography/papers.bib` - non-ASCII characters break bibtex-ruby on Cloudflare's US-ASCII locale.
- Blog post dates may need `future: true` in `_config.yml` since build servers run in UTC.

### CV Data Format (RenderCV)
- Uses `headline` (not `label`) for subtitle
- Awards use `name` (not `title`)
- `authors` in Publications must be a YAML list, not a string
- No `image` or `summary` at top level

### Templates
- Awards template uses `{% assign award_title = entry.title | default: entry.name %}` to support both field names
- Teaching section in `_layouts/cv.liquid` renders via `experience.liquid`
- Projects page `display_categories` must match actual categories used: `[work, research]`

### Cloudflare Pages Constraints
- No ImageMagick (responsive image generation disabled)
- System locale is US-ASCII - use `RUBYOPT="-E utf-8"` in build command
- `en_US.UTF-8` locale is not installed

## Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `deploy.yml` | push to main | Build Jekyll and push to gh-pages |
| `render-cv.yml` | changes to cv.yml | Render CV PDF via RenderCV |
| `prettier.yml` | push/PR | Check code formatting |

## Style Preferences
- Keep responses concise, no trailing summaries
- Use hyphens not em dashes
- Don't add unnecessary comments, docstrings, or type annotations
- Prefer editing existing files over creating new ones
