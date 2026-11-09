(() => {
  const endpoint = 'https://world-pop-listen-counter.mahmoodkhanteam.chatgpt.site/episodes/';
  function visitorKey() {
    const day = new Date().toISOString().slice(0, 10);
    const key = 'world-pop-listener';
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      if (saved?.day === day && saved.id) return saved.id;
      const id = crypto.randomUUID();
      localStorage.setItem(key, JSON.stringify({ day, id }));
      return id;
    } catch {
      return crypto.randomUUID();
    }
  }
  const visitor = visitorKey();
  for (const card of document.querySelectorAll('.episode')) {
    const total = card.querySelector('.episode-listen-total');
    const audio = card.querySelector('audio');
    if (!total || !audio) continue;
    const url = endpoint + encodeURIComponent(card.id) + '/';
    let token;
    let starting = false;
    let sending = false;
    let counted = false;
    let seconds = 0;
    let lastMedia = audio.currentTime;
    let lastClock = performance.now();
    let retryAfter = 0;
    const updateTotal = data => {
      if (Number.isSafeInteger(data.total) && data.total >= 0) {
        total.textContent = data.total.toLocaleString();
      }
    };
    const post = async (action, body) => {
      const response = await fetch(url + action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error('Counter unavailable');
      return response.json();
    };
    fetch(url + 'count').then(response => {
      if (!response.ok) throw new Error('Counter unavailable');
      return response.json();
    }).then(updateTotal).catch(() => {});
    const start = async () => {
      if (token || starting || counted || performance.now() < retryAfter) return;
      starting = true;
      try {
        token = (await post('start', { visitor })).token;
      } catch {
        retryAfter = performance.now() + 15000;
      } finally {
        starting = false;
      }
    };
    audio.addEventListener('play', start);
    audio.addEventListener('seeking', () => {
      lastMedia = audio.currentTime;
      lastClock = performance.now();
    });
    window.setInterval(async () => {
      const clock = performance.now();
      const elapsed = (clock - lastClock) / 1000;
      const advanced = audio.currentTime - lastMedia;
      lastClock = clock;
      lastMedia = audio.currentTime;
      if (audio.paused || audio.seeking || counted) return;
      // Count elapsed playback time, excluding jumps along the seek bar.
      if (advanced > 0 && advanced <= elapsed * audio.playbackRate + 0.5) {
        seconds += Math.min(elapsed, advanced / audio.playbackRate);
      }
      if (!token) { start(); return; }
      if (seconds < 30 || sending || clock < retryAfter) return;
      sending = true;
      try {
        updateTotal(await post('listen', { token }));
        counted = true;
      } catch {
        retryAfter = performance.now() + 15000;
      } finally {
        sending = false;
      }
    }, 1000);
  }
})();
