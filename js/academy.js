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
      completionStatus.textContent = '✓ Level 0 completed. You are ready for Level 1 — Holding Your Ukulele.';
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
      completionStatus.textContent = '✓ Level 0 completed. You are ready for Level 1 — Holding Your Ukulele.';
    } else {
      completionStatus.textContent = 'Tick each readiness statement before marking Level 0 complete.';
    }
  });

  const levelOneButton = document.getElementById('completeLevelOne');
  const levelOneStatus = document.getElementById('levelOneCompletionStatus');
  const levelOneCheckIds = ['l1Posture','l1Support','l1Thumb','l1Arm','l1Comfort'];

  try {
    const savedLevelOneChecks = JSON.parse(localStorage.getItem('ukuleleAcademyLevel1Checks') || '{}');
    levelOneCheckIds.forEach(id => { const el=document.getElementById(id); if(el) el.checked=Boolean(savedLevelOneChecks[id]); });
    if(localStorage.getItem('ukuleleAcademyLevel1Complete') === 'true' && levelOneStatus) {
      levelOneStatus.textContent = '✓ Level 1 completed. You are ready for Level 2 — Tuning.';
    }
  } catch (_) {}

  levelOneButton?.addEventListener('click', () => {
    const checks = Object.fromEntries(levelOneCheckIds.map(id => [id, document.getElementById(id)?.checked]));
    try { localStorage.setItem('ukuleleAcademyLevel1Checks', JSON.stringify(checks)); } catch (_) {}
    if(Object.values(checks).every(Boolean)) {
      try { localStorage.setItem('ukuleleAcademyLevel1Complete', 'true'); } catch (_) {}
      levelOneStatus.textContent = '✓ Level 1 completed. You are ready for Level 2 — Tuning.';
    } else {
      levelOneStatus.textContent = 'Tick each readiness statement before marking Level 1 complete.';
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

  // Collapsible lesson groups in the left navigation.
  const navGroups = [...document.querySelectorAll('.nav-group')];
  const savedNavState = (() => {
    try { return JSON.parse(localStorage.getItem('ukuleleAcademyNavGroups') || '{}'); }
    catch (_) { return {}; }
  })();
  navGroups.forEach(group => {
    const key = group.dataset.navGroup;
    if (Object.prototype.hasOwnProperty.call(savedNavState, key)) {
      group.classList.toggle('open', Boolean(savedNavState[key]));
    }
    const button = group.querySelector('.nav-group-toggle');
    const icon = group.querySelector('.toggle-icon');
    const sync = () => {
      const open = group.classList.contains('open');
      button?.setAttribute('aria-expanded', String(open));
      if (icon) icon.textContent = open ? '▾' : '▸';
    };
    sync();
    button?.addEventListener('click', () => {
      group.classList.toggle('open');
      sync();
      try {
        const state = Object.fromEntries(navGroups.map(g => [g.dataset.navGroup, g.classList.contains('open')]));
        localStorage.setItem('ukuleleAcademyNavGroups', JSON.stringify(state));
      } catch (_) {}
    });
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    const group = link.closest('.nav-group');
    if (group && !group.classList.contains('open')) group.querySelector('.nav-group-toggle')?.click();
  }));

  const levelTwoButton = document.getElementById('completeLevelTwo');
  const levelTwoStatus = document.getElementById('levelTwoCompletionStatus');
  const levelTwoCheckIds = ['l2Strings','l2Tool','l2Pitch','l2Tune','l2Routine'];
  try {
    const savedLevelTwoChecks = JSON.parse(localStorage.getItem('ukuleleAcademyLevel2Checks') || '{}');
    levelTwoCheckIds.forEach(id => { const el=document.getElementById(id); if(el) el.checked=Boolean(savedLevelTwoChecks[id]); });
    if(localStorage.getItem('ukuleleAcademyLevel2Complete') === 'true' && levelTwoStatus) {
      levelTwoStatus.textContent = '✓ Level 2 completed. You are ready for Level 3 — Your First Notes.';
    }
  } catch (_) {}
  levelTwoButton?.addEventListener('click', () => {
    const checks = Object.fromEntries(levelTwoCheckIds.map(id => [id, document.getElementById(id)?.checked]));
    try { localStorage.setItem('ukuleleAcademyLevel2Checks', JSON.stringify(checks)); } catch (_) {}
    if(Object.values(checks).every(Boolean)) {
      try { localStorage.setItem('ukuleleAcademyLevel2Complete', 'true'); } catch (_) {}
      levelTwoStatus.textContent = '✓ Level 2 completed. You are ready for Level 3 — Your First Notes.';
    } else {
      levelTwoStatus.textContent = 'Tick each readiness statement before marking Level 2 complete.';
    }
  });

})();
