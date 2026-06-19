// v5.2.1 Recently Played + Resume Last Song
(function () {
  const RECENT_KEY = 'ukuleleSongbookRecentSongsV1';
  const LAST_KEY = 'ukuleleSongbookLastSongV1';
  const MAX_RECENT = 10;

  const recentBox = document.getElementById('recentSongs');
  const clearButton = document.getElementById('clearRecentSongs');
  let restoring = false;

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function songKey(song, index) {
    return song && song.file ? song.file : String(index);
  }

  function getRecent() {
    return readJson(RECENT_KEY, []);
  }

  function setRecent(items) {
    writeJson(RECENT_KEY, items.slice(0, MAX_RECENT));
  }

  function escape(value) {
    return String(value || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

  function renderRecent() {
    if (!recentBox || typeof SONGS === 'undefined') return;
    const items = getRecent().filter(item => SONGS[item.index]);

    if (!items.length) {
      recentBox.innerHTML = '<p class="hint compact-hint">Recently opened songs will appear here.</p>';
      return;
    }

    recentBox.innerHTML = '<div class="recent-song-list">' + items.map(item => {
      const song = SONGS[item.index];
      const label = `${song.title}${song.artist ? ' — ' + song.artist : ''}`;
      return `<button type="button" class="recent-song-button" data-song-index="${item.index}">🎵 ${escape(label)}</button>`;
    }).join('') + '</div>';

    recentBox.querySelectorAll('[data-song-index]').forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.songIndex);
        const select = document.getElementById('songSelect');
        if (select) select.value = String(index);
        if (typeof loadSong === 'function') loadSong(index);
      });
    });
  }

  function recordSong(song, index) {
    if (!song || typeof index !== 'number') return;
    const item = {
      key: songKey(song, index),
      index,
      title: song.title || '',
      artist: song.artist || '',
      openedAt: new Date().toISOString()
    };

    const recent = getRecent().filter(existing => existing.key !== item.key);
    recent.unshift(item);
    setRecent(recent);
    writeJson(LAST_KEY, item);
    renderRecent();
  }

  function restoreLastSong() {
    if (typeof SONGS === 'undefined' || typeof loadSong !== 'function') return;
    const last = readJson(LAST_KEY, null);
    if (!last || !SONGS[last.index]) return;

    const select = document.getElementById('songSelect');
    if (select) select.value = String(last.index);
    restoring = true;
    loadSong(last.index).finally(() => { restoring = false; });
  }

  window.ukulelePersonalSongbook = window.ukulelePersonalSongbook || {};
  const previousHook = window.ukulelePersonalSongbook.onSongLoaded;
  window.ukulelePersonalSongbook.onSongLoaded = function (payload) {
    if (typeof previousHook === 'function') previousHook(payload);
    recordSong(payload.song, payload.index);
  };

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      localStorage.removeItem(RECENT_KEY);
      renderRecent();
    });
  }

  renderRecent();
  setTimeout(restoreLastSong, 0);
})();
