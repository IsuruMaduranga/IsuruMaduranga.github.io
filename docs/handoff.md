# Handoff

Current state of the site after a full design and content pass. Last updated
2026-09-12.

## Where things stand

The site was restyled and its pages reworked in five commits on `main`. None
are pushed yet.

| Commit    | Subject                                                       |
| --------- | ------------------------------------------------------------- |
| `623a69e` | Redesign theme and unify the list pages                       |
| `ec1fbbd` | Rename teachings to talks and add GitHub activity             |
| `8dd526b` | Add experience and long-version pages                         |
| `6b19b08` | Rework the writings, projects, publications, and GitHub pages |
| `1829c5b` | Rewrite copy, correct affiliations, replace profile photo     |

Pushing triggers the Cloudflare Pages deploy, and because `_data/cv.yml`
changed it also triggers `render-cv.yml`, which regenerates the CV PDF and
commits it back to the repo.

## What changed

- Theme: zinc palette, a single red accent (`#dc2626`), Inter and JetBrains
  Mono, a 720px column, flat cards, and a compact navbar that collapses below
  768px. Tokens are in `_sass/_themes.scss`, overrides in `_sass/_minimal.scss`,
  and the shared list primitives in `_sass/_entries.scss`.
- Pages: writings (was blog, keeps `/blog/`), projects, publications (flat
  list, manuscripts added), GitHub (was repositories, keeps `/repositories/`)
  with a contribution graph, experience (renders `_data/cv.yml`), a long bio at
  `/long/`, and talks (was teachings, keeps only the blockchain session, and
  `/teaching/` 301s to `/talks/`).
- Homepage: bio, GitHub activity graph, Latest (was News), social icons.
- Copy: conversational voice with humor grounded in real facts. The University
  of Moratuwa is described as an external volunteer collaboration, not an
  affiliation, and the WSO2 role is scoped to the AI-for-code sub-team in the
  Integration team.
- Profile photo: `assets/img/prof_pic.jpg` replaced with a 640x800 JPEG at
  49 KB, down from 172 KB.

## Verified

- `RUBYOPT="-E utf-8" bundle exec jekyll build` exits 0.
- Prettier is clean on the changed files.
- Every page returns 200 from `bundle exec jekyll serve`.
- Headless Chrome checks: the navbar fits on one line at 768px and wider and
  collapses to the hamburger below that, the activity graph sits under the bio,
  and the new profile photo renders.

## Traps and gotchas

- Jekyll aborts on a bare-integer `date` in collection front matter. Use a
  `year` field instead. See `docs/findings.md`.
- Prettier's Markdown formatter turns `target="_blank"` into `target="\_blank"`
  inside `_pages/*.md`. Row markup lives in `.liquid` includes to avoid it. See
  `docs/findings.md`.
- Section renames keep their URLs on purpose. Only `/teaching/` has a redirect.
- Cloudflare's build has no ImageMagick, so responsive image generation stays
  off. The photo was optimized locally with `magick`.
- `render-cv.yml` triggers on changes to `cv.yml` and commits the regenerated
  PDF back to the repo.

## Open items and next steps

- Push the five commits.
- Optional, not started: per-role skill chips on the experience page (needs a
  separate data file, since adding a `skills` field to `cv.yml` risks the
  RenderCV validation), a teaching section on experience, tag filtering on the
  projects page, a footer easter egg, and running the humanize skill over
  `_data/cv.yml` (which also changes the CV PDF).
- Optional: rename section URLs (`/blog/` to `/writings/`, `/news/` to
  `/latest/`) with redirects. Deliberately not done yet.
- Untracked and not part of this work, left alone: `.agents/`, `blog.md`,
  `skills-lock.json`.

## Environment

- During the session a dev server ran at http://127.0.0.1:4000
  (`bundle exec jekyll serve`).
- The humanize skill is installed at `~/.claude/skills/humanize/SKILL.md`. It
  appears in the skill list only after a session reload.

## Resume

Read this file, then `docs/decisions.md` for the choices behind the structure
and `docs/findings.md` for the build gotchas.
