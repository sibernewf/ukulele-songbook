// v5.2.1 Song Notes
(function () {
  const NOTES_KEY = 'ukuleleSongbookSongNotesV1';

  const toggleButton = document.getElementById('toggleSongNotes');
  const notesPanel = document.getElementById('songNotesPanel');
  const notesText = document.getElementById('songNotesText');
  const saveButton = document.getElementById('saveSongNotes');
  const clearButton = document.getElementById('clearSongNotes');
  const status = document.getElementById('songNotesStatus');

  let currentSong = null;
  let currentIndex = null;

  if (!toggleButton || !notesPanel || !notesText || !saveButton || !clearButton || !status) return;

  function readNotes() {
    try {
      return JSON.parse(localStorage.getItem(NOTES_KEY)) || {};
    } catch (_) {
      return {};
    }
  }

  function writeNotes(notes) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }

  function keyFor(song, index) {
    return song && song.file ? song.file : String(index);
  }

  function getCurrentKey() {
    return currentSong ? keyFor(currentSong, currentIndex) : null;
  }

  function updateStatus(hasNotes) {
    status.textContent = hasNotes ? 'Notes saved for this song' : 'No notes yet';
    toggleButton.textContent = hasNotes ? '📝 Notes ✓' : '📝 Notes';
    toggleButton.classList.toggle('has-notes', !!hasNotes);
  }

  function loadNotesForSong(song, index) {
    currentSong = song;
    currentIndex = index;
    const notes = readNotes();
    const text = notes[keyFor(song, index)] || '';
    notesText.value = text;
    updateStatus(text.trim().length > 0);
    notesPanel.hidden = true;
  }

  function saveNotes() {
    const key = getCurrentKey();
    if (!key) return;
    const notes = readNotes();
    const text = notesText.value.trim();
    if (text) notes[key] = text;
    else delete notes[key];
    writeNotes(notes);
    updateStatus(!!text);
    status.textContent = text ? 'Notes saved.' : 'Notes cleared.';
  }

  function clearNotes() {
    notesText.value = '';
    saveNotes();
  }

  toggleButton.addEventListener('click', () => {
    notesPanel.hidden = !notesPanel.hidden;
  });

  saveButton.addEventListener('click', saveNotes);
  clearButton.addEventListener('click', () => {
    if (!notesText.value.trim() || confirm('Clear notes for this song?')) clearNotes();
  });

  window.ukulelePersonalSongbook = window.ukulelePersonalSongbook || {};
  const previousHook = window.ukulelePersonalSongbook.onSongLoaded;
  window.ukulelePersonalSongbook.onSongLoaded = function (payload) {
    if (typeof previousHook === 'function') previousHook(payload);
    loadNotesForSong(payload.song, payload.index);
  };
})();
