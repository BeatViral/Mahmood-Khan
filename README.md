# POWER LINES — Mahmood Khan

The official one-page album site for *POWER LINES* (2026), built as a lightweight static website.

## Local preview

There is no build process or dependency install. Open `index.html` in a browser, or serve this folder with any static web server.

## Update the official media

- Album cover: replace `assets/images/power-lines-cover.png` (retain the filename, or update references in `index.html`).
- Track video URLs: edit the `tracks` array at the top of `assets/js/main.js`. Replace each uppercase placeholder with its full official `https://...` YouTube URL.
- Featured video: replace `POWER_LINES_FEATURED_YOUTUBE_EMBED_URL` in `assets/js/main.js` with the official `https://www.youtube.com/embed/...` URL.
- Canonical URL: replace `CANONICAL_URL_PLACEHOLDER` in `index.html` once the public domain is known.

Until a real URL is supplied, each track displays “Coming soon” and cannot open a broken page.

## GitHub Pages

This is a static site: no build command is required. In GitHub Pages, publish from the repository root on the selected branch. All project assets use relative paths, so it works from a project subdirectory.

## Cloudflare Pages

Connect this repository as a static HTML project. Leave **Build command** blank and set **Build output directory** to `/` (repository root).
