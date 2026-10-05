(() => {
  'use strict';
  const source = document.getElementById('licensing-data');
  if (!source) return;
  const catalogue = JSON.parse(source.textContent);
  const players = [];
  for (const track of catalogue.tracks) {
    if (!track.audioUrl) continue;
    let url;
    try { url = new URL(track.audioUrl, location.origin); } catch { continue; }
    if (!['https:', 'http:'].includes(url.protocol)) continue;
    const card = [...document.querySelectorAll('.licensing-track')].find(el => el.dataset.trackId === track.id);
    if (!card) continue;
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.preload = 'none';
    audio.src = url.href;
    audio.setAttribute('aria-label', 'Listen to ' + track.title);
    audio.addEventListener('play', () => {
      players.forEach(other => { if (other !== audio) other.pause(); });
      window.dispatchEvent(new CustomEvent('licensing-track-play', {detail: {trackId: track.id}}));
    });
    audio.addEventListener('error', () => { audio.remove(); });
    players.push(audio);
    card.querySelector('.licensing-audio').append(audio);
  }
})();
