// Rebuild the static, no-JavaScript-compatible gallery after editing charts.json.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const records = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/charts.json'), 'utf8'));
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const chart = id => records.find(record => record.id === id);
function image(record) {
  return `<a class="chart-image-link" data-chart-id="${record.id}" href="${record.src}" target="_blank" rel="noopener" aria-label="Enlarge ${esc(record.title)}: ${esc(record.platform)} ${esc(record.category)}, ${esc(record.rank)}"><img src="${record.src}" alt="${esc(record.title)} — ${esc(record.rank)} on ${esc(record.platform)} ${esc(record.category)}${record.date ? ', '+esc(record.date) : ''}." width="${record.width}" height="${record.height}" loading="lazy" decoding="async"><span class="image-open">View original ↗</span></a>`;
}
function card(record, featured = false) {
  return `<article class="chart-card${featured ? ' chart-card-featured' : ''}" data-record-id="${record.id}" data-platform="${esc(record.platform)}"><div class="chart-card-top"><span>${esc(record.platform)}</span><strong>${esc(record.rank)}</strong></div>${image(record)}<div class="chart-card-copy"><p class="chart-category">${esc(record.category)}</p><h3>${esc(record.title)}</h3><p class="chart-date">${esc(record.date || 'Undated archive image')}</p></div></article>`;
}
const platforms = [...new Set(records.map(record => record.platform))];
const ordered = [...records].sort((a,b) => ['Billboard','ARIA','iTunes','AIR','Amazon','Google Play'].indexOf(a.platform)-['Billboard','ARIA','iTunes','AIR','Amazon','Google Play'].indexOf(b.platform));
const content = `<section class="chart-success section" id="chart-success" aria-labelledby="chart-success-title"><div class="wrap">
  <div class="section-heading"><p class="eyebrow">THE CHART HISTORY / MAHMOOD KHAN</p><span class="small-label">ORIGINAL SONGS. INTERNATIONAL CHART SUCCESS.</span></div>
  <h2 id="chart-success-title">THE MUSIC<br>TRAVELLED.<br><span>THE CHARTS<br>TELL THE STORY.</span></h2>
  <div class="chart-intro"><p>Orchestral recordings. World songs. Jazz, electronic and dance. A body of original music with a chart history that reaches across releases, categories and years.</p><a class="text-link" href="#chart-archive">Explore every chart record <span aria-hidden="true">↓</span></a></div>
  <div class="chart-totals"><div><strong>${records.length}</strong><span>Distinct archive images</span></div><div><strong>${platforms.length}</strong><span>Chart &amp; store sources</span></div><div><strong>6</strong><span>Songs together in one Top 10</span></div></div>
  <div class="chart-source-strip" aria-label="Sources represented"><span>Billboard</span><span>ARIA</span><span>iTunes</span><span>AIR</span><span>Amazon</span><span>Google Play</span></div>
  <div class="six-songs"><div class="six-songs-copy"><p class="eyebrow">SIX CONSECUTIVE POSITIONS / iTUNES WORLD SONGS</p><h3>One artist.<br>Six songs.<br><span>One Top 10.</span></h3><p>Ginoo. One Line Down. Tere Ooper Chaon. Din Jagay. Two versions of Merry Go Round.</p><p>Six consecutive positions, from No. 4 to No. 9, in the same chart snapshot.</p><span class="six-songs-date">Captured in April 2021 · US archive</span></div><figure>${image(chart(7))}<figcaption>Each song, each position, together in the original screenshot.</figcaption></figure></div>
  <div class="milestone-heading"><p class="eyebrow">ACROSS THE CATALOGUE</p><h3>More songs.<br><span>More milestones.</span></h3></div>
  <div class="chart-highlights">${[52,17,22,43,2,42].map(id=>card(chart(id),true)).join('\n')}</div>
  <details class="chart-archive" id="chart-archive"><summary><span><small>THE COMPLETE COLLECTION</small>Explore all ${records.length} chart records</span><span class="archive-toggle" aria-hidden="true">+</span></summary>
    <div class="archive-body"><p class="archive-intro">Every distinct chart image in the supplied collection, including different weeks, positions and versions. Select any image to read the original at full size.</p>
    <div class="chart-controls" hidden><div class="chart-filters" role="group" aria-label="Filter chart records"><button type="button" class="active" data-filter="All" aria-pressed="true">All <span>${records.length}</span></button>${['Billboard','ARIA','iTunes','AIR','Amazon','Google Play'].map(platform=>`<button type="button" data-filter="${platform}" aria-pressed="false">${platform} <span>${records.filter(record=>record.platform===platform).length}</span></button>`).join('')}</div><label class="chart-search-label" for="chart-search">Find a song, album or chart<input id="chart-search" type="search" placeholder="Search the collection…" autocomplete="off"></label><p id="chart-results" role="status" aria-live="polite">Showing ${records.length} of ${records.length} records</p></div>
    <div class="chart-grid">${ordered.map(record=>card(record)).join('\n')}</div><p class="chart-empty" hidden>No records match that search. Try another title or choose All.</p>
    <p class="archive-note">Positions refer to the specific chart category and snapshot shown. Billboard, ARIA, AIR and store rankings are identified separately. iTunes “World” / “Worldwide” is a genre category. Original screenshots and available date details are included; the collection is not a count of unique chart appearances.</p></div>
  </details>
  <div class="chart-press"><p class="eyebrow">THE STORY BEHIND THE RECORDS</p><div><a href="https://www.prlog.org/12832838-mahmood-khan-hits-number-1-on-billboard.html" target="_blank" rel="noopener">The Willoughby album reaches Billboard No. 1 <span>Beatviral Music · PRLog · 2020 ↗</span></a><a href="https://www.issuewire.com/mahmood-khan-who-is-one-of-the-most-charted-australian-music-artists-of-all-time-1736768743868268" target="_blank" rel="noopener">A career across charts and musical worlds <span>Beat Viral Music · IssueWire · 2022 ↗</span></a></div></div>
  <div class="chart-bridge"><p>The next chapter starts<br>with the same thing.</p><strong>The songs.</strong><a class="text-link" href="#uk-chapter">Discover the proposed UK recordings <span aria-hidden="true">↓</span></a></div>
</div></section>
<dialog id="chart-dialog" class="chart-dialog" aria-labelledby="chart-dialog-title"><div class="chart-dialog-header"><div><p id="chart-dialog-platform" class="eyebrow"></p><h2 id="chart-dialog-title"></h2></div><button type="button" id="chart-close" aria-label="Close chart viewer">Close ×</button></div><div class="chart-dialog-tools"><button type="button" id="chart-prev" aria-label="Previous chart">← Previous</button><span id="chart-counter"></span><button type="button" id="chart-next" aria-label="Next chart">Next →</button><button type="button" id="chart-zoom" aria-pressed="false">Actual size</button><a id="chart-original" target="_blank" rel="noopener">Open original ↗</a></div><div id="chart-image-stage" class="chart-image-stage"><img id="chart-dialog-image" alt=""></div><div class="chart-dialog-caption"><p id="chart-dialog-meta"></p><p id="chart-dialog-note"></p></div></dialog>
<script type="application/json" id="chart-records">${JSON.stringify(records).replace(/</g,'\\u003c')}</script>`;
const file = path.join(root, 'imagine/index.html');
const html = fs.readFileSync(file, 'utf8');
if (!html.includes('<!-- CHART SHOWCASE START -->')) throw new Error('Missing chart insertion marker');
fs.writeFileSync(file, html.replace(/<!-- CHART SHOWCASE START -->[\s\S]*?<!-- CHART SHOWCASE END -->/, `<!-- CHART SHOWCASE START -->\n${content}\n<!-- CHART SHOWCASE END -->`));
const target = path.join(root,'assets/images/charts');
fs.mkdirSync(target,{recursive:true});
for (const record of records) {
  const destination = path.join(root,record.src);
  const source = path.join(root,record.source);
  if (fs.existsSync(source)) fs.copyFileSync(source,destination);
  else if (!fs.existsSync(destination)) throw new Error(`Missing original image: ${record.source}`);
}
console.log(`Built gallery with ${records.length} distinct images across ${platforms.length} sources.`);
