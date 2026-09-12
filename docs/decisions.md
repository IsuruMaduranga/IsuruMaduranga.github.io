# Decisions

Choices made during the design and content pass on 2026-09-12.

Unreviewed: these were written at session end without the user reviewing each
entry. Prune or adjust anything that does not match intent.

## Section renames keep their existing URLs

Choice: blog becomes writings but the URL stays `/blog/`; news becomes Latest
but stays `/news/`. Only `/teaching/` got a redirect, to `/talks/`.

Reason: preserving the URLs keeps existing links, tag archives, and search
results working. It also matches isala.me, whose nav says "blog" at `/blog/`.

Rejected: renaming URLs and adding a redirect per path, which is more surface
for 404s.

## The talks collection is data only

Choice: `output: false`, so entries render as a list and link out to YouTube,
with no per-talk page.

Reason: there is one recorded talk, and the video already lives on YouTube.

Rejected: an embedded iframe and a detail page per talk.

## Per-page search bars are opt-in

Choice: `search: false` in a page's front matter gates both the input and its
script.

Reason: the current content does not need search, and flipping the flag
re-enables it per page without code changes.

Rejected: deleting the search feature.

## Contribution graph via ghchart, repo cards stay on github-readme-stats

Choice: the homepage and GitHub page use `ghchart.rshah.org` for the
contribution graph, while repo pin cards keep using the existing stats service.

Reason: ghchart renders contributions only and cannot render repo cards. Its
SVG ships a light background, so dark mode flips it with a CSS filter.

Rejected: dropping the repo cards, or replacing the stats service entirely.

## One shared entry-list stylesheet

Choice: `_sass/_entries.scss` holds the row, heading, chip, and page-header
styles, and each page's partial keeps only its own extras.

Reason: the four lists had drifted and duplicated the same rules. The writings
page was the reference look.

Rejected: leaving four near-identical partials.

## Navbar compacts and collapses at the medium breakpoint

Choice: nav links are 0.875rem with tighter padding and `white-space: nowrap`,
and the nav uses `navbar-expand-md`.

Reason: seven items plus the search shortcut overflowed the 720px column, and
the "⌘ k" hint wrapped onto two lines. Below 768px the hamburger takes over.

Rejected: hiding the shortcut text or trimming the nav.

## The experience page renders from cv.yml

Choice: the page is generated from `_data/cv.yml` with Liquid rather than
hand-written.

Reason: one source for the CV keeps the page and the RenderCV PDF in step.

Rejected: a separate hand-maintained page, which drifts.

## The long bio lives at /long/

Choice: the long bio is at `/long/`, and the homepage stays the about page.

Reason: avoids a second page at `/about/` competing with the homepage.

Rejected: `/about/` to mirror isala.me.
