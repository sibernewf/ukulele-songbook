(() => {
  const motivation = document.getElementById('academyMotivation');
  const saveButton = document.getElementById('saveMotivation');
  const status = document.getElementById('motivationStatus');
  const completeButton = document.getElementById('completeLevelZero');
  const completionStatus = document.getElementById('completionStatus');
  const checkIds = ['readyUke','readyPractice','readyMistakes'];

  try {
    motivation.value = localStorage.getItem('ukuleleAcademyMotivation') || '';
    const savedChecks = JSON.parse(localStorage.getItem('ukuleleAcademyLevel0Checks') || '{}');
    checkIds.forEach(id => { const el=document.getElementById(id); if(el) el.checked=Boolean(savedChecks[id]); });
    if(localStorage.getItem('ukuleleAcademyLevel0Complete') === 'true') {
      completionStatus.textContent = '✓ Level 0 completed. You are ready for Level 1 when it arrives.';
    }
  } catch (_) {}

  saveButton?.addEventListener('click', () => {
    try { localStorage.setItem('ukuleleAcademyMotivation', motivation.value.trim()); }
    catch (_) {}
    status.textContent = 'Saved.';
    window.setTimeout(() => status.textContent = '', 1800);
  });

  completeButton?.addEventListener('click', () => {
    const checks = Object.fromEntries(checkIds.map(id => [id, document.getElementById(id)?.checked]));
    try { localStorage.setItem('ukuleleAcademyLevel0Checks', JSON.stringify(checks)); } catch (_) {}
    if(Object.values(checks).every(Boolean)) {
      try { localStorage.setItem('ukuleleAcademyLevel0Complete', 'true'); } catch (_) {}
      completionStatus.textContent = '✓ Level 0 completed. You are ready for Level 1 when it arrives.';
    } else {
      completionStatus.textContent = 'Tick each readiness statement before marking Level 0 complete.';
    }
  });

  const navLinks = [...document.querySelectorAll('.academy-nav a[href^="#"]')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible) return;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + visible.target.id));
  }, {rootMargin:'-15% 0px -70% 0px', threshold:[0,.2,.5]});
  sections.forEach(s => observer.observe(s));
})();
