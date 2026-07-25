// v6.2.1 Fretboard Note Chart
(function () {
  const openButton = document.getElementById('openFretboardChart');
  const modal = document.getElementById('fretboardChartModal');
  const closeButton = document.getElementById('closeFretboardChart');
  const printButton = document.getElementById('printFretboardChart');
  const chart = document.getElementById('fretboardNoteChart');

  if (!openButton || !modal || !closeButton || !printButton || !chart) return;

  const strings = [
    { label: '1st String', open: 9 },  // A
    { label: '2nd String', open: 4 },  // E
    { label: '3rd String', open: 0 },  // C
    { label: '4th String', open: 7 }   // G
  ];

  const notes = [
    ['C'], ['C♯', 'D♭'], ['D'], ['D♯', 'E♭'], ['E'], ['F'],
    ['F♯', 'G♭'], ['G'], ['G♯', 'A♭'], ['A'], ['A♯', 'B♭'], ['B']
  ];

  function noteMarkup(noteNames, isOpen, isOctave) {
    const classes = ['fretboard-note'];
    if (noteNames.length === 1) classes.push('natural-note');
    else classes.push('accidental-note');
    if (isOpen) classes.push('open-note');
    if (isOctave) classes.push('octave-note');

    return `<span class="${classes.join(' ')}">${noteNames.map((n, i) =>
      `<span class="note-name${i ? ' alternate-name' : ''}">${n}</span>`).join('')}</span>`;
  }

  function buildChart() {
    let html = '<div class="fretboard-corner">String</div><div class="fretboard-fret-label open-label">Open</div>';
    for (let fret = 1; fret <= 12; fret += 1) {
      const marker = [3, 5, 7, 10, 12].includes(fret) ? '<span class="fret-marker">●</span>' : '';
      html += `<div class="fretboard-fret-label">${fret}${marker}</div>`;
    }

    strings.forEach(string => {
      const openNames = notes[string.open];
      html += `<div class="fretboard-string-label"><strong>${string.label}</strong><span>${openNames[0]}</span></div>`;
      for (let fret = 0; fret <= 12; fret += 1) {
        const noteNames = notes[(string.open + fret) % 12];
        html += `<div class="fretboard-cell fret-${fret}">${noteMarkup(noteNames, fret === 0, fret === 12)}</div>`;
      }
    });

    chart.innerHTML = html;
  }

  function openChart() {
    modal.hidden = false;
    document.body.classList.add('fretboard-modal-open');
    closeButton.focus();
  }

  function closeChart() {
    modal.hidden = true;
    document.body.classList.remove('fretboard-modal-open');
    openButton.focus();
  }

  buildChart();
  openButton.addEventListener('click', openChart);
  closeButton.addEventListener('click', closeChart);
  printButton.addEventListener('click', () => window.print());
  modal.querySelectorAll('[data-close-fretboard]').forEach(el => el.addEventListener('click', closeChart));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.hidden) closeChart();
  });
})();
