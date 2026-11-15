# Mahmood Khan Music Knowledge Library

The knowledge library is part of the existing static HTML website. No WordPress, CMS migration, API keys or new hosting is required.

## Publishing an article

1. Add a verified editorial entry to `content/music-library.json` or one of the five subject collections listed below, following the existing examples. Supply a unique lowercase hyphenated slug, title, description, category, summary, source context, links and substantial sections.
2. Run `node scripts/build-music-library.cjs` from the repo root (requires Node 18+; no packages).
3. Run `node scripts/build-music-library.cjs --check` to verify all generated files (articles, index, source archive and sitemap) match the JSON sources.
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

## Research library expansion — November 2026

The library now has **53 articles: three original editorial essays and 50 new AI-assisted research notes**. The five additional source files are:

- `content/music-library-psychology.json` — 10 articles
- `content/music-library-recording.json` — 10 articles
- `content/music-library-songwriting.json` — 10 articles
- `content/music-library-equipment.json` — 10 articles
- `content/music-library-culture.json` — 10 articles

Every new note identifies an external research or educational source, provides a topic-specific listening or recording exercise, and discloses that it is **AI-assisted editorial research rather than a firsthand Mahmood Khan account or a WORLD POP broadcast transcript**. The articles were researched and initially drafted with AI; the site owner can continue improving and verifying them. Avoid representing the initial drafts as peer-reviewed papers or personal statements by Mahmood.

Run the generator on **any** system with Node 18+; it creates and checks the static files locally. No GitHub Actions, payment, or third-party build runner is required. The generated HTML is committed, so Cloudflare only needs to serve the static site. Source citations are deliberately embedded as real external links, not fabricated citation badges. External links and credits should be checked again when new factual material is added.

For WORLD POP production, add permanent episode transcripts only once there is an accurate transcript and permission to publish it. Never turn planning notes for an upcoming episode into a purported broadcast transcript. Future song profiles should have verified personnel credits, the correct recording, and links to licensed playable material.


## Source-led archive and original interviews (16 November 2026)

The website's `/media-archive/` lists **17 labelled source records** from `content/mahmood-source-archive.json`. Every entry distinguishes a first-person interview, historic video listing, promotional announcement or published article. Film and television listings are **not** labelled transcribed unless original audio/video has been located and reviewed.

Seven new source-led essays are maintained in `content/music-library-firsthand.json`, bringing the intended total to **60** articles. These pieces build on the artist's statements to Saira Agha (Daily Times, 2020), the Apogee/Amber Technology interview, SoundBetter and 2010–2011 archive announcements. Their references appear on each page. Verify source URLs and original charts if revising claims; do not embellish interviews.

### YouTube/documentary evidence gap

A November 17, 2011 MKF post attributes the documentary **Journey of a New Sound** to filmmaker **Zsolt Nagy**; a later published article also references it. The source register includes the **Mark Olford** television special and Pakistan news coverage. We have **not recovered the original YouTube video IDs or screened/transcribed these files**, so the documentary page is intentionally an evidence-led source guide, not a fabricated film summary. Once actual videos are available, preserve exact URLs, runtime, upload dates, accurate transcripts with timestamps, film credits and recording permissions.

### Google Drive ingestion

An **optional, non-deployed** Google Apps Script is available at `scripts/world-pop-drive-intake.gs` with setup guide `docs/world-pop-drive-intake.md`. If authorised by the Drive owner, it checks the existing WORLD POP Google Drive folder hourly and records MP3/audio and related transcript files in a **private Google Sheet**. This is only an intake queue. It **does not** transcribe, write articles or publish. A separate transcription/research service and verified approval workflow are required for end-to-end automation. No GitHub Actions fees or PAT are needed for this intake queue.
