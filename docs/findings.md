# Findings

Facts about tools and services we do not control, each confirmed by running or
testing against this repo or the live site.

## Jekyll silently drops `_headers` unless it is in `include:`

Jekyll ignores every path starting with an underscore unless `_config.yml`
lists it under `include:`. `_headers` was tracked in git but never reached
`_site`, so Cloudflare Pages never applied any of its cache rules. Confirmed by
running `bundle exec jekyll build` and finding no `_site/_headers`, and by
`https://isuruwijesiri.com/_headers` returning 404 while live responses carried
none of the file's directives.

The same trap applies to `_redirects` if one is ever added.

## `jekyll-cache-bust`'s `bust_css_cache` filter does not work on this repo

The gem (v0.0.1,
`lib/jekyll-cache-bust.rb:46`) digests the glob `assets/_sass/**/*`. This site
keeps its SCSS partials in `_sass/` at the repo root, so the glob matched
nothing, `Dir[]` returned an empty array, and the filter hashed an empty
string. Every build stamped `main.css` with
`?v=d41d8cd98f00b204e9800998ecf8427e`, the MD5 of `""`, so the token could
never change and a long browser or edge TTL would have pinned a stale
stylesheet indefinitely.

Replaced by `bust_sass_cache` in `_plugins/cache-bust-sass.rb`, which digests
`assets/css/main.scss` plus `_sass/**/*`. Verified that editing a partial
changes the token and that reverting the edit restores it.

The gem's other filter, `bust_file_cache`, takes a different code path
(`file_content`, not `directory_files_content`) and works correctly. Only the
CSS filter was affected.

## Cloudflare Pages serves 404s as uncacheable

A missing path returns `cache-control: no-store` and
`cf-cache-status: BYPASS`. These requests still count in the denominator of the
account-level cache hit rate, so heavy bot scanning for non-existent paths
drives that metric down no matter how well real content is cached.

Measured 2026-09-07: about 66% of all requests to the zone were 404s, which
capped the achievable cache hit rate near 34% and made the reported 3.26% look
far worse than the ~10% actually achieved on non-404 traffic.

## Cloudflare rewrites `Cache-Control` before it reaches the browser

Live responses carried `public, max-age=7200, must-revalidate` on every URL
including CSS, which matches none of the origin's own headers. A dashboard
Browser Cache TTL setting overrides origin `max-age` for browsers. It does not
affect edge TTL, which `s-maxage` and Cache Rules control. If `_headers` values
do not show up in browser-visible responses after a deploy, check
Caching > Configuration > Browser Cache TTL and set it to "Respect Existing
Headers".

**Open check.** Immediately after pushing `0c9293c`, live responses still read
`max-age=7200, must-revalidate`, which is expected while the Pages build is
still running. Re-run the command below once the deployment finishes. If it
still shows 7200 rather than 3600, the dashboard override above is the cause
and `_headers` is being masked for browsers even though edge TTL now follows
`s-maxage`.

```bash
curl -sSI https://isuruwijesiri.com/ | grep -i 'cache-control\|cf-cache-status'
# want: cache-control: public, max-age=3600, s-maxage=3600
```

## Most assets are not fingerprinted, so long TTLs are unsafe

Only CSS and most JS carry a `?v=` cache-bust token. Auditing a build for
`/assets/` references without one turned up 24 files: the RenderCV PDF at
`/assets/rendercv/rendercv_output/Isuru_Wijesiri_CV.pdf`,
`/assets/js/search-data.js`, `/assets/js/bootstrap.bundle.min.js`, and 21
images. The first two are regenerated in place at a stable URL - the PDF by
`render-cv.yml`, which commits it back to the repo, and the search index on
every build. A long `immutable` TTL on `/assets/*` would have pinned a stale CV
and a stale search index at unchanged URLs with no way to force a refresh.

For a fingerprinted file a long TTL is harmless, because new content lives at a
new URL and the stale entry is simply never requested again. What actually
gates how fast an update reaches users is the HTML TTL, since the HTML carries
the new asset URLs.

Do not raise TTLs again without re-running that audit.

## Do not rely on a Pages deployment purging the edge cache

Cloudflare's docs imply a new deployment invalidates cached assets, but with a
custom domain there are two cache layers - the Pages cache and the zone cache
for isuruwijesiri.com - and community reports describe stale content surviving
both a deploy and a manual "Purge Everything". This is from documentation and
community threads, not from a test on this site.

Consequence: pick TTLs that are safe without a purge. As of 2026-09-07
`_headers` uses a single one-hour rule for everything, so a bad deploy or a
stale file self-corrects within the hour.

Caching HTML at the edge is where nearly all of the cache hit rate lives
anyway: the content-type breakdown was html 15.95k against css 146, so HTML is
about 81% of requests and static assets are a rounding error. Long asset TTLs
buy very little here.

## The Pages build command must include `bundle exec`

Every Cloudflare Pages build failed from 2026-03-23 to 2026-09-07. The last
good deploy was `5424cd9`; roughly six months of commits never reached the live
site. Confirmed from the outside before the log was available:
`/assets/img/huggingface.svg`, added that September, returned 404, and the live
homepage contained "One Code" zero times despite two commits adding it.

The build log shows the configured command was:

```
Executing user command: RUBYOPT="-E utf-8" jekyll build
```

with no `bundle exec`, and it ends in:

```
You have already activated public_suffix 7.0.5, but your Gemfile requires
public_suffix 7.0.2. (Gem::LoadError)
```

Without `bundle exec`, the asdf `jekyll` shim starts under plain RubyGems,
which activates the newest `public_suffix` present in the build image (7.0.5).
Jekyll then calls `Bundler.setup` through `PluginManager.require_from_bundler`,
Bundler sees a gem already activated at a version the lockfile does not allow,
and aborts. `public_suffix` is transitive here, pulled in by `addressable`
(`>= 2.0.2, < 8.0`) and locked at 7.0.2.

This was a latent bug, not a regression in this repo. The missing `bundle exec`
was harmless until Cloudflare's build image changed - it now runs Ruby 3.4.4
with Bundler 4.0.4 and ships a newer `public_suffix` - which is why the failure
starts in March with no matching code change.

Fix: set the build command in the dashboard to
`RUBYOPT="-E utf-8" bundle exec jekyll build`. Cloudflare Pages takes the build
command from project settings, not from a file in the repo, so this cannot be
fixed by a commit.

## There is no Cloudflare CLI for cache analytics

`wrangler` (official, runs via `npx wrangler`) covers Workers and Pages deploys
only. Cache hit rate, status-code breakdowns and `cacheStatus` histograms come
from the GraphQL Analytics API at `https://api.cloudflare.com/client/v4/graphql`,
queried with curl and an API token that has Analytics read permission.
`flarectl` is a third-party CLI for zone configuration, also not analytics.

## al-folio clips mermaid diagrams; rendering the book with mdBook fixed it

al-folio loads mermaid.js only when a post opts in with a
`mermaid: {enabled: true}` front-matter block (`_includes/scripts.liquid` gates
on `page.mermaid.enabled`); with `zoomable: true` it also loads d3 and wraps
each diagram in a d3-zoom pan viewport. Two separate clipping bugs, both
confirmed by rendering the local build in headless Chrome (puppeteer, Chrome for
Testing) and measuring node boxes:

1. `zoomable: true` renders the diagram in a fixed-size pannable viewport that
   overflows the content column and clips the diagram vertically. Setting
   `zoomable: false` removes the d3 wrapper.
2. Even with `zoomable: false`, flowchart node text overflows its boxes.
   mermaid sizes each box by measuring the label in its default
   `"trebuchet ms", verdana, arial, sans-serif` stack, but al-folio renders the
   labels as HTML inside `<foreignObject>`, which inherits the site web font
   Plus Jakarta Sans (wider). The rendered text is ~13px wider than the box, so
   it is clipped. The mermaid SVG is also emitted `width="100%"` with no
   `height`, which mis-sizes it (the same percentage-width/no-height trap that
   clipped the pre-rendered SVGs used as `<img>` before).

Resolution: stop rendering these diagrams in al-folio. The series is served as
an mdBook at `/harness-engineering-101/` (built from the harness-engineering-101
repo, committed here as static output). mdbook-mermaid renders the diagrams
correctly - no competing web font on the labels, correct box sizing - verified
with the same headless harness. See `HANDOFF.md` in the book repo for the full
decision.

## The blog's own jekyll-minifier corrupts the mdBook CSS (not Cloudflare)

The mdBook at `/harness-engineering-101/` broke in two ways in production, and
only in production: the sticky menu bar overlapped the docked sidebar, and the
sidebar toggle did nothing - clicking it never collapsed the sidebar.

Cause: `jekyll-minifier`, an al-folio plugin listed in `_config.yml`, minifies
every static `.css` file this site writes, using CSSminify2 (a Ruby port of the
YUI compressor). Inside `calc()` that compressor reads the `--` of a custom
property as two minus operators, so

    calc(var(--sidebar-width) + var(--sidebar-resize-indicator-width))

is written out as

    calc(var( -  - sidebar - width)+var(--sidebar-resize-indicator-width))

which is invalid, so the browser drops the whole declaration. Every mdBook rule
that places the sidebar or offsets the content goes through such a `calc()`, so
each of them disappears:

- `#mdbook-sidebar-toggle-anchor:not(:checked) ~ .sidebar { transform:
  translate(calc(0px - var(--sidebar-width) - ...)) }` - the sidebar never
  slides off-screen, so it cannot collapse.
- `#mdbook-sidebar-toggle-anchor:checked ~ .page-wrapper { margin-inline-start:
  calc(var(--sidebar-width) + ...) }` - the content column and its sticky menu
  bar are not pushed past the sidebar, so they overlap it.

Why this looks like an edge problem and is not: `output_css` in jekyll-minifier
returns early unless `JEKYLL_ENV=production`, so `bundle exec jekyll serve`
serves the book's CSS untouched and the local render is always correct. The
committed files are byte-identical to the mdBook build, and only the deployed
copy differs - which reads as "something rewrites it in transit". It is rewritten
at build time, in this repo.

Fix: exclude the book's directory in `_config.yml`, which makes jekyll-minifier
copy those files verbatim:

    jekyll-minifier:
      exclude: ["robots.txt", "assets/js/search/*.js", "harness-engineering-101/*"]

Verified two ways. Byte-level: run `JEKYLL_ENV=production bundle exec jekyll
build`, then compare every `harness-engineering-101/**/*.css` against its source
- all eight identical, no `var( -  - ` left anywhere in the output. Runtime:
serve `_site`, drive headless Chrome, click the sidebar toggle exactly once, and
sample the state over the next 1.5s. The fixed build animates the sidebar out
(its right edge goes 300 -> 15 -> 0) and settles at `display:none` with the
wrapper margin at `0px`. The deployed copy leaves it at right 300,
`display:block`, `transform:none` indefinitely while the margin still drops to
0, so the content slides underneath a sidebar that is still on screen. Click
once and sample over time - a harness that clicks repeatedly and measures
between clicks can toggle twice and report a false failure. Keep that exclude
when merging al-folio upstream.

Notes:

- **Pre-minifying the CSS ourselves does not help.** jekyll-minifier re-minifies
  regardless of how compact the input already is; an earlier attempt to dodge
  this with esbuild made no difference. The only skips are by path: the `exclude`
  list, or a filename ending in `.min.css` / `.min.js`. The book's sync script
  still pre-minifies with esbuild, but now only to cut the payload.
- **JS goes through a different plugin.** `jekyll-terser` replaces every static
  `.js` that does not end in `.min.js` and has no exclude option, so
  jekyll-minifier's exclude does not cover it. Its output is correct, so the
  book's JS is left to it.
- **Cloudflare Auto Minify was never involved.** The earlier version of this
  finding blamed it. `PATCH .../settings/minify` returning `success:true` with
  `modified_on: null`, and an `autominify: off` Configuration Rule deploying with
  no observable effect, are both consistent with the feature already being
  retired on this zone - not with it being stuck on. That standing no-op
  Configuration Rule (phase `http_config_settings`, expression `true`) is still
  on the zone; it is harmless, and removing it needs a token with
  `Config Rules: Edit`.
- **Development Mode and cache purges were red herrings.** Turning on
  Development Mode made every request `DYNAMIC` and the CSS was still mangled;
  the right reading of that was "the origin is serving mangled bytes", not "the
  edge minifies past the cache". Separately, `purge_everything` and purge-by-file
  both returned `success:true` while the CSS kept coming back `HIT` with old
  bytes, which reinforces the existing "do not rely on a Pages deployment purging
  the edge cache" finding; query strings do not force a miss either, since Pages
  ignores them in the cache key.

To check this class of bug in future, compare the deployed bytes with the repo
directly - `diff <(curl -s https://isuruwijesiri.com/<path>) <repo path>` - and
then reproduce locally with `JEKYLL_ENV=production bundle exec jekyll build`
rather than `jekyll serve`.
