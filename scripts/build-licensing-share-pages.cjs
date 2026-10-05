const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const site = 'https://mahmoodkhan.net';
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/licensing.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

if (!Array.isArray(catalogue.tracks) || catalogue.tracks.length === 0) throw new Error('No licensing tracks found.');

for (const track of catalogue.tracks) {
  if (!/^[a-z0-9-]+$/.test(track.id)) throw new Error(`Unsafe track ID: ${track.id}`);
  const label = [track.title, track.version].filter(Boolean).join(' — ');
  const pageUrl = `${site}/licensing/share/${track.id}/`;
  const listenUrl = `/licensing/#track-${track.id}`;
  const title = `${label} — Mahmood Khan | Music Licensing`;
  const description = `Listen to the preview of ${label} by Mahmood Khan. Explore the official catalogue for film, television, games, advertising and new media.`;
  const escapedTitle = escape(title);
  const escapedDescription = escape(description);
  const escapedLabel = escape(label);
  const version = track.version ? `<p class="share-version">${escape(track.version)}</p>` : '';
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapedTitle}</title><meta name="description" content="${escapedDescription}">
<link rel="canonical" href="${pageUrl}"><meta name="theme-color" content="#09131b">
<meta property="og:type" content="website"><meta property="og:site_name" content="Mahmood Khan"><meta property="og:url" content="${pageUrl}"><meta property="og:title" content="${escapedTitle}"><meta property="og:description" content="${escapedDescription}"><meta property="og:image" content="${site}/assets/images/licensing-hero-story.png"><meta property="og:image:alt" content="Mahmood Khan — Music for a Bigger Story licensing artwork"><meta property="og:image:width" content="1672"><meta property="og:image:height" content="941"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapedTitle}"><meta name="twitter:description" content="${escapedDescription}"><meta name="twitter:image" content="${site}/assets/images/licensing-hero-story.png">
<link rel="icon" type="image/png" href="/assets/images/power-lines-cover.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/css/styles.css"><link rel="stylesheet" href="/assets/css/licensing.css"><link rel="stylesheet" href="/assets/css/analytics-consent.css"><script src="/assets/js/imagine-analytics.js" defer></script></head>
<body class="subpage licensing-page"><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="wordmark" href="/" aria-label="Mahmood Khan home">MAHMOOD <i>KHAN</i></a><a class="licensing-link" href="/licensing/">LICENSING</a></header>
<main id="main" class="licensing-share-landing"><div><p class="eyebrow">OFFICIAL SONG PREVIEW / MAHMOOD KHAN</p><h1>${escapedLabel}</h1>${version}<p>${escapedDescription}</p><div class="licensing-share-actions"><a class="button button-gold" href="${listenUrl}">Listen to the preview <span aria-hidden="true">↗</span></a><a class="share-back" href="/licensing/">Explore the full catalogue</a></div></div><figure><img src="/assets/images/licensing-hero-story.png" alt="Mahmood Khan — Music for a Bigger Story licensing artwork" width="1672" height="941"></figure></main>
<footer class="licensing-footer licensing-wrap"><a class="wordmark" href="/">MAHMOOD <i>KHAN</i></a><p>© 2026 Mahmood Matloob / Beat Viral Music.</p><a href="/privacy/">Privacy</a></footer></body></html>
`;
  const directory = path.join(root, 'licensing', 'share', track.id);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), html);
}

console.log(`Generated ${catalogue.tracks.length} song-specific share pages with unique title, description, canonical URL and social metadata.`);
