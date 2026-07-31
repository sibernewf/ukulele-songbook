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
    const activeLink = navLinks.find(a => a.classList.contains('active'));
    activeLink?.scrollIntoView({block:'nearest', inline:'nearest'});
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

  const levelThreeButton = document.getElementById('completeLevelThree');
  const levelThreeStatus = document.getElementById('levelThreeCompletionStatus');
  const levelThreeCheckIds = ['l3Frets','l3Press','l3Tab','l3Melody','l3Beat'];
  try {
    const saved = JSON.parse(localStorage.getItem('ukuleleAcademyLevel3Checks') || '{}');
    levelThreeCheckIds.forEach(id => { const node=document.getElementById(id); if(node) node.checked=Boolean(saved[id]); });
    if(localStorage.getItem('ukuleleAcademyLevel3Complete') === 'true' && levelThreeStatus) {
      levelThreeStatus.textContent = '✓ Level 3 completed. You are ready for Level 4 — Your First Chords.';
    }
  } catch (_) {}
  levelThreeButton?.addEventListener('click', () => {
    const checks = Object.fromEntries(levelThreeCheckIds.map(id => [id, document.getElementById(id)?.checked]));
    try { localStorage.setItem('ukuleleAcademyLevel3Checks', JSON.stringify(checks)); } catch (_) {}
    if(Object.values(checks).every(Boolean)) {
      try { localStorage.setItem('ukuleleAcademyLevel3Complete', 'true'); } catch (_) {}
      levelThreeStatus.textContent = '✓ Level 3 completed. You are ready for Level 4 — Your First Chords.';
    } else {
      levelThreeStatus.textContent = 'Tick each readiness statement before marking Level 3 complete.';
    }
  });

  const levelFourButton = document.getElementById('completeLevelFour');
  const levelFourStatus = document.getElementById('levelFourCompletionStatus');
  const levelFourCheckIds = ['l4Diagram','l4C','l4Am','l4F','l4G7'];
  try {
    const saved = JSON.parse(localStorage.getItem('ukuleleAcademyLevel4Checks') || '{}');
    levelFourCheckIds.forEach(id => { const node=document.getElementById(id); if(node) node.checked=Boolean(saved[id]); });
    if(localStorage.getItem('ukuleleAcademyLevel4Complete') === 'true' && levelFourStatus) {
      levelFourStatus.textContent = '✓ Level 4 completed. You are ready for Level 5 — Changing Chords.';
    }
  } catch (_) {}
  levelFourButton?.addEventListener('click', () => {
    const checks = Object.fromEntries(levelFourCheckIds.map(id => [id, document.getElementById(id)?.checked]));
    try { localStorage.setItem('ukuleleAcademyLevel4Checks', JSON.stringify(checks)); } catch (_) {}
    if(Object.values(checks).every(Boolean)) {
      try { localStorage.setItem('ukuleleAcademyLevel4Complete', 'true'); } catch (_) {}
      levelFourStatus.textContent = '✓ Level 4 completed. You are ready for Level 5 — Changing Chords.';
    } else {
      levelFourStatus.textContent = 'Tick each readiness statement before marking Level 4 complete.';
    }
  });

  const levelFiveButton = document.getElementById('completeLevelFive');
  const levelFiveStatus = document.getElementById('levelFiveCompletionStatus');
  const levelFiveCheckIds = ['l5Low','l5Anchor','l5Prepare','l5Pulse','l5Relax'];
  try {
    const saved = JSON.parse(localStorage.getItem('ukuleleAcademyLevel5Checks') || '{}');
    levelFiveCheckIds.forEach(id => { const node=document.getElementById(id); if(node) node.checked=Boolean(saved[id]); });
    if(localStorage.getItem('ukuleleAcademyLevel5Complete') === 'true' && levelFiveStatus) levelFiveStatus.textContent = '✓ Level 5 completed. You are ready for Level 6 — Rhythm and Timing.';
  } catch (_) {}
  levelFiveButton?.addEventListener('click', () => {
    const checks = Object.fromEntries(levelFiveCheckIds.map(id => [id, document.getElementById(id)?.checked]));
    try { localStorage.setItem('ukuleleAcademyLevel5Checks', JSON.stringify(checks)); } catch (_) {}
    if(Object.values(checks).every(Boolean)) {
      try { localStorage.setItem('ukuleleAcademyLevel5Complete', 'true'); } catch (_) {}
      levelFiveStatus.textContent = '✓ Level 5 completed. You are ready for Level 6 — Rhythm and Timing.';
    } else levelFiveStatus.textContent = 'Tick each readiness statement before marking Level 5 complete.';
  });

  const levelSixButton = document.getElementById('completeLevelSix');
  const levelSixStatus = document.getElementById('levelSixCompletionStatus');
  const levelSixCheckIds = ['l6Pulse','l6Count','l6And','l6Strum','l6Change'];
  try {
    const savedLevelSixChecks = JSON.parse(localStorage.getItem('ukuleleAcademyLevel6Checks') || '{}');
    levelSixCheckIds.forEach(id => { const item=document.getElementById(id); if(item) item.checked=Boolean(savedLevelSixChecks[id]); });
    if(localStorage.getItem('ukuleleAcademyLevel6Complete') === 'true' && levelSixStatus) levelSixStatus.textContent = '✓ Level 6 completed. You are ready for Level 7 — Strumming.';
  } catch (_) {}
  levelSixButton?.addEventListener('click', () => {
    const checks = Object.fromEntries(levelSixCheckIds.map(id => [id, document.getElementById(id)?.checked]));
    try { localStorage.setItem('ukuleleAcademyLevel6Checks', JSON.stringify(checks)); } catch (_) {}
    if(Object.values(checks).every(Boolean)) {
      try { localStorage.setItem('ukuleleAcademyLevel6Complete', 'true'); } catch (_) {}
      levelSixStatus.textContent = '✓ Level 6 completed. You are ready for Level 7 — Strumming.';
    } else levelSixStatus.textContent = 'Tick each readiness statement before marking Level 6 complete.';
  });

  const levelSevenButton = document.getElementById('completeLevelSeven');
  const levelSevenStatus = document.getElementById('levelSevenCompletionStatus');
  const levelSevenCheckIds = ['l7Down','l7Up','l7Choice','l7Even','l7Pattern'];
  try {
    const saved = JSON.parse(localStorage.getItem('ukuleleAcademyLevel7Checks') || '{}');
    levelSevenCheckIds.forEach(id => { const item=document.getElementById(id); if(item) item.checked=Boolean(saved[id]); });
    if(localStorage.getItem('ukuleleAcademyLevel7Complete') === 'true' && levelSevenStatus) levelSevenStatus.textContent = '✓ Level 7 completed. You are ready for Level 8 — Your First Songs.';
  } catch (_) {}
  levelSevenButton?.addEventListener('click', () => {
    const checks = Object.fromEntries(levelSevenCheckIds.map(id => [id, document.getElementById(id)?.checked]));
    try { localStorage.setItem('ukuleleAcademyLevel7Checks', JSON.stringify(checks)); } catch (_) {}
    if(Object.values(checks).every(Boolean)) {
      try { localStorage.setItem('ukuleleAcademyLevel7Complete', 'true'); } catch (_) {}
      levelSevenStatus.textContent = '✓ Level 7 completed. You are ready for Level 8 — Your First Songs.';
    } else levelSevenStatus.textContent = 'Tick each readiness statement before marking Level 7 complete.';
  });

  // Custom Academy exercises for experienced learners.
  function openCustomExercise(id, values) {
    const params = new URLSearchParams({ academyExercise: id, ...values });
    window.location.href = `index.html?${params.toString()}#practiceMode`;
  }

  const l4Input = document.getElementById('level4CustomChord');
  const l4Status = document.getElementById('level4CustomStatus');
  document.getElementById('startLevel4Custom')?.addEventListener('click', () => {
    const chord = l4Input?.value.trim();
    if (!chord) { l4Status.textContent = 'Enter a chord first.'; l4Input?.focus(); return; }
    openCustomExercise('L4-CUSTOM', { chord });
  });

  const l5Input = document.getElementById('level5CustomChords');
  const l5Status = document.getElementById('level5CustomStatus');
  document.getElementById('startLevel5Custom')?.addEventListener('click', () => {
    const chords = (l5Input?.value || '').split(/[\s,→|]+/).filter(Boolean);
    if (chords.length !== 4) { l5Status.textContent = 'Enter exactly four chords, separated by spaces or commas.'; l5Input?.focus(); return; }
    openCustomExercise('L5-CUSTOM', { chords: chords.join(',') });
  });

  const l7Input = document.getElementById('level7CustomPattern');
  const l7Status = document.getElementById('level7CustomStatus');
  document.getElementById('startLevel7Custom')?.addEventListener('click', () => {
    const raw = l7Input?.value.trim() || '';
    const compact = raw.toUpperCase().replace(/[–—_]/g, '-').replace(/\s+/g, '');
    if (!compact || !/^[DU-]+$/.test(compact)) { l7Status.textContent = 'Use only D, U and – (or hyphen) in the pattern.'; l7Input?.focus(); return; }
    if (compact.length > 16) { l7Status.textContent = 'Please use no more than 16 strumming steps.'; l7Input?.focus(); return; }
    openCustomExercise('L7-CUSTOM', { pattern: compact });
  });

  [l4Input,l5Input,l7Input].forEach(input => input?.addEventListener('keydown', event => {
    if (event.key === 'Enter') input.closest('article')?.querySelector('button')?.click();
  }));

  // Custom Academy practice builders for experienced learners.
  document.querySelectorAll('.academy-custom-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const type = form.dataset.customExercise;
      const status = form.querySelector('.custom-form-status');
      const params = new URLSearchParams({ academyExercise: type });
      if (type === 'L4-CUSTOM') {
        const chord = form.elements.chord.value.trim();
        if (!chord) { if(status) status.textContent = 'Enter a chord first.'; return; }
        params.set('chord', chord);
      } else if (type === 'L5-CUSTOM') {
        const chords = form.elements.chords.value.trim().split(/[\s,;|]+/).filter(Boolean);
        if (chords.length !== 4) { if(status) status.textContent = 'Enter exactly four chords, separated by spaces.'; return; }
        params.set('chords', chords.join(','));
      } else if (type === 'L7-CUSTOM') {
        const raw = form.elements.pattern.value.trim().toUpperCase().replace(/[—_]/g, '–');
        const tokens = raw.match(/[DUX\-–]/g) || [];
        if (!tokens.length || tokens.some(token => !['D','U','X','-','–'].includes(token))) { if(status) status.textContent = 'Use D, U and – only.'; return; }
        params.set('pattern', tokens.map(token => token === '-' || token === 'X' ? '–' : token).join(','));
      }
      window.location.href = `index.html?${params.toString()}#practiceMode`;
    });
  });

  // Keep the active section visible inside the independently scrolling lesson tree.
  const navScroller = document.querySelector('.academy-nav-scroll');
  const revealActiveNav = () => {
    const active = navScroller?.querySelector('a.active');
    active?.scrollIntoView({ block: 'nearest' });
  };
  window.setTimeout(revealActiveNav, 100);

  // Keep the complete Academy sidebar inside the visible browser window.
  // The fixed header remains visible while only the lesson tree scrolls.
  const academyNav = document.querySelector('.academy-nav');
  const sizeAcademySidebar = () => {
    if (!academyNav) return;
    if (window.matchMedia('(max-width: 800px)').matches) {
      academyNav.style.removeProperty('height');
      academyNav.style.removeProperty('max-height');
      return;
    }
    const top = Math.max(16, academyNav.getBoundingClientRect().top);
    const available = Math.max(320, window.innerHeight - top - 16);
    academyNav.style.height = `${available}px`;
    academyNav.style.maxHeight = `${available}px`;
  };
  sizeAcademySidebar();
  window.addEventListener('resize', sizeAcademySidebar);
  window.addEventListener('scroll', sizeAcademySidebar, { passive: true });


  const levelEightButton = document.getElementById('completeLevelEight');
  const levelEightStatus = document.getElementById('levelEightCompletionStatus');
  const levelEightCheckIds = ['l8Open','l8Steady','l8Changes','l8Tools','l8Choice'];
  try {
    const saved = JSON.parse(localStorage.getItem('ukuleleAcademyLevel8Checks') || '{}');
    levelEightCheckIds.forEach(id => { const el=document.getElementById(id); if(el) el.checked=Boolean(saved[id]); });
    if(localStorage.getItem('ukuleleAcademyLevel8Complete') === 'true' && levelEightStatus) levelEightStatus.textContent = '✓ Level 8 completed. You have graduated from the Foundation Academy!';
  } catch (_) {}
  levelEightButton?.addEventListener('click', () => {
    const checks = Object.fromEntries(levelEightCheckIds.map(id => [id, document.getElementById(id)?.checked]));
    try { localStorage.setItem('ukuleleAcademyLevel8Checks', JSON.stringify(checks)); } catch (_) {}
    if(Object.values(checks).every(Boolean)) {
      try { localStorage.setItem('ukuleleAcademyLevel8Complete', 'true'); } catch (_) {}
      levelEightStatus.textContent = '✓ Level 8 completed. You have graduated from the Foundation Academy!';
    } else levelEightStatus.textContent = 'Tick each graduation statement before completing Level 8.';
  });
})();
