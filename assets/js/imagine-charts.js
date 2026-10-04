(() => {
  'use strict';
  const data = document.getElementById('chart-records');
  if (!data) return;
  const records = JSON.parse(data.textContent);
  const byId = new Map(records.map(record => [record.id, record]));
  const archive = document.getElementById('chart-archive');
  const cards = [...archive.querySelectorAll('.chart-card')];
  const filters = [...archive.querySelectorAll('[data-filter]')];
  const search = document.getElementById('chart-search');
  const dialog = document.getElementById('chart-dialog');
  const stage = document.getElementById('chart-image-stage');
  const zoom = document.getElementById('chart-zoom');
  const viewerImage = document.getElementById('chart-dialog-image');
  let activeFilter = 'All';
  let sequence = records.map(record => record.id);
  let currentIndex = 0;
  let opener;

  archive.querySelector('.chart-controls').hidden = false;
  function filterRecords() {
    const query = search.value.trim().toLocaleLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const record = byId.get(Number(card.dataset.recordId));
      const matches = (activeFilter === 'All' || record.platform === activeFilter)
        && [record.title, record.platform, record.category, record.market, record.date, record.rank, record.note].join(' ').toLocaleLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) shown++;
    });
    document.getElementById('chart-results').textContent = `Showing ${shown} of ${records.length} records`;
    archive.querySelector('.chart-empty').hidden = shown !== 0;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    filterRecords();
  }));
  search.addEventListener('input', filterRecords);

  if (typeof dialog.showModal !== 'function') return; // Image links remain usable in older browsers.
  function resetZoom() {
    stage.classList.remove('zoomed');
    zoom.setAttribute('aria-pressed', 'false');
    zoom.textContent = 'Actual size';
    stage.scrollTop = stage.scrollLeft = 0;
  }
  function renderChart() {
    const record = byId.get(sequence[currentIndex]);
    resetZoom();
    viewerImage.src = record.src;
    viewerImage.alt = `${record.title}: ${record.rank}, ${record.platform} ${record.category}.`;
    document.getElementById('chart-dialog-title').textContent = record.title;
    document.getElementById('chart-dialog-platform').textContent = `${record.platform} / ${record.rank}`;
    document.getElementById('chart-dialog-meta').textContent = [record.category, record.market, record.date || 'Date not visible in the image'].filter(Boolean).join(' · ');
    document.getElementById('chart-dialog-note').textContent = record.note;
    document.getElementById('chart-original').href = record.src;
    document.getElementById('chart-counter').textContent = `${currentIndex + 1} / ${sequence.length}`;
    document.getElementById('chart-prev').disabled = sequence.length < 2;
    document.getElementById('chart-next').disabled = sequence.length < 2;
  }
  document.querySelectorAll('[data-chart-id]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    sequence = link.closest('.chart-grid')
      ? cards.filter(card => !card.hidden).map(card => Number(card.dataset.recordId))
      : records.map(record => record.id);
    currentIndex = sequence.indexOf(Number(link.dataset.chartId));
    renderChart();
    dialog.showModal();
    document.body.classList.add('chart-viewing');
    document.getElementById('chart-close').focus();
  }));
  function step(direction) {
    currentIndex = (currentIndex + direction + sequence.length) % sequence.length;
    renderChart();
  }
  document.getElementById('chart-prev').addEventListener('click', () => step(-1));
  document.getElementById('chart-next').addEventListener('click', () => step(1));
  document.getElementById('chart-close').addEventListener('click', () => dialog.close());
  zoom.addEventListener('click', () => {
    const zoomed = stage.classList.toggle('zoomed');
    zoom.setAttribute('aria-pressed', String(zoomed));
    zoom.textContent = zoomed ? 'Fit image' : 'Actual size';
  });
  dialog.addEventListener('keydown', event => {
    if (stage.classList.contains('zoomed')) return; // Arrow keys scroll large originals when zoomed.
    if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
  });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('chart-viewing');
    opener?.focus({preventScroll:true});
  });
})();
