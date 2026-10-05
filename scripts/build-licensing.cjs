const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/licensing.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if (!catalogue.instrumentalsAvailableForAll || catalogue.tracks.some(t => !t.instrumentalAvailable)) throw new Error('All songs have instrumentals, as confirmed by the rights holder.');
for (const track of catalogue.tracks) {
  for (const key of ['audioUrl', 'instrumentalUrl']) {
    if (track[key] && !/^\/assets\/audio\/licensing\/[a-z0-9-]+\.mp3$/.test(track[key])) throw new Error(`Unexpected public audio path for ${track.id}: ${track[key]}`);
  }
}
const cards = (tracks, offset) => tracks.map((track, i) => {
  const hasOriginal = Boolean(track.audioUrl);
  const hasInstrumental = Boolean(track.instrumentalUrl);
  const modes = hasOriginal && hasInstrumental
    ? `<div class="licensing-modes" role="group" aria-label="${escape(track.title)} preview version"><button type="button" data-audio-mode="original" aria-pressed="true">Original</button><button type="button" data-audio-mode="instrumental" aria-pressed="false">Instrumental</button></div>`
    : hasInstrumental
      ? `<div class="licensing-modes" role="group" aria-label="${escape(track.title)} preview version"><button type="button" data-audio-mode="instrumental" aria-pressed="true">Instrumental</button></div>`
      : `<p class="instrumental-on-request">Instrumental available on request</p>`;
  return `<article class="licensing-track" id="track-${escape(track.id)}" data-track-id="${escape(track.id)}"><div class="track-top"><span>${String(offset+i+1).padStart(2,'0')}</span><span>${escape(track.rights)}</span></div><h3>${escape(track.title)}</h3><p class="licensing-track-credit">${escape([track.version,track.credit].filter(Boolean).join(' · '))}</p><div class="licensing-player" data-original="${escape(track.audioUrl || '')}" data-instrumental="${escape(track.instrumentalUrl || '')}" data-initial-mode="${hasOriginal ? 'original' : 'instrumental'}">${modes}<div class="licensing-player-controls"><button type="button" class="licensing-play" aria-label="Play ${escape(track.title)}"><span aria-hidden="true">▶</span></button><label class="licensing-seek-label"><span class="sr-only">Seek within ${escape(track.title)}</span><input class="licensing-seek" type="range" min="0" max="1000" value="0" aria-label="Seek within ${escape(track.title)}" disabled></label><span class="licensing-time" aria-live="off">0:00 / --:--</span></div><p class="licensing-player-status" role="status"></p></div><a class="licensing-track-enquiry" data-licensing-event="licensing_enquiry" data-track-id="${escape(track.id)}" data-track-title="${escape(track.title)}" href="mailto:mahmoodkhanteam@gmail.com?subject=${encodeURIComponent('Licensing enquiry — '+track.title)}">Enquire about this recording <span aria-hidden="true">↗</span></a></article>`;
}).join('\n');
const featured = catalogue.tracks.filter(track => track.featured);
const more = catalogue.tracks.filter(track => !track.featured);
const file=path.join(root,'licensing/index.html');
let html=fs.readFileSync(file,'utf8');
html=html.replace(/<!-- LICENSING TRACKS START -->[^]*?<!-- LICENSING TRACKS END -->/,'<!-- LICENSING TRACKS START -->\n'+cards(featured,0)+'\n<!-- LICENSING TRACKS END -->');
html=html.replace(/<!-- LICENSING MORE TRACKS START -->[^]*?<!-- LICENSING MORE TRACKS END -->/,'<!-- LICENSING MORE TRACKS START -->\n'+cards(more,featured.length)+'\n<!-- LICENSING MORE TRACKS END -->');
html=html.replace(/<!-- LICENSING DATA START -->[^]*?<!-- LICENSING DATA END -->/,'<!-- LICENSING DATA START -->\n<script type="application/json" id="licensing-data">'+JSON.stringify(catalogue).replace(/</g,'\\u003c')+'</script>\n<!-- LICENSING DATA END -->');
html=html.replace(/THE COMPLETE SELECTION \/ \d+ RECORDINGS/,`THE COMPLETE SELECTION / ${catalogue.tracks.length} RECORDINGS`);
fs.writeFileSync(file,html);
console.log(`Built ${featured.length} featured and ${more.length} additional licensing selections, including ${catalogue.tracks.filter(t => t.instrumentalUrl).length} supplied instrumental previews. Instrumentals are available for every song.`);
