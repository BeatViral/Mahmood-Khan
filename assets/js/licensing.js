(() => {
  'use strict';
  const data = document.getElementById('licensing-data');
  if (!data) return;
  const catalogue = JSON.parse(data.textContent);
  const cards = new Map([...document.querySelectorAll('.licensing-track')].map(card => [card.dataset.trackId, card]));
  const audio = document.createElement('audio');
  audio.preload = 'none';
  audio.setAttribute('aria-hidden', 'true');
  audio.tabIndex = -1;
  audio.hidden = true;
  document.body.append(audio);
  let active = null;

  const emit = (name, track, mode) => window.dispatchEvent(new CustomEvent(name, {detail: {trackId: track.id, trackTitle: track.title, mode}}));
  const format = seconds => {
    if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
    const value = Math.floor(seconds);
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
  };
  const sourceFor = (player, mode) => mode === 'instrumental' ? player.dataset.instrumental : player.dataset.original;
  const setPlayState = (card, playing) => {
    const button = card.querySelector('.licensing-play');
    button.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
    button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${card.querySelector('h3').textContent}`);
  };
  const stop = (announce = true) => {
    if (!active) return;
    if (!audio.paused && announce) {
      const track = catalogue.tracks.find(item => item.id === active.card.dataset.trackId);
      if (track) emit('licensing-track-pause', track, active.mode);
    }
    audio.pause();
    setPlayState(active.card, false);
    active = null;
  };

  for (const track of catalogue.tracks) {
    const card = cards.get(track.id);
    if (!card) continue;
    const shareButton = document.createElement('button');
    shareButton.type = 'button';
    shareButton.className = 'licensing-share';
    shareButton.textContent = 'Share song';
    shareButton.setAttribute('aria-label', `Share ${track.title}`);
    card.querySelector('.licensing-track-enquiry')?.before(shareButton);
    shareButton.addEventListener('click', async () => {
      const trackLabel = `${track.title}${track.version ? ` — ${track.version}` : ''}`;
      const shareUrl = new URL(`/licensing/share/${track.id}/`, location.origin).href;
      const shareData = {
        title: `${trackLabel} — Mahmood Khan`,
        text: `Listen to ${trackLabel} by Mahmood Khan${track.credit ? `, featuring ${track.credit}` : ''}.`,
        url: shareUrl
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          emit('licensing-track-share', track);
          return;
        } catch (error) {
          if (error?.name === 'AbortError') return;
        }
      }
      try {
        await navigator.clipboard.writeText(shareUrl);
        shareButton.textContent = 'Link copied';
        emit('licensing-track-share', track);
        window.setTimeout(() => { shareButton.textContent = 'Share song'; }, 2200);
      } catch {
        window.prompt('Copy this song link to share it:', shareUrl);
      }
    });
    const player = card.querySelector('.licensing-player');
    const seek = card.querySelector('.licensing-seek');
    const time = card.querySelector('.licensing-time');
    const status = card.querySelector('.licensing-player-status');
    let mode = player.dataset.initialMode;
    const selectMode = next => {
      if (!sourceFor(player, next)) return;
      if (active?.card === card) stop();
      mode = next;
      for (const button of player.querySelectorAll('[data-audio-mode]')) button.setAttribute('aria-pressed', String(button.dataset.audioMode === mode));
      status.textContent = mode === 'instrumental' ? 'Instrumental preview' : 'Original preview';
      time.textContent = '0:00 / --:--';
      seek.value = '0';
      seek.disabled = true;
    };
    for (const button of player.querySelectorAll('[data-audio-mode]')) button.addEventListener('click', () => selectMode(button.dataset.audioMode));
    player.querySelector('.licensing-play').addEventListener('click', async () => {
      if (active?.card === card && !audio.paused) {
        emit('licensing-track-pause', track, mode);
        audio.pause();
        setPlayState(card, false);
        return;
      }
      if (active) stop();
      const src = sourceFor(player, mode);
      if (!src) { status.textContent = 'This preview is not included. Contact us to request a listening copy.'; return; }
      if (audio.getAttribute('src') !== new URL(src, location.origin).href) {
        audio.pause();
        audio.src = src;
        audio.load();
      }
      active = {card, mode};
      setPlayState(card, true);
      status.textContent = mode === 'instrumental' ? 'Instrumental preview' : 'Original preview';
      try { await audio.play(); }
      catch { setPlayState(card, false); status.textContent = 'Preview could not be played. Please try again.'; active = null; }
    });
    seek.addEventListener('input', () => {
      if (active?.card === card && Number.isFinite(audio.duration)) audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
    });
  }

  const updateProgress = () => {
    if (!active) return;
    const seek = active.card.querySelector('.licensing-seek');
    const time = active.card.querySelector('.licensing-time');
    seek.disabled = !Number.isFinite(audio.duration) || audio.duration <= 0;
    if (!seek.disabled && !seek.matches(':active')) seek.value = String(Math.round(audio.currentTime / audio.duration * 1000));
    time.textContent = `${format(audio.currentTime)} / ${format(audio.duration)}`;
  };
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('durationchange', updateProgress);
  audio.addEventListener('play', () => { if (active) { const track = catalogue.tracks.find(item => item.id === active.card.dataset.trackId); if (track) emit('licensing-track-play', track, active.mode); } });
  audio.addEventListener('ended', () => { if (active) { setPlayState(active.card, false); active = null; } });
  audio.addEventListener('error', () => {
    if (!active) return;
    setPlayState(active.card, false);
    active.card.querySelector('.licensing-player-status').textContent = 'Preview could not be loaded. Please contact us for a listening copy.';
    active = null;
  });
})();
