for (const card of document.querySelectorAll('.episode')) {
  const audio = card.querySelector('audio');
  const button = card.querySelector('.episode-listen');
  const status = card.querySelector('.episode-status');
  const shareButton = card.querySelector('.episode-share');
  if (shareButton) {
    shareButton.hidden = false;
    shareButton.addEventListener('click', async () => {
      const title = card.querySelector('h3').textContent;
      const url = new URL(card.dataset.shareUrl, location.origin).href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: title + ' | WORLD POP',
            text: 'Listen to ' + title + ', hosted by Mahmood Khan.',
            url
          });
          return;
        } catch (error) {
          if (error?.name === 'AbortError') return;
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        shareButton.textContent = 'Link copied';
        window.setTimeout(() => { shareButton.textContent = 'Share episode'; }, 2200);
      } catch {
        window.prompt('Copy this episode link to share it:', url);
      }
    });
  }
  button.hidden = false;
  const streamUrl = audio.getAttribute('src');
  let failed = false;
  function showFailure(message) {
    failed = true;
    audio.pause();
    button.textContent = 'Listen';
    status.textContent = message;
  }
  button.onclick = async () => {
    // A failed media element can still report paused=false. Handle retry first.
    if (failed || audio.error) {
      failed = false;
      const retryUrl = new URL(streamUrl, location.href);
      retryUrl.searchParams.set('retry', Date.now().toString());
      audio.src = retryUrl.href;
      audio.load();
    } else if (!audio.paused) {
      audio.pause();
      return;
    }
    status.textContent = 'Loading audio…';
    try { await audio.play(); }
    catch (error) {
      if (error.name === 'AbortError' && !failed) return;
      showFailure('Audio could not start. Press Listen to retry.');
    }
  };
  audio.onplay = () => {
    for (const other of document.querySelectorAll('.episode audio')) if (other !== audio) other.pause();
  };
  audio.onplaying = () => {
    failed = false;
    button.textContent = 'Pause';
    status.textContent = '';
  };
  audio.onpause = audio.onended = () => { button.textContent = 'Listen'; };
  audio.onerror = () => { showFailure('Audio could not load. Press Listen to retry.'); };
}
