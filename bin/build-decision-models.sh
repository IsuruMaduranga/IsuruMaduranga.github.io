#!/usr/bin/env bash
# Build the decision-models post as an mdBook and copy the static output into
# decision-models/, served at isuruwijesiri.com/decision-models/. mdBook renders
# the post's Mermaid diagrams correctly; al-folio clips their labels (see
# docs/findings.md). Reuses the Mermaid and back-link scripts from the
# Harness Engineering 101 book.
#
#   bin/build-decision-models.sh
#   ARTICLE_DIR=/path/to/decision-models BOOK_REPO=/path/to/blogs bin/build-decision-models.sh
#
# After it runs: commit decision-models/ and push.
set -euo pipefail

SITE_REPO="$(cd "$(dirname "$0")/.." && pwd)"
ARTICLE_DIR="${ARTICLE_DIR:-$HOME/ml/writings/decision-models}"
BOOK_REPO="${BOOK_REPO:-$HOME/ml/blogs}"
DEST="$SITE_REPO/decision-models"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

mkdir -p "$WORK/src/diagrams"
cp "$BOOK_REPO"/{mermaid.min.js,mermaid-init.js,site-back-link.js,external-links-new-tab.js} "$WORK/"
cp "$ARTICLE_DIR"/diagrams/*.png "$WORK/src/diagrams/"
sed 's#](experiments/)#](https://github.com/IsuruMaduranga/writings/tree/main/decision-models/experiments)#' \
  "$ARTICLE_DIR/article.md" > "$WORK/src/decision-models.md"
printf '# Summary\n\n[Decision Models](decision-models.md)\n' > "$WORK/src/SUMMARY.md"

cat > "$WORK/book.toml" <<'TOML'
[book]
title = "Decision Models: An LLM With the Talking Taken Out"
description = "Decision models pick from your list of answers instead of writing a reply. Built up from how an LLM works to reading answer probabilities from GPT-2 and Qwen2.5, a trained head, and Laya's internals."
authors = ["Isuru Wijesiri"]
language = "en"
src = "src"

[build]
build-dir = "book"
create-missing = false

[preprocessor.mermaid]
command = "mdbook-mermaid"

[output.html]
default-theme = "rust"
preferred-dark-theme = "ayu"
site-url = "/decision-models/"
git-repository-url = "https://github.com/IsuruMaduranga/writings/tree/main/decision-models"
additional-js = ["mermaid.min.js", "mermaid-init.js", "site-back-link.js", "external-links-new-tab.js"]

[output.html.search]
enable = true
TOML

echo "Building mdBook ..."
( cd "$WORK" && mdbook build )

# Pre-minify only to cut the payload. jekyll-minifier must keep skipping this
# directory (the decision-models/* exclude in _config.yml), because it corrupts
# calc(var(--x)) rules.
echo "Pre-minifying CSS ..."
find "$WORK/book" -name '*.css' -print0 | while IFS= read -r -d '' f; do
  npx -y esbuild "$f" --minify --outfile="$f" --allow-overwrite >/dev/null 2>&1
done

rm -rf "$DEST"
cp -R "$WORK/book" "$DEST"
echo "Done: $DEST"
