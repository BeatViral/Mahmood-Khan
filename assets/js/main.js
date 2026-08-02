/* Replace only the URL values below when official YouTube links are available. */
const tracks = [
  ['01', 'Power Lines', 'POWER_LINES_YOUTUBE_URL'], ['02', 'Changes', 'CHANGES_YOUTUBE_URL'],
  ['03', 'New Tide', 'NEW_TIDE_YOUTUBE_URL'], ['04', 'Mei Raasta', 'MEI_RAASTA_YOUTUBE_URL'],
  ['05', 'One Line Down', 'ONE_LINE_DOWN_YOUTUBE_URL'], ['06', 'Pretty Eyes', 'PRETTY_EYES_YOUTUBE_URL'],
  ['07', 'Two Islands', 'TWO_ISLANDS_YOUTUBE_URL'], ['08', 'True Love', 'TRUE_LOVE_YOUTUBE_URL'],
  ['09', 'The Great Leaving', 'THE_GREAT_LEAVING_YOUTUBE_URL'], ['10', 'Sweet Freedom', 'SWEET_FREEDOM_YOUTUBE_URL']
];
const isUrl = value => /^https?:\/\//i.test(value);
const list = document.querySelector('#track-list');
if (list) list.innerHTML = tracks.map(([number, title, url]) => `<li class="track"><span class="track-no">${number}</span><span class="track-title">${title}</span>${isUrl(url) ? `<a href="${url}" target="_blank" rel="noopener" aria-label="Watch ${title} on YouTube">Watch <b>↗</b></a>` : '<span class="track-pending" aria-label="Official video link coming soon">Coming soon</span>'}</li>`).join('');

/* Replace this value with an https://www.youtube.com/embed/... URL when available. */
const featuredEmbedUrl = 'POWER_LINES_FEATURED_YOUTUBE_EMBED_URL';
if (isUrl(featuredEmbedUrl) && document.querySelector('#featured-video')) document.querySelector('#featured-video').innerHTML = `<iframe title="Power Lines official video" loading="lazy" src="${featuredEmbedUrl}" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

const menu = document.querySelector('.menu-toggle'), nav = document.querySelector('#site-nav');
if (menu && nav) {
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded', String(!open)); nav.classList.toggle('open', !open); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.setAttribute('aria-expanded','false'); nav.classList.remove('open'); }));
}
const reveals = document.querySelectorAll('.reveal');
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('shown'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12 });
  reveals.forEach(el => revealObserver.observe(el));
} else reveals.forEach(el => el.classList.add('shown'));
const sections = [...document.querySelectorAll('main section[id]')];
const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) document.querySelectorAll('#site-nav a').forEach(a => a.classList.toggle('active', a.hash === '#' + entry.target.id));
}), { rootMargin: '-40% 0px -55%' });
sections.forEach(section => navObserver.observe(section));
