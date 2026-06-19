/* v5.1 Auto Scroll */
(function () {
  const STORAGE_KEY = 'ukuleleSongbookAutoScrollV1';
  const el = id => document.getElementById(id);

  let running = false;
  let frameId = null;
  let lastTime = 0;
  let fractionalScroll = 0;

  document.addEventListener('DOMContentLoaded', initAutoScroll);
  if (document.readyState !== 'loading') initAutoScroll();

  function initAutoScroll() {
    const toggle = el('autoScrollToggle');
    const speed = el('autoScrollSpeed');
    const reset = el('autoScrollReset');
    const label = el('autoScrollSpeedLabel');
    const songText = el('songText');
    if (!toggle || !speed || !reset || !label || !songText) return;

    const saved = loadSettings();
    if (saved.speed) speed.value = saved.speed;
    updateSpeedLabel();

    toggle.addEventListener('click', () => running ? pauseAutoScroll() : startAutoScroll());
    reset.addEventListener('click', resetAutoScroll);
    speed.addEventListener('input', () => {
      updateSpeedLabel();
      saveSettings();
    });

    const observer = new MutationObserver(() => {
      pauseAutoScroll();
      const target = scrollTarget();
      target.scrollTop = 0;
      fractionalScroll = 0;
    });
    observer.observe(songText, { childList: true, characterData: true, subtree: true });

    function updateSpeedLabel() {
      label.textContent = speed.value;
    }
  }

  function startAutoScroll() {
    if (running) return;
    running = true;
    lastTime = performance.now();
    fractionalScroll = scrollTarget().scrollTop;
    el('autoScrollToggle').textContent = 'Pause';
    document.body.classList.add('auto-scroll-running');
    frameId = requestAnimationFrame(tick);
  }

  function pauseAutoScroll() {
    running = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = null;
    const toggle = el('autoScrollToggle');
    if (toggle) toggle.textContent = 'Start';
    document.body.classList.remove('auto-scroll-running');
  }

  function resetAutoScroll() {
    pauseAutoScroll();
    const target = scrollTarget();
      target.scrollTop = 0;
      fractionalScroll = 0;
  }

  function tick(now) {
    if (!running) return;
    const target = scrollTarget();
    const delta = Math.max(0, now - lastTime);
    lastTime = now;

    const pixelsPerSecond = speedToPixelsPerSecond(Number(el('autoScrollSpeed')?.value || 3));

    // Keep our own fractional position. Some browsers round element.scrollTop
    // to whole pixels, so adding tiny sub-pixel amounts can appear to do
    // nothing at low speeds. This makes speeds 1-9 visibly work while keeping
    // speed 10 available for fast scrolling.
    fractionalScroll += pixelsPerSecond * (delta / 1000);
    target.scrollTop = fractionalScroll;

    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 2) {
      pauseAutoScroll();
      return;
    }

    frameId = requestAnimationFrame(tick);
  }

  function scrollTarget() {
    if (document.body.classList.contains('performance-mode')) {
      return document.scrollingElement || document.documentElement;
    }
    return document.querySelector('.song-panel') || document.scrollingElement || document.documentElement;
  }

  function speedToPixelsPerSecond(speed) {
    // A gentle range for reading music on a stand: 8px/sec to 80px/sec.
    return 8 + ((Math.max(1, Math.min(10, speed)) - 1) * 8);
  }

  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  }

  function saveSettings() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ speed: el('autoScrollSpeed')?.value || '3' })); } catch {}
  }
})();
