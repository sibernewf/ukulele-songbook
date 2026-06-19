// v5.2 Chord Dictionary
// Looks up any chord in data/chords.js and displays the matching ukulele fingering.
(function () {
  const input = document.getElementById('chordDictionaryInput');
  const searchButton = document.getElementById('chordDictionarySearch');
  const status = document.getElementById('chordDictionaryStatus');
  const result = document.getElementById('chordDictionaryResult');

  if (!input || !searchButton || !status || !result || typeof CHORDS === 'undefined') return;

  const chordNames = Object.keys(CHORDS);

  function cleanChordName(value) {
    return String(value || '')
      .trim()
      .replace(/\s+/g, '')
      .replace('♯', '#')
      .replace('♭', 'b')
      .replace(/min/g, 'm');
  }

  function findChord(name) {
    const cleaned = cleanChordName(name);
    if (!cleaned) return null;

    if (CHORDS[cleaned]) return { name: cleaned, shape: CHORDS[cleaned], source: 'exact' };

    const exactIgnoreCase = chordNames.find(chord => chord.toLowerCase() === cleaned.toLowerCase());
    if (exactIgnoreCase) return { name: exactIgnoreCase, shape: CHORDS[exactIgnoreCase], source: 'case' };

    const base = cleaned.split('/')[0];
    if (base && CHORDS[base]) {
      return { name: cleaned, shape: CHORDS[base], source: 'slash', base };
    }

    const baseIgnoreCase = chordNames.find(chord => chord.toLowerCase() === base.toLowerCase());
    if (baseIgnoreCase) return { name: cleaned, shape: CHORDS[baseIgnoreCase], source: 'slash', base: baseIgnoreCase };

    return null;
  }

  function chordRoot(name) {
    const m = String(name).match(/^[A-G](?:#|b)?/);
    return m ? m[0] : '';
  }

  function chordSuffix(name) {
    return String(name).replace(/^[A-G](?:#|b)?/, '');
  }

  function relatedChords(name, shape) {
    const root = chordRoot(name);
    const suffix = chordSuffix(name);
    const seen = new Set([name]);
    const sameRoot = chordNames.filter(chord => chordRoot(chord) === root && !seen.has(chord));
    const sameShape = chordNames.filter(chord => CHORDS[chord] === shape && !seen.has(chord));
    const sameSuffix = suffix ? chordNames.filter(chord => chordSuffix(chord) === suffix && chordRoot(chord) !== root) : [];

    return [...sameShape, ...sameRoot, ...sameSuffix]
      .filter(chord => !seen.has(chord) && seen.add(chord))
      .slice(0, 14);
  }

  function escape(value) {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

  function renderChordDiagram(shape) {
    if (typeof drawChord === 'function') return drawChord(shape);
    return `<div class="chord-shape">${escape(shape)}</div>`;
  }

  function renderResult(match) {
    const rel = relatedChords(match.name, match.shape);
    const sourceNote = match.source === 'slash'
      ? `<p class="dictionary-note">Slash chord detected. Showing the fingering for <strong>${escape(match.base)}</strong>.</p>`
      : '';

    result.innerHTML = `
      <div class="dictionary-card">
        <div class="dictionary-chord-name">${escape(match.name)}</div>
        ${renderChordDiagram(match.shape)}
        <div class="dictionary-shape"><strong>Fingering:</strong> ${escape(match.shape)}</div>
        <div class="dictionary-shape"><strong>Strings:</strong> G C E A</div>
        ${sourceNote}
        <div class="dictionary-related">
          <strong>Related chords:</strong>
          <div class="dictionary-related-list">
            ${rel.length ? rel.map(chord => `<button type="button" data-dictionary-chord="${escape(chord)}">${escape(chord)}</button>`).join('') : '<span>No related chords found.</span>'}
          </div>
        </div>
      </div>`;

    result.querySelectorAll('[data-dictionary-chord]').forEach(button => {
      button.addEventListener('click', () => {
        input.value = button.dataset.dictionaryChord;
        lookupChord();
      });
    });
  }

  function renderMissing(name) {
    const root = chordRoot(name);
    const alternatives = root ? chordNames.filter(chord => chordRoot(chord) === root).slice(0, 12) : [];
    result.innerHTML = `
      <div class="dictionary-card dictionary-missing">
        <div class="dictionary-chord-name">${escape(name || 'Unknown chord')}</div>
        <p>No chord diagram was found for this chord.</p>
        <p class="dictionary-note">You can add it later to <code>data/chords.js</code>.</p>
        ${alternatives.length ? `<div class="dictionary-related"><strong>Available ${escape(root)} chords:</strong><div class="dictionary-related-list">${alternatives.map(chord => `<button type="button" data-dictionary-chord="${escape(chord)}">${escape(chord)}</button>`).join('')}</div></div>` : ''}
      </div>`;
    result.querySelectorAll('[data-dictionary-chord]').forEach(button => {
      button.addEventListener('click', () => {
        input.value = button.dataset.dictionaryChord;
        lookupChord();
      });
    });
  }

  function lookupChord() {
    const query = cleanChordName(input.value);
    if (!query) {
      status.textContent = 'Enter a chord name first.';
      result.innerHTML = '';
      return;
    }

    const match = findChord(query);
    if (match) {
      status.textContent = `Found ${match.name}.`;
      renderResult(match);
    } else {
      status.textContent = `${query} is not currently in the chord database.`;
      renderMissing(query);
    }
  }

  searchButton.addEventListener('click', lookupChord);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') lookupChord();
  });

  status.textContent = `${chordNames.length} chord entries available.`;
})();
