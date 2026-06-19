// Ukulele Songbook v5.3 Practice Studio
// Depends on SONGS, CHORDS, PRACTICE_PACKS and helper functions from app.js.

(function () {
  const el = id => document.getElementById(id);
  let practiceSet = [];
  let practiceIndex = 0;
  let practiceTitle = '';

  let audioContext = null;
  let metronomeTimer = null;
  let metronomeBeat = 0;
  let tapTimes = [];

  let strumAnimationTimer = null;
  let strumAnimationIndex = 0;
  let currentStrumTokens = [];

  let practiceTimerInterval = null;
  let practiceTimerRemaining = 0;
  let practiceTimerInitial = 0;

  document.addEventListener('DOMContentLoaded', initPracticeMode);
  if (document.readyState !== 'loading') initPracticeMode();

  function initPracticeMode() {
    const root = el('practiceMode');
    if (!root || root.dataset.ready === 'true') return;
    root.dataset.ready = 'true';

    root.querySelectorAll('[data-practice-tab]').forEach(button => {
      button.addEventListener('click', () => activatePracticeTab(button.dataset.practiceTab));
    });

    const state = typeof loadPracticeState === 'function' ? loadPracticeState() : {};
    if (state.customChords && el('customChordInput')) el('customChordInput').value = state.customChords;
    if (state.customStrumming && el('customStrumInput')) el('customStrumInput').value = state.customStrumming;
    if (state.metronomeBpm && el('metronomeBpm')) el('metronomeBpm').value = state.metronomeBpm;
    if (state.metronomeBeats && el('metronomeBeats')) el('metronomeBeats').value = state.metronomeBeats;
    updateMetronomeBpmLabel();

    el('loadCustomPractice')?.addEventListener('click', loadCustomPractice);
    el('startRandomPractice')?.addEventListener('click', startRandomPractice);
    el('loadSongPractice')?.addEventListener('click', loadSongPractice);
    el('loadSongStrumPractice')?.addEventListener('click', loadSongStrummingPractice);
    el('loadCustomStrumPractice')?.addEventListener('click', loadCustomStrummingPractice);

    el('metronomeBpm')?.addEventListener('input', () => {
      updateMetronomeBpmLabel();
      savePracticeState?.({ metronomeBpm: el('metronomeBpm').value });
      if (metronomeTimer) restartMetronome();
    });
    el('metronomeBeats')?.addEventListener('change', () => {
      savePracticeState?.({ metronomeBeats: el('metronomeBeats').value });
      metronomeBeat = 0;
    });
    el('metronomeToggle')?.addEventListener('click', toggleMetronome);
    el('metronomeTap')?.addEventListener('click', tapTempo);

    el('practiceTimerToggle')?.addEventListener('click', togglePracticeTimer);
    el('practiceTimerReset')?.addEventListener('click', resetPracticeTimer);
    el('practiceTimerMinutes')?.addEventListener('change', resetPracticeTimer);

    renderPracticePacks();
    renderPracticeWelcome(state);
  }

  function activatePracticeTab(name) {
    document.querySelectorAll('.practice-tab').forEach(b => b.classList.toggle('active', b.dataset.practiceTab === name));
    document.querySelectorAll('.practice-tool').forEach(p => p.classList.toggle('active', p.id === `practice-${name}`));
    if (name === 'metronome') renderMetronomePanel();
    if (name === 'timer') renderTimerPanel();
  }

  function renderPracticePacks() {
    const list = el('practicePackList');
    if (!list) return;
    list.innerHTML = '';
    (window.PRACTICE_PACKS || PRACTICE_PACKS || []).forEach(pack => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'practice-pack-card';
      card.innerHTML = `<strong>${escapeHtml(pack.name)}</strong><span>${escapeHtml(pack.description || '')}</span><small>${pack.chords.join(' · ')}</small>`;
      card.addEventListener('click', () => startPracticeSet(pack.chords, pack.name));
      list.appendChild(card);
    });
  }

  function renderPracticeWelcome(state) {
    const workspace = el('practiceWorkspace');
    if (!workspace) return;
    workspace.innerHTML = `<div class="practice-empty-card"><strong>Practice Studio v5.3</strong><br>Choose a practice option above. You can practise chords, animate strumming patterns, use the metronome, or run a timed practice session.</div>`;
    if (state.lastTitle) setStatus(`Last practice: ${escapeHtml(state.lastTitle)} (${state.lastCount || 0} chords).`);
  }

  function loadCustomPractice() {
    const input = el('customChordInput')?.value || '';
    const chords = parseChordInput(input);
    if (!chords.length) return setStatus('Enter at least one chord, for example: Am G6 C D', true);
    savePracticeState?.({ customChords: input });
    startPracticeSet(chords, 'Custom Chord Practice');
  }

  function startRandomPractice() {
    const countValue = el('randomChordCount')?.value || '10';
    let chords = Object.keys(CHORDS).filter(uniqueUsefulChordName);
    chords = shuffle(chords);
    if (countValue !== 'all') chords = chords.slice(0, Number(countValue));
    startPracticeSet(chords, 'Random Chord Trainer');
  }

  async function loadSongPractice() {
    const select = el('songSelect');
    const index = Number(select?.value);
    const song = SONGS[index];
    if (!song) return setStatus('Choose a song first.', true);
    try {
      setStatus('Loading selected song chords...');
      const response = await fetch(song.file);
      if (!response.ok) throw new Error(`Could not load ${song.file}`);
      const parsed = parseSongFile(await response.text());
      const result = analyseSong(parsed.songText, song.type || 'chords');
      if (!result.allChords.length) return setStatus('No chords were found in the selected song.', true);
      startPracticeSet(result.allChords, `Learn This Song: ${song.title}`);
    } catch (error) {
      setStatus('Could not load the selected song. This app needs to run from your NAS/web server, not directly from Windows Explorer. ' + error.message, true);
    }
  }

  function startPracticeSet(chords, title) {
    stopStrummingAnimation();
    const checked = validatePracticeChords(chords);
    practiceSet = checked.known;
    practiceIndex = 0;
    practiceTitle = title;
    savePracticeState?.({ lastTitle: title, lastCount: practiceSet.length });

    const missingHtml = checked.missing.length ? `<div class="practice-missing"><strong>Missing chord diagrams:</strong> ${checked.missing.map(escapeHtml).join(', ')}</div>` : '';
    if (!practiceSet.length) {
      el('practiceWorkspace').innerHTML = `<div class="practice-empty-card">No matching chord diagrams were found.</div>${missingHtml}`;
      return setStatus('No matching chord diagrams found.', true);
    }

    renderPracticeCard(missingHtml);
    setStatus(`${title}: ${practiceSet.length} chord${practiceSet.length === 1 ? '' : 's'} loaded.`);
  }

  function renderPracticeCard(extraHtml = '') {
    const chord = practiceSet[practiceIndex];
    const shape = CHORDS[chord] || CHORDS[chord.split('/')[0]];
    const chips = practiceSet.map((c, i) => `<button type="button" class="practice-chip ${i === practiceIndex ? 'active' : ''}" data-practice-jump="${i}">${escapeHtml(c)}</button>`).join('');
    el('practiceWorkspace').innerHTML = `
      <div class="practice-card">
        <div class="practice-card-head">
          <strong>${escapeHtml(practiceTitle)}</strong>
          <span>Chord ${practiceIndex + 1} of ${practiceSet.length}</span>
        </div>
        <div class="practice-big-chord">${escapeHtml(chord)}</div>
        <div class="practice-diagram">${drawChord(shape)}</div>
        <div class="practice-shape">${escapeHtml(shape)}</div>
        <div class="practice-controls-row">
          <button id="practicePrev" type="button">Previous</button>
          <button id="practiceNext" type="button">Next</button>
          <button id="practiceShuffle" type="button">Shuffle</button>
        </div>
        <div class="practice-chip-row">${chips}</div>
        ${extraHtml}
      </div>`;

    el('practicePrev').onclick = () => { practiceIndex = (practiceIndex - 1 + practiceSet.length) % practiceSet.length; renderPracticeCard(extraHtml); };
    el('practiceNext').onclick = () => { practiceIndex = (practiceIndex + 1) % practiceSet.length; renderPracticeCard(extraHtml); };
    el('practiceShuffle').onclick = () => { practiceSet = shuffle(practiceSet); practiceIndex = 0; renderPracticeCard(extraHtml); };
    document.querySelectorAll('[data-practice-jump]').forEach(button => {
      button.onclick = () => { practiceIndex = Number(button.dataset.practiceJump); renderPracticeCard(extraHtml); };
    });
  }

  async function loadSongStrummingPractice() {
    const select = el('songSelect');
    const index = Number(select?.value);
    const song = SONGS[index];
    if (!song) return setStatus('Choose a song first.', true);
    try {
      const response = await fetch(song.file);
      if (!response.ok) throw new Error(`Could not load ${song.file}`);
      const parsed = parseSongFile(await response.text());
      if (!parsed.info.strumming) return setStatus('The selected song has no Strumming metadata yet.', true);
      renderStrummingPractice(parsed.info.strumming, `Strumming Practice: ${song.title}`);
    } catch (error) {
      setStatus('Could not load strumming from the selected song. ' + error.message, true);
    }
  }

  function loadCustomStrummingPractice() {
    const pattern = el('customStrumInput')?.value.trim() || '';
    if (!pattern) return setStatus('Enter a strumming pattern, for example: D D U U D U', true);
    savePracticeState?.({ customStrumming: pattern });
    renderStrummingPractice(pattern, 'Custom Strumming Practice');
  }

  function renderStrummingPractice(pattern, title) {
    stopStrummingAnimation();
    currentStrumTokens = extractStrumTokens(pattern);
    const tokenHtml = currentStrumTokens.length
      ? currentStrumTokens.map((token, index) => `<span class="animated-strum-token ${tokenClass(token)}" data-strum-step="${index}"><span>${tokenSymbol(token)}</span><small>${escapeHtml(token)}</small></span>`).join('')
      : '<span class="hint">No D, U, X or - symbols found.</span>';
    el('practiceWorkspace').innerHTML = `
      <div class="practice-card strumming-trainer-card">
        <div class="practice-card-head"><strong>${escapeHtml(title)}</strong><span>${currentStrumTokens.length} step${currentStrumTokens.length === 1 ? '' : 's'}</span></div>
        ${renderStrummingCard(pattern)}
        <div class="animated-strumming-panel">
          <div class="animated-strumming-steps">${tokenHtml}</div>
          <div class="practice-inline-control">
            <label for="strumTrainerBpm">Tempo</label>
            <input id="strumTrainerBpm" type="range" min="40" max="180" step="1" value="${el('metronomeBpm')?.value || 80}">
            <strong><span id="strumTrainerBpmLabel">${el('metronomeBpm')?.value || 80}</span> BPM</strong>
          </div>
          <div class="practice-controls-row">
            <button id="strumTrainerToggle" type="button">Start strumming trainer</button>
            <button id="strumTrainerReset" type="button">Reset</button>
          </div>
        </div>
      </div>`;
    el('strumTrainerBpm')?.addEventListener('input', () => {
      el('strumTrainerBpmLabel').textContent = el('strumTrainerBpm').value;
      if (strumAnimationTimer) restartStrummingAnimation();
    });
    el('strumTrainerToggle')?.addEventListener('click', toggleStrummingAnimation);
    el('strumTrainerReset')?.addEventListener('click', resetStrummingAnimation);
    setStatus(`${title} loaded.`);
  }

  function renderMetronomePanel() {
    const workspace = el('practiceWorkspace');
    if (!workspace) return;
    workspace.innerHTML = `
      <div class="practice-card metronome-card">
        <div class="practice-card-head"><strong>Metronome</strong><span>${el('metronomeBpm')?.value || 80} BPM</span></div>
        <div id="metronomePulse" class="metronome-pulse">${renderBeatDots()}</div>
        <div class="practice-metronome-note">Use the metronome for chord changes, steady strumming, or full songs. The first beat of each bar is accented.</div>
      </div>`;
    updateMetronomeVisual();
    setStatus('Metronome ready. Choose a tempo and press Start metronome.');
  }

  function updateMetronomeBpmLabel() {
    const label = el('metronomeBpmLabel');
    if (label && el('metronomeBpm')) label.textContent = el('metronomeBpm').value;
  }

  function toggleMetronome() {
    if (metronomeTimer) stopMetronome();
    else startMetronome();
  }

  function startMetronome() {
    ensureAudioContext();
    metronomeBeat = 0;
    playMetronomeBeat();
    const interval = 60000 / Number(el('metronomeBpm')?.value || 80);
    metronomeTimer = setInterval(playMetronomeBeat, interval);
    if (el('metronomeToggle')) el('metronomeToggle').textContent = 'Stop metronome';
    document.body.classList.add('metronome-running');
    renderMetronomePanel();
  }

  function stopMetronome() {
    clearInterval(metronomeTimer);
    metronomeTimer = null;
    if (el('metronomeToggle')) el('metronomeToggle').textContent = 'Start metronome';
    document.body.classList.remove('metronome-running');
    updateMetronomeVisual();
  }

  function restartMetronome() {
    stopMetronome();
    startMetronome();
  }

  function playMetronomeBeat() {
    const beats = Number(el('metronomeBeats')?.value || 4);
    const accent = metronomeBeat % beats === 0;
    beep(accent ? 880 : 660, accent ? 0.075 : 0.05, accent ? 0.13 : 0.08);
    updateMetronomeVisual(metronomeBeat % beats);
    metronomeBeat = (metronomeBeat + 1) % beats;
  }

  function renderBeatDots(active = -1) {
    const beats = Number(el('metronomeBeats')?.value || 4);
    return Array.from({ length: beats }, (_, i) => `<span class="beat-dot ${i === active ? 'active' : ''} ${i === 0 ? 'accent' : ''}"></span>`).join('');
  }

  function updateMetronomeVisual(active = -1) {
    const pulse = el('metronomePulse');
    if (pulse) pulse.innerHTML = renderBeatDots(active);
  }

  function tapTempo() {
    const now = Date.now();
    tapTimes = tapTimes.filter(t => now - t < 2500);
    tapTimes.push(now);
    if (tapTimes.length >= 2) {
      const intervals = tapTimes.slice(1).map((t, i) => t - tapTimes[i]);
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.max(40, Math.min(240, Math.round(60000 / avg)));
      if (el('metronomeBpm')) el('metronomeBpm').value = bpm;
      updateMetronomeBpmLabel();
      savePracticeState?.({ metronomeBpm: bpm });
      if (metronomeTimer) restartMetronome();
      setStatus(`Tap tempo set to ${bpm} BPM.`);
    } else {
      setStatus('Tap again to set tempo.');
    }
  }

  function toggleStrummingAnimation() {
    if (strumAnimationTimer) stopStrummingAnimation();
    else startStrummingAnimation();
  }

  function startStrummingAnimation() {
    if (!currentStrumTokens.length) return setStatus('No strumming steps to animate.', true);
    ensureAudioContext();
    strumAnimationIndex = 0;
    advanceStrummingAnimation();
    const interval = 60000 / Number(el('strumTrainerBpm')?.value || 80);
    strumAnimationTimer = setInterval(advanceStrummingAnimation, interval);
    if (el('strumTrainerToggle')) el('strumTrainerToggle').textContent = 'Stop strumming trainer';
  }

  function stopStrummingAnimation() {
    clearInterval(strumAnimationTimer);
    strumAnimationTimer = null;
    if (el('strumTrainerToggle')) el('strumTrainerToggle').textContent = 'Start strumming trainer';
    document.querySelectorAll('[data-strum-step]').forEach(t => t.classList.remove('active'));
  }

  function restartStrummingAnimation() {
    stopStrummingAnimation();
    startStrummingAnimation();
  }

  function resetStrummingAnimation() {
    stopStrummingAnimation();
    strumAnimationIndex = 0;
  }

  function advanceStrummingAnimation() {
    document.querySelectorAll('[data-strum-step]').forEach(t => t.classList.remove('active'));
    const token = document.querySelector(`[data-strum-step="${strumAnimationIndex}"]`);
    if (token) token.classList.add('active');
    const current = currentStrumTokens[strumAnimationIndex];
    if (current !== '-') beep(current === 'D' ? 620 : current === 'U' ? 760 : 500, 0.04, current === 'X' ? 0.05 : 0.08);
    strumAnimationIndex = (strumAnimationIndex + 1) % currentStrumTokens.length;
  }

  function renderTimerPanel() {
    const workspace = el('practiceWorkspace');
    if (!workspace) return;
    if (!practiceTimerRemaining) {
      const minutes = Number(el('practiceTimerMinutes')?.value || 15);
      practiceTimerInitial = minutes * 60;
      practiceTimerRemaining = practiceTimerInitial;
    }
    workspace.innerHTML = `
      <div class="practice-card timer-card">
        <div class="practice-card-head"><strong>Practice Timer</strong><span>Focused session</span></div>
        <div id="practiceTimerDisplay" class="practice-timer-display">${formatTime(practiceTimerRemaining)}</div>
        <div class="timer-progress"><div id="practiceTimerProgress" style="width:${timerPercent()}%"></div></div>
        <div class="practice-metronome-note">A simple timer for focused practice blocks. Try 5 minutes of chords, 5 minutes of strumming, then one full song.</div>
      </div>`;
    setStatus('Practice timer ready. Choose a length and press Start timer.');
  }

  function togglePracticeTimer() {
    if (practiceTimerInterval) stopPracticeTimer();
    else startPracticeTimer();
  }

  function startPracticeTimer() {
    if (!practiceTimerRemaining) resetPracticeTimer(false);
    practiceTimerInterval = setInterval(() => {
      practiceTimerRemaining = Math.max(0, practiceTimerRemaining - 1);
      updateTimerDisplay();
      if (practiceTimerRemaining <= 0) {
        stopPracticeTimer();
        beep(880, 0.18, 0.16);
        setStatus('Practice session complete. Nice work!');
      }
    }, 1000);
    if (el('practiceTimerToggle')) el('practiceTimerToggle').textContent = 'Pause timer';
    renderTimerPanel();
  }

  function stopPracticeTimer() {
    clearInterval(practiceTimerInterval);
    practiceTimerInterval = null;
    if (el('practiceTimerToggle')) el('practiceTimerToggle').textContent = 'Start timer';
  }

  function resetPracticeTimer(render = true) {
    stopPracticeTimer();
    const minutes = Number(el('practiceTimerMinutes')?.value || 15);
    practiceTimerInitial = minutes * 60;
    practiceTimerRemaining = practiceTimerInitial;
    if (render) renderTimerPanel();
  }

  function updateTimerDisplay() {
    const display = el('practiceTimerDisplay');
    const progress = el('practiceTimerProgress');
    if (display) display.textContent = formatTime(practiceTimerRemaining);
    if (progress) progress.style.width = `${timerPercent()}%`;
  }

  function timerPercent() {
    if (!practiceTimerInitial) return 100;
    return Math.max(0, Math.min(100, (practiceTimerRemaining / practiceTimerInitial) * 100));
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function ensureAudioContext() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
  }

  function beep(frequency, duration, volume) {
    try {
      ensureAudioContext();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.value = frequency;
      gain.gain.value = volume;
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      osc.stop(audioContext.currentTime + duration);
    } catch {}
  }

  function extractStrumTokens(pattern) {
    const tokens = [];
    String(pattern).split(/\s*(?:;|\/)\s*/).forEach(part => {
      let value = part.trim();
      const m = value.match(/^([^:=]+)\s*[:=]\s*(.+)$/);
      if (m) value = m[2].trim();
      for (const ch of value) {
        const c = ch.toUpperCase();
        if (c === 'D' || c === 'U' || c === 'X' || c === '-') tokens.push(c);
      }
    });
    return tokens;
  }

  function tokenSymbol(token) {
    if (token === 'D') return '↓';
    if (token === 'U') return '↑';
    if (token === 'X') return '×';
    return '•';
  }

  function tokenClass(token) {
    if (token === '-') return 'rest';
    return token.toLowerCase();
  }

  function parseChordInput(input) {
    return [...new Set(String(input)
      .split(/[\s,;]+/)
      .map(c => c.trim())
      .filter(Boolean)
      .map(formatChordName))];
  }

  function formatChordName(chord) {
    let c = chord.trim();
    if (!c) return c;
    c = c.replace(/♯/g, '#').replace(/♭/g, 'b');
    c = c[0].toUpperCase() + c.slice(1);
    c = c.replace(/MIN/g, 'min').replace(/MAJ/g, 'maj').replace(/SUS/g, 'sus').replace(/DIM/g, 'dim').replace(/AUG/g, 'aug');
    c = c.replace(/mIN/g, 'min').replace(/mAJ/g, 'maj');
    return c.replace('min', 'm');
  }

  function validatePracticeChords(chords) {
    const known = [];
    const missing = [];
    chords.forEach(chord => {
      const clean = formatChordName(chord);
      const base = clean.split('/')[0];
      if (CHORDS[clean]) known.push(clean);
      else if (CHORDS[base]) known.push(clean);
      else missing.push(clean);
    });
    return { known: [...new Set(known)], missing: [...new Set(missing)] };
  }

  function uniqueUsefulChordName(chord) {
    if (/alt$/i.test(chord)) return false;
    if (chord.includes('min')) return false;
    return true;
  }

  function shuffle(list) {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function setStatus(message, isError = false) {
    const status = el('practiceStatus');
    if (!status) return;
    status.textContent = message || '';
    status.classList.toggle('error', !!isError);
  }
})();
