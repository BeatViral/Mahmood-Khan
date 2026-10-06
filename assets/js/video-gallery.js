(() => {
  const cards = [...document.querySelectorAll('.video-card')];
  const search = document.getElementById('video-search');
  const results = document.getElementById('video-results');
  if (!search || !cards.length) return;
  document.querySelector('.video-search').hidden = false;
  const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  search.addEventListener('input', () => {
    const words = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      card.hidden = !words.every(word => normalize(card.dataset.search).includes(word));
      if (!card.hidden) count++;
    });
    results.textContent = `Showing ${count} of ${cards.length} videos`;
    document.querySelector('.video-empty').hidden = count !== 0;
  });
  let playing = null;
  document.querySelectorAll('.video-play').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      if (playing) {
        playing.frame.remove();
        playing.button.hidden = false;
      }
      const featured = document.querySelector('.featured-video iframe');
      if (featured) featured.src = featured.src;
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${button.dataset.videoId}?autoplay=1`;
      frame.title = button.getAttribute('aria-label').replace(/^Play /, '');
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      button.hidden = true;
      button.parentElement.append(frame);
      playing = {button, frame};
      frame.focus();
    });
  });
})();
