(() => {
  const wall = document.getElementById('guest-wall');
  const status = document.getElementById('guest-status');
  const dateFormat = new Intl.DateTimeFormat('en-AU', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function guestCard(guest) {
    const card = element('article', 'guest-card');
    card.id = guest.id;
    if (guest.photograph) {
      const figure = element('figure', 'guest-portrait');
      const photo = element('img');
      photo.src = guest.photograph;
      photo.alt = guest.name;
      photo.loading = 'lazy';
      photo.width = 320;
      photo.height = 400;
      photo.addEventListener('error', () => {
        figure.remove();
        card.classList.add('guest-text-only');
      }, { once: true });
      figure.append(photo);
      if (guest.photoSource) {
        const caption = element('figcaption');
        const link = element('a', '', 'Photo source');
        link.href = guest.photoSource;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        caption.append(link);
        figure.append(caption);
      }
      card.append(figure);
    } else {
      card.classList.add('guest-text-only');
    }
    const content = element('div', 'guest-copy');
    const date = element('time', 'guest-date', 'Added ' + dateFormat.format(new Date(guest.dateAdded + 'T00:00:00Z')));
    date.dateTime = guest.dateAdded;
    content.append(date, element('h2', '', guest.name));
    content.append(element('p', 'guest-role', guest.role + (guest.organisation ? ' — ' + guest.organisation : '')));
    const details = element('details', 'guest-details');
    details.append(element('summary', '', 'About & conversation'));
    for (const paragraph of guest.contribution) details.append(element('p', '', paragraph));
    const conversation = element('div', 'guest-conversation');
    conversation.append(
      element('h3', '', guest.episodeListeningLink ? 'On WORLD POP' : (guest.conversationHeading || 'Coming to WORLD POP')),
      element('p', '', guest.conversation)
    );
    if (guest.episodeListeningLink) {
      const listen = element('a', 'button button-outline', 'Listen to Interview');
      listen.href = guest.episodeListeningLink;
      conversation.append(listen);
    }
    details.append(conversation);
    card.append(content, details);
    return card;
  }
  fetch('/content/world-pop-guests.json').then(response => {
    if (!response.ok) throw new Error('Guest data unavailable');
    return response.json();
  }).then(guests => {
    guests.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
    wall.replaceChildren(...guests.map(guestCard));
    status.hidden = true;
  }).catch(() => {
    status.textContent = 'Guest updates could not load. Please refresh the page to try again.';
  });
})();

(() => {
  const button = document.querySelector('.newsletter-share');
  const status = document.querySelector('.newsletter-share-status');
  if (!button) return;
  button.hidden = false;
  button.addEventListener('click', async () => {
    const url = 'https://mahmoodkhan.net/radio-show/newsletter/';
    status.textContent = '';
    if (navigator.share) {
      try {
        await navigator.share({title:'WORLD POP Newsletter', text:'The people, conversations and stories behind WORLD POP.', url});
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      status.textContent = 'Newsletter link copied.';
    } catch {
      window.prompt('Copy this newsletter link to share it:', url);
    }
  });
})();
