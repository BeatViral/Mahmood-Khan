(() => {
  'use strict';
  const data = document.getElementById('licensing-data');
  const panel = document.querySelector('.licensing-playlist');
  if (!data || !panel) return;

  const tracks = JSON.parse(data.textContent).tracks.filter(track => track.audioUrl || track.instrumentalUrl);
  const audio = document.createElement('audio');
  audio.preload = 'none';
  audio.hidden = true;
  audio.setAttribute('aria-hidden', 'true');
  audio.tabIndex = -1;
  document.body.append(audio);

  const toggle = panel.querySelector('[data-playlist-toggle]');
  const previous = panel.querySelector('[data-playlist-prev]');
  const next = panel.querySelector('[data-playlist-next]');
  const seek = panel.querySelector('[data-playlist-seek]');
  const time = panel.querySelector('[data-playlist-time]');
  const current = panel.querySelector('[data-playlist-current]');
  let index = -1;
  let track = null;
  let mode = 'original';
  let queueStarted = false;
  let playing = false;

  const format = seconds => {
    if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
    const value = Math.floor(seconds);
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
  };
  const labelFor = item => [item.title, item.version, item.credit].filter(Boolean).join(' · ');
  const emit = (name, item, itemMode) => window.dispatchEvent(new CustomEvent(name, {detail: {trackId: item.id, trackTitle: item.title, mode: itemMode, source: 'playlist'}}));
  const setCardState = (item, isPlaying) => {
    const card = document.querySelector(`[data-track-id="${item.id}"]`);
    if (!card) return;
    const status = card.querySelector('.licensing-player-status');
    if (status && isPlaying) status.textContent = mode === 'instrumental' ? 'Instrumental preview · full-catalogue playlist' : 'Original preview · full-catalogue playlist';
    else if (status) status.textContent = '';
  };
  const updateControls = () => {
    toggle.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
    toggle.setAttribute('aria-label', playing ? 'Pause full catalogue' : queueStarted ? 'Resume full catalogue' : 'Play full catalogue');
    toggle.setAttribute('aria-pressed', String(playing));
    previous.disabled = index <= 0;
    next.disabled = index < 0 || index >= tracks.length - 1;
  };
  const updateTrackLabel = (message = '') => {
    if (!track) current.textContent = message || `Ready to play all ${tracks.length} recordings`;
    else current.textContent = `${String(index + 1).padStart(2, '0')} / ${tracks.length} · ${labelFor(track)}${message ? ` · ${message}` : ''}`;
    updateControls();
  };
  const updateProgress = () => {
    seek.disabled = !Number.isFinite(audio.duration) || audio.duration <= 0;
    if (!seek.disabled && !seek.matches(':active')) seek.value = String(Math.round(audio.currentTime / audio.duration * 1000));
    time.textContent = `${format(audio.currentTime)} / ${format(audio.duration)}`;
  };
  const pauseQueue = (message = 'Paused') => {
    if (playing && track) emit('licensing-track-pause', track, mode);
    audio.pause();
    playing = false;
    if (track) setCardState(track, false);
    if (message) updateTrackLabel(message);
    else updateControls();
  };

  const playAt = async nextIndex => {
    const nextTrack = tracks[nextIndex];
    if (!nextTrack) return;
    if (playing) pauseQueue('');
    if (!queueStarted) window.dispatchEvent(new Event('licensing-playlist-start'));
    queueStarted = true;
    index = nextIndex;
    track = nextTrack;
    mode = track.audioUrl ? 'original' : 'instrumental';
    const src = track.audioUrl || track.instrumentalUrl;
    const fullSrc = new URL(src, location.origin).href;
    if (audio.src !== fullSrc) {
      audio.src = src;
      audio.load();
    }
    audio.currentTime = 0;
    seek.value = '0';
    seek.disabled = true;
    time.textContent = '0:00 / --:--';
    setCardState(track, true);
    updateTrackLabel('Starting');
    try {
      await audio.play();
    } catch {
      playing = false;
      queueStarted = false;
      setCardState(track, false);
      updateTrackLabel('Preview could not be played');
      return;
    }
  };

  toggle.addEventListener('click', async () => {
    if (playing) {
      pauseQueue();
      return;
    }
    if (index < 0) {
      await playAt(0);
      return;
    }
    if (!queueStarted) window.dispatchEvent(new Event('licensing-playlist-start'));
    queueStarted = true;
    try {
      await audio.play();
    } catch {
      queueStarted = false;
      updateTrackLabel('Preview could not be played');
    }
  });
  previous.addEventListener('click', () => {
    if (index > 0) playAt(index - 1);
  });
  next.addEventListener('click', () => {
    if (index >= 0 && index < tracks.length - 1) playAt(index + 1);
  });
  seek.addEventListener('input', () => {
    if (!seek.disabled && Number.isFinite(audio.duration)) audio.currentTime = Number(seek.value) / 1000 * audio.duration;
  });

  audio.addEventListener('play', () => {
    playing = true;
    setCardState(track, true);
    updateTrackLabel();
    emit('licensing-track-play', track, mode);
  });
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('durationchange', updateProgress);
  audio.addEventListener('ended', () => {
    setCardState(track, false);
    playing = false;
    if (queueStarted && index < tracks.length - 1) {
      playAt(index + 1);
      return;
    }
    queueStarted = false;
    index = -1;
    track = null;
    seek.value = '0';
    seek.disabled = true;
    time.textContent = '0:00 / --:--';
    updateTrackLabel('Catalogue complete');
  });
  audio.addEventListener('error', () => {
    if (!track) return;
    playing = false;
    queueStarted = false;
    setCardState(track, false);
    updateTrackLabel('Preview could not be loaded');
  });

  window.addEventListener('licensing-track-play', event => {
    if (event.detail?.source === 'playlist' || !queueStarted) return;
    pauseQueue('Paused for individual preview');
    queueStarted = false;
    updateControls();
  });
  window.addEventListener('licensing-single-track-start', () => {
    if (queueStarted) pauseQueue('Paused for individual preview');
    queueStarted = false;
    updateControls();
  });
  updateTrackLabel();
})();
