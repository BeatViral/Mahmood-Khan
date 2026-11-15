'use strict';
// Generate crawlable HTML from the WORLD POP library and five sourced research collections.
// Usage: node scripts/build-music-library.cjs [--check]
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
function h(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
function urlFor(slug){return "https://mahmoodkhan.net/music-library/"+slug+"/";}
function metaHead(title,desc,canonical,schema){
 const json=JSON.stringify(schema).replace(/</g,"\\u003c");
 return '<!doctype html>\n<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>'+h(title)+'</title><meta name="description" content="'+h(desc)+'"><link rel="canonical" href="'+h(canonical)+'">'+
 '<meta property="og:type" content="article"><meta property="og:site_name" content="Mahmood Khan">'+
 '<meta property="og:title" content="'+h(title)+'"><meta property="og:description" content="'+h(desc)+'"><meta property="og:url" content="'+h(canonical)+'">'+
 '<meta property="og:image" content="https://mahmoodkhan.net/assets/world-pop-poster.jpg"><meta name="twitter:card" content="summary_large_image">'+
 '<link rel="icon" type="image/png" href="/assets/images/power-lines-cover.png">'+
 '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'+
 '<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">'+
 '<link rel="stylesheet" href="/assets/css/styles.css"><link rel="stylesheet" href="/assets/css/music-library.css">'+
 '<link rel="stylesheet" href="/assets/css/analytics-consent.css"><script type="application/ld+json">'+json+'</script>'+
 '<script src="/assets/js/imagine-analytics.js" defer></script><script src="/assets/js/main.js" defer></script></head>';
}
function topNav(){
 return '<a class="skip-link" href="#main">Skip to content</a><header class="site-header" id="top"><a class="wordmark" href="/" aria-label="Mahmood Khan home">MAHMOOD <i>KHAN</i></a>'+
 '<button class="menu-toggle" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span class="sr-only">Open navigation</span></button>'+
 '<nav id="site-nav" aria-label="Primary navigation"><a href="/improv-symphony/">Improv Symphony</a><a href="/">Orchestras of the World</a><a href="/sound/">Sound Works</a><a href="/licensing/">Licensing</a><a href="/radio-show/">WORLD POP</a><a href="/music-library/" aria-current="page">Music Library</a><a href="/media-archive/">Source Archive</a><a href="/videos.html">Videos</a><a href="/wiki.html">Wiki</a></nav></header>';
}
function bottom(){
 return '<footer class="library-footer"><div><a class="wordmark" href="/">MAHMOOD <i>KHAN</i></a><p>Original music, stories and ideas.</p></div><div><a href="/radio-show/">WORLD POP</a> · <a href="/videos.html">Performances</a> · <a href="/privacy/">Privacy</a> · <button class="analytics-settings" id="analytics-settings" hidden type="button">Analytics choices</button></div><p>© 2026 Mahmood Matloob / Beat Viral Music.</p></footer>'+
 '<section class="analytics-choice" id="analytics-choice" aria-labelledby="analytics-choice-title" hidden><div><h2 id="analytics-choice-title">A small choice about analytics</h2><p>With your permission, Google Analytics uses cookies to help us understand visits across this website, where visitors come from and which links interest them. You can decline and use the whole site, or change your choice anytime through “Analytics choices” in the footer. <a href="/privacy/" class="privacy-link">Privacy information</a>.</p></div><div class="analytics-actions"><button type="button" id="analytics-accept">Accept analytics</button><button type="button" id="analytics-decline">Decline</button></div></section></body></html>\n';
}
function renderIndex(d){
 const canonical="https://mahmoodkhan.net/music-library/";
 const schema={"@context":"https://schema.org","@type":"CollectionPage","name":d.title,"description":d.description,"url":canonical,"publisher":{"@type":"Person","name":"Mahmood Khan","url":"https://mahmoodkhan.net/"},"mainEntity":{"@type":"ItemList","itemListElement":d.entries.map((e,i)=>({"@type":"ListItem","position":i+1,"name":e.title,"url":urlFor(e.slug)}))}};

 const order=['Firsthand journeys & interviews','Music psychology','Recording & voice','Songwriting & arrangement','Sound & equipment','World music & culture','Music & culture','Composition & performance'], groups=new Map();
 for(const name of order)groups.set(name,[]);
 for(const e of d.entries){if(!groups.has(e.category))groups.set(e.category,[]);groups.get(e.category).push(e)}
 const groupId=name=>name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const nav='<nav class="library-category-nav" aria-label="Explore by subject">'+[...groups].filter(([,items])=>items.length).map(([name,items])=>'<a href="#'+groupId(name)+'">'+h(name)+' <span>'+items.length+'</span></a>').join('')+'</nav>';
 const cards=nav+[...groups].filter(([,items])=>items.length).map(([name,items])=>'<section class="library-category" id="'+groupId(name)+'"><div class="library-category-title"><p class="eyebrow">Explore the subject</p><h3>'+h(name)+'</h3><span>'+items.length+' articles</span></div><div class="library-grid">'+items.map(a=>'<article class="library-card"><span class="eyebrow">'+h(a.category)+'</span><h4><a href="/music-library/'+h(a.slug)+'/">'+h(a.title)+'</a></h4><p>'+h(a.summary)+'</p><a class="library-link" href="/music-library/'+h(a.slug)+'/">Read article <span aria-hidden="true">→</span></a></article>').join('')+'</div></section>').join('');

 return metaHead("Music Knowledge Library | Mahmood Khan",d.description,canonical,schema)+'<body class="library-page">'+topNav()+
 '<main id="main"><section class="library-hero"><p class="eyebrow">Mahmood Khan · WORLD POP</p><h1>Inside the <em>music</em></h1><p class="library-lead">The songs. The stories. The cultures they create.</p><p>Music, recording, culture and the human experiences behind the sound — explored through the work of songwriter and producer Mahmood Khan and his weekly programme WORLD POP.</p><div class="library-actions"><a class="button button-gold" href="#articles">Explore the library</a><a class="library-link" href="/radio-show/">Listen to WORLD POP →</a><a class="library-link" href="/media-archive/">Historical interviews & documentary →</a></div></section>'+
 '<section class="library-section" id="articles" aria-labelledby="library-articles-heading"><div class="library-section-head"><p class="eyebrow">The collection</p><h2 id="library-articles-heading">Ideas worth listening to.</h2><p>Original editorial notes connected to recordings, musical practice and lived experience. These are articles, not episode transcripts. Research notes are prepared with AI assistance and link to supporting material.</p><p class="library-count">'+d.entries.length+' articles across music, recording, culture and creativity</p></div>'+cards+'</section>'+
 '<section class="library-listen" aria-labelledby="listen-heading"><div><p class="eyebrow">Hear the work</p><h2 id="listen-heading">WORLD POP — Episode 01</h2><p>Start with the music. Follow the stories. The first published episode is available here, with the full archive on the radio page.</p><p><a class="library-link" href="/radio-show/#episode-01">Visit the episode page →</a></p></div><div><audio controls preload="none" aria-label="Listen to WORLD POP Episode 01" src="'+h(d.listenUrl)+'"></audio><p class="library-small">Listener edition · WORLD POP with Mahmood Khan</p></div></section></main>'+bottom();
}
function renderArticle(d,a){
 const canonical=urlFor(a.slug), title=a.title+" | Mahmood Khan Music Library";
 const schema={"@context":"https://schema.org","@type":"Article","headline":a.title,"description":a.description,"url":canonical,"mainEntityOfPage":canonical,"dateCreated":d.updated,"author":{"@type":"Organization","name":"WORLD POP editorial library","url":"https://mahmoodkhan.net/radio-show/"},"publisher":{"@type":"Person","name":"Mahmood Khan","url":"https://mahmoodkhan.net/"},"isPartOf":{"@type":"CollectionPage","name":d.title,"url":"https://mahmoodkhan.net/music-library/"},"about":[{"@type":"Thing","name":a.category},{"@type":"Person","name":"Mahmood Khan"}]};
 if(Array.isArray(a.references)&&a.references.length)schema.citation=a.references.map(r=>r.url);
 const sections=a.sections.map(s=>'<section class="library-prose-section"><h2>'+h(s.heading)+'</h2>'+s.paragraphs.map(p=>'<p>'+h(p)+'</p>').join("")+'</section>').join("\n");
 const refs=a.links.map(r=>'<a class="library-link" href="'+h(r.url)+'">'+h(r.label)+' <span aria-hidden="true">→</span></a>').join("");

 const same=d.entries.filter(e=>e.slug!==a.slug&&e.category===a.category);
 const further=(same.length?same:d.entries.filter(e=>e.slug!==a.slug)).slice(0,3).map(e=>'<li><a href="/music-library/'+h(e.slug)+'/">'+h(e.title)+'</a></li>').join('');
 const sourceBlock=Array.isArray(a.references)&&a.references.length?'<section class="library-sources" aria-label="Sources and further reading"><h2>Sources and further reading</h2><p>These references support the research overview. The listening exercises and commentary are editorial interpretations, not conclusions attributed to the sources.</p><ul>'+a.references.map(r=>'<li><a href="'+h(r.url)+'" target="_blank" rel="noopener noreferrer">'+h(r.title)+' ↗</a></li>').join('')+'</ul></section>':'';
 const disclosure=Array.isArray(a.references)&&a.references.length?'<p class="library-research-note">AI-assisted research note · Sources linked below · Not a broadcast transcript or a first-person account by Mahmood Khan</p>':'';

 return metaHead(title,a.description,canonical,schema)+'<body class="library-page">'+topNav()+
 '<main id="main"><article class="library-article"><header class="library-article-header"><p class="eyebrow">'+h(a.category)+' · '+h(a.source)+'</p><p class="library-back"><a href="/music-library/">← All articles</a></p><h1>'+h(a.title)+'</h1><p class="library-deck">'+h(a.summary)+'</p><p class="library-small">WORLD POP music knowledge library · November 2026</p>'+disclosure+'</header><div class="library-article-layout"><div class="library-article-body">'+sections+'<section class="library-next"><h2>Hear more of the story</h2><p>This article is one part of Mahmood Khan’s wider musical work. Explore the recordings, performances and ongoing WORLD POP conversations connected to these ideas.</p><div class="library-next-links">'+refs+'</div></section>'+sourceBlock+'</div><aside class="library-aside" aria-label="Explore more"><div class="library-aside-inner"><p class="eyebrow">WORLD POP</p><h2>The songs, the stories.</h2><p>Hosted by Mahmood Khan. Listen to the first episode or explore the developing collection.</p><a class="library-link" href="/radio-show/#episode-01">Listen to Episode 01 →</a><hr><p class="eyebrow">Continue reading</p><ul>'+further+'</ul></div></aside></div></article></main>'+bottom();
}

function renderSourceArchive(d) {
 const canonical='https://mahmoodkhan.net/media-archive/';
 const schema={"@context":"https://schema.org","@type":"CollectionPage","name":d.title,"description":d.description,"url":canonical,"publisher":{"@type":"Person","name":"Mahmood Khan"},"mainEntity":{"@type":"ItemList","itemListElement":d.sources.map((s,i)=>({"@type":"ListItem","position":i+1,"name":s.title,"url":s.url}))}};
 const groups=new Map();
 for(const s of d.sources){const group=s.type.includes('interview')||s.type.includes('Interview')?'Interviews':s.type.includes('Television')||s.type.includes('Documentary')||s.type.includes('Video')?'Video and documentary leads':'Press, artist archives and programme history';if(!groups.has(group))groups.set(group,[]);groups.get(group).push(s);}
 const cards=[...groups].map(([name,items])=>'<section class="archive-group"><h2>'+h(name)+'</h2><div class="archive-source-list">'+items.map(s=>'<article class="archive-source"><p class="eyebrow">'+h(s.type)+' · '+h(s.date||'Date not established')+' · '+h(s.publisher)+'</p><h3><a href="'+h(s.url)+'" target="_blank" rel="noopener noreferrer">'+h(s.title)+' ↗</a></h3><p>'+h(s.summary)+'</p><p class="archive-status"><strong>Evidence status:</strong> '+h(s.status)+'</p><p class="archive-topics">'+(s.topics||[]).map(t=>'<span>'+h(t)+'</span>').join('')+'</p></article>').join('')+'</div></section>').join('');
 return metaHead(d.title,d.description,canonical,schema)+'<body class="library-page archive-page">'+topNav().replace('href="/music-library/" aria-current="page"','href="/music-library/"').replace('href="/media-archive/"','href="/media-archive/" aria-current="page"')+
 '<main id="main"><section class="library-hero"><p class="eyebrow">Source-led music history · Mahmood Khan</p><h1>The source <em>archive</em></h1><p class="library-lead">Interviews, video leads, documented moments and the people behind the music.</p><p>'+h(d.description)+'</p><div class="library-actions"><a class="button button-gold" href="#sources">Explore sources</a><a class="library-link" href="/music-library/">Read the music knowledge library →</a></div></section>'+
 '<section class="library-section" id="sources"><div class="library-section-head"><p class="eyebrow">Documented sources</p><h2>Follow the original record.</h2><p>Each item is labelled according to what has actually been inspected. A historical video listing is not a verified video transcript; a self-published press release is not independent reporting.</p><p class="library-count">'+d.sources.length+' source records · The documentary and television material remain priorities for video recovery</p></div>'+cards+'</section></main>'+bottom();
}

function sitemap(urls){
 const unique=[...new Set(urls)].sort();
 return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+unique.map(x=>'  <url><loc>https://mahmoodkhan.net'+h(x)+'</loc></url>').join('\n')+'\n</urlset>\n';
}
const coreUrls = [
  "/",
  "/artist.html",
  "/credits.html",
  "/notes.html",
  "/story.html",
  "/tracks.html",
  "/videos.html",
  "/wiki.html",
  "/press.html",
  "/new-album-2026.html",
  "/radio-show/",
  "/media-archive/",
  "/radio-show/launch/",
  "/radio-show/newsletter/",
  "/radio-show/share/episode-01/",
  "/improv-symphony/",
  "/sound/",
  "/licensing/",
  "/privacy/"
];
function build() {
 const data = JSON.parse(fs.readFileSync(path.join(ROOT,'content/music-library.json'),'utf8'));
 for(const topic of ['psychology','recording','songwriting','equipment','culture']){
  const file=path.join(ROOT,'content/music-library-'+topic+'.json');
  if(!fs.existsSync(file))throw new Error('Missing research collection: '+file);
  const batch=JSON.parse(fs.readFileSync(file,'utf8'));
  if(!Array.isArray(batch)||batch.length!==10)throw new Error('Expected ten articles: '+file);
  data.entries.push(...batch);
 }
 const firsthandFile=path.join(ROOT,'content/music-library-firsthand.json');
 const firsthand=JSON.parse(fs.readFileSync(firsthandFile,'utf8'));
 if(!Array.isArray(firsthand)||firsthand.length!==7)throw new Error('Expected seven firsthand chapters');
 data.entries.push(...firsthand);
 const archive=JSON.parse(fs.readFileSync(path.join(ROOT,'content/mahmood-source-archive.json'),'utf8'));
 if(!Array.isArray(archive.sources)||archive.sources.length<10)throw new Error('Missing source archive');
 const known = new Set();
 if (!Array.isArray(data.entries) || !data.entries.length) throw new Error('No library entries');
 for (const a of data.entries) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug) || known.has(a.slug)) throw new Error('Invalid or duplicate slug: '+a.slug);
  known.add(a.slug);
  if (!a.title || !a.description || !Array.isArray(a.sections) || a.sections.length < 2 || !a.sections.every(s=>s.heading && Array.isArray(s.paragraphs) && s.paragraphs.length)) throw new Error('Incomplete editorial entry: '+a.slug);
  if(a.references && (!Array.isArray(a.references)||!a.references.length||!a.references.every(r=>r.title&&/^https:\/\//.test(r.url))))throw new Error('Incomplete references: '+a.slug);
  if(a.references && a.sections.flatMap(s=>s.paragraphs).join(' ').split(/\s+/).length<160)throw new Error('Research note too short: '+a.slug);
 }
 const outputs = new Map();
 outputs.set('music-library/index.html',renderIndex(data));
 outputs.set('media-archive/index.html',renderSourceArchive(archive));
 for(const a of data.entries)outputs.set('music-library/'+a.slug+'/index.html',renderArticle(data,a));
 const allUrls = [...coreUrls,'/music-library/',...data.entries.map(a=>'/music-library/'+a.slug+'/')];
 outputs.set('sitemap.xml',sitemap(allUrls));
 let invalid=[];
 for(const [relative,content] of outputs) {
  const file = path.join(ROOT,relative);
  if(process.argv.includes('--check')) {
   if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==content)invalid.push(relative);
  } else {
   fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content,'utf8');
  }
 }
 if(invalid.length)throw new Error('Generated files out of date: '+invalid.join(', '));
 process.stdout.write((process.argv.includes('--check')?'Checked ':'Generated ')+outputs.size+' files from '+data.entries.length+' reviewed library entries.\n');
}
build();
