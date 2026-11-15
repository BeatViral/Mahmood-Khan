# Mahmood Khan Music Knowledge Library

The knowledge library is part of the existing static HTML website. No WordPress, CMS migration, API keys or new hosting is required.

## Publishing an article

1. Add an editorially reviewed entry to `content/music-library.json` following the existing examples. Supply a unique lowercase hyphenated slug, title, description, category, summary, source context, links and substantial sections.
2. Run `node scripts/build-music-library.cjs` from the repo root (requires Node 18+; no packages).
3. Run `node scripts/build-music-library.cjs --check` to verify all generated files match the JSON source.
4. Inspect links, facts, recordings, credits and browser layout, then commit the JSON **and** the generated HTML and sitemap in the same pull request.

The builder generates /music-library/index.html, each /music-library/[slug]/index.html and the root sitemap.xml. All article bodies appear in the HTML returned to crawlers without requiring JavaScript.

## No GitHub Actions or paid CI required

This site is published from Git to Cloudflare as static HTML. The music library does **not** depend on GitHub Actions, paid GitHub runners or a separate build service. The generated article files and sitemap are committed directly into the repository. Validate locally (or in the connected coding environment) with `node scripts/build-music-library.cjs --check` before merging. Historical failed GitHub Actions runs may remain visible in the pull-request history, but no music-library workflow is included in the proposed change.

## Editorial rules

- **WORLD POP is the ongoing source**. Episodes can lead to one or more articles, but publication is based on the actual recorded episode, approved transcript or verified editorial notes. A topic discussed for an unreleased episode must **not** be represented as a broadcast transcript or a published recording.
- Preserve Mahmood's firsthand experiences; separate them from external research. Do not invent first-person quotations, third-party credits, chart placements, anecdotes or completed projects.
- Avoid stock, thin AI text. Each article must answer a real question and contain material worth referencing independently of its links to the artist.
- Link to the *actual published* recording or song when available, rather than inventing audio URLs. Rights to third-party music in broadcasts remain subject to the existing programme arrangements.
- Before publishing an article generated with AI assistance, verify names, credits, citations and legal permissions, and review its wording.

## Indexing and measurement

- `robots.txt` permits search bots, including OAI-SearchBot, and references `sitemap.xml`. Cloudflare firewall/bot settings can still affect crawler access; verify the **deployed** URLs after merge.
- Article pages include canonical URLs, plain-text body content, Open Graph tags and Article JSON-LD. Structured data helps machine readability but does not guarantee AI search inclusion, citation or listening exposure.
- Track incoming AI search referrals, returning visitors and visits to recordings on the existing site. Do not count page views as confirmed listeners.
- The root sitemap covers the currently identified canonical site pages. Add newly published non-library pages to `coreUrls` in the builder. Don't use arbitrary changing `lastmod` values.

## First release

The first three pieces are **editorial notebooks, not claimed transcripts**: crossing cultures, orchestral improvisation and recording 'flying hours'. WORLD POP Episode 01 is the only episode linked with a verified playable source in this starter release. Episode 02 materials may be incorporated when approved and published.
