(() => {
  const NOTE_NAMES = [
    ['C'], ['C♯', 'D♭'], ['D'], ['D♯', 'E♭'], ['E'], ['F'],
    ['F♯', 'G♭'], ['G'], ['G♯', 'A♭'], ['A'], ['A♯', 'B♭'], ['B']
  ];
  const STRINGS = [
    { label: '1st String', open: 9 },
    { label: '2nd String', open: 4 },
    { label: '3rd String', open: 0 },
    { label: '4th String', open: 7 }
  ];

  const $ = id => document.getElementById(id);
  const view = $('noteChartView');
  const app = document.querySelector('main.app');
  const topbar = document.querySelector('.topbar');
  const diagram = $('noteChartDiagram');

  function noteAt(open, fret) {
    return NOTE_NAMES[(open + fret) % 12];
  }

  function renderChart() {
    if (!diagram || diagram.childElementCount) return;
    const table = document.createElement('table');
    table.className = 'fretboard-note-table';
    table.innerHTML = `<thead><tr><th class="string-heading">String</th>${Array.from({length: 13}, (_, fret) => `<th>${fret === 0 ? 'Open' : fret}</th>`).join('')}</tr></thead>`;
    const body = document.createElement('tbody');
    STRINGS.forEach(string => {
      const row = document.createElement('tr');
      row.innerHTML = `<th scope="row"><span>${string.label}</span><strong>${NOTE_NAMES[string.open][0]}</strong></th>` +
        Array.from({length: 13}, (_, fret) => {
          const notes = noteAt(string.open, fret);
          const markerClass = [3, 5, 7, 10].includes(fret) ? ' marker-fret' : fret === 12 ? ' octave-fret' : '';
          return `<td class="${markerClass.trim()}"><span class="note-dot${notes.length > 1 ? ' accidental' : ''}">${notes.map((n, i) => `<span${i ? ' class="flat-name"' : ''}>${n}</span>`).join('')}</span></td>`;
        }).join('');
      body.appendChild(row);
    });
    table.appendChild(body);
    diagram.appendChild(table);
  }

  function openChart() {
    renderChart();
    document.body.classList.add('showing-note-chart');
    if (app) app.hidden = true;
    if (topbar) topbar.hidden = true;
    view.hidden = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function closeChart() {
    document.body.classList.remove('showing-note-chart');
    view.hidden = true;
    if (app) app.hidden = false;
    if (topbar) topbar.hidden = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  $('openNoteChart')?.addEventListener('click', openChart);
  $('closeNoteChart')?.addEventListener('click', closeChart);
  $('printNoteChart')?.addEventListener('click', () => window.print());
  window.addEventListener('beforeprint', renderChart);
})();
