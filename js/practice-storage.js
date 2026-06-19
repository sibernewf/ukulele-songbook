// Small localStorage helper for Practice Mode.
// Keeps the last custom chord list and a simple practice summary on this browser/device.

const PRACTICE_STORAGE_KEY = 'ukuleleSongbookPracticeV1';

function loadPracticeState() {
  try {
    return JSON.parse(localStorage.getItem(PRACTICE_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function savePracticeState(update) {
  const current = loadPracticeState();
  const next = { ...current, ...update, updatedAt: new Date().toISOString() };
  localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(next));
  return next;
}
