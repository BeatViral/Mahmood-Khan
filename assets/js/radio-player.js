for (const card of document.querySelectorAll('.episode')) {
  const audio = card.querySelector('audio');
  const button = card.querySelector('.episode-listen');
  const status = card.querySelector('.episode-status');
  button.hidden = false;
  button.onclick = async () => {
    if (!audio.paused) { audio.pause(); return; }
    status.textContent = '';
    if (audio.error) audio.load();
    try { await audio.play(); }
    catch { status.textContent = 'Audio could not start. Press Listen to retry.'; }
  };
  audio.onplay = () => {
    for (const other of document.querySelectorAll('.episode audio')) if (other !== audio) other.pause();
    button.textContent = 'Pause';
    status.textContent = '';
  };
  audio.onpause = audio.onended = () => { button.textContent = 'Listen'; };
  audio.onerror = () => { status.textContent = 'Audio could not load. Press Listen to retry.'; };
}
