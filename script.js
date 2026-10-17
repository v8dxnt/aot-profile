'use strict';

/* =========================================================
   Profilr™ — the worst "Edit Profile" page ever.
   Every feature lives in its own init function and is run
   through safe(), so one broken feature never breaks others.
   ========================================================= */

/* ---------- Sound hooks ---------- */
const SFX = { // event name -> file path (unmapped events are silent)
  click: 'Vine Boom Sound Effect - Soundspace Sound Effects.mp3',
  keyPress: 'Dry Fart Meme Sound Effect  #memeeffects #memes #funny #sfxstore #soundeffectsstudio #audio - Meme Template And Sound.mp3',
};
const sfxCache = {};

function playSfx(name) {
  try {
    const src = SFX[name];
    if (!src) return;
    if (!sfxCache[name]) sfxCache[name] = new Audio(encodeURIComponent(src));
    // Clone so rapid clicks overlap instead of cutting each other off.
    const sound = sfxCache[name].cloneNode();
    const p = sound.play();
    if (p && p.catch) p.catch(() => {});
  } catch (err) { /* sounds are optional */ }
}

// Vine boom on every click anywhere on the page.
document.addEventListener('click', () => playSfx('click'), true);

// Dry fart on every keystroke typed into any field (the on-screen keyboard calls it too).
document.addEventListener('keydown', (e) => {
  const typing = e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete';
  if (typing && !e.repeat && e.target.closest('input, textarea, [contenteditable]')) playSfx('keyPress');
}, true);

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
const rand = (n) => Math.floor(Math.random() * n);

function safe(name, fn) {
  try { fn(); } catch (err) { console.warn('[Profilr] ' + name + ' failed:', err); }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toast(msg, ms = 2800) {
  const box = $('toasts');
  if (!box) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  box.appendChild(el);
  while (box.children.length > 4) box.firstChild.remove();
  setTimeout(() => el.remove(), ms);
  playSfx('toast');
}

/* ---------- Rage state ---------- */
let rage = 0;
const RAGE_LEVELS = [
  { min: 0, label: 'Calm 😌', color: '#22c55e' },
  { min: 25, label: 'Annoyed 😤', color: '#eab308' },
  { min: 50, label: 'Fuming 🤬', color: '#f97316' },
  { min: 75, label: 'Laptop-Yeeting 💻🚀', color: '#dc2626' },
];

function rageLevel() {
  return RAGE_LEVELS.filter((l) => rage >= l.min).pop();
}

function renderRage() {
  const fill = $('rage-fill');
  if (!fill) return;
  const level = rageLevel();
  fill.style.width = rage + '%';
  fill.style.background = level.color;
  $('rage-text').textContent = level.label;
  $('rage-pct').textContent = rage + '%';
}

function addRage(amount = 5) {
  const before = rageLevel();
  rage = Math.min(100, rage + amount);
  if (rageLevel() !== before) playSfx('rageLevelUp');
  renderRage();
}

// A failed / annoying action: +5% rage, error sound, optional toast.
function fail(msg) {
  addRage(5);
  playSfx('error');
  if (msg) toast(msg);
}

// info = true shows a single, friendly OK button (no Cancel, not red).
function openModal(title, body, okText, onOk, info) {
  const modal = $('modal');
  $('modal-title').textContent = title;
  $('modal-body').textContent = body;
  $('modal-ok').textContent = okText;
  $('modal-ok').classList.toggle('danger', !info);
  $('modal-cancel').classList.toggle('hidden', !!info);
  modal.classList.remove('hidden');
  const close = () => {
    modal.classList.add('hidden');
    $('modal-ok').onclick = null;
    $('modal-cancel').onclick = null;
  };
  $('modal-cancel').onclick = close;
  $('modal-ok').onclick = () => { close(); if (onOk) onOk(); };
}

/* =========================================================
   1. Rage-O-Meter
   ========================================================= */
function initRageMeter() {
  renderRage();
}

/* =========================================================
   2. Hydra cookie banner
   ========================================================= */
function initCookieHydra() {
  const layer = $('cookie-layer');
  if (!layer) return;
  const TITLES = [
    'We value your privacy 🍪', 'Are you sure?', 'Really sure?', 'Like, really really?',
    'Think of the cookies 🥺', 'Last chance!', 'Final answer?', 'Okay, but hear us out',
  ];
  const MAX = 8;
  let created = 0;

  function closeAll() { layer.innerHTML = ''; }

  function spawn(randomPos) {
    const el = document.createElement('div');
    el.className = 'cookie';
    el.innerHTML =
      '<h4>' + TITLES[Math.min(created, TITLES.length - 1)] + '</h4>' +
      '<p>We use cookies to improve your experience, personalise ads, and read your diary.</p>' +
      '<button class="accept" type="button">Accept All</button>' +
      '<button class="reject" type="button">reject</button>';
    created++;

    const w = Math.min(420, window.innerWidth - 32);
    if (randomPos) {
      el.style.left = 16 + rand(Math.max(1, window.innerWidth - w - 32)) + 'px';
      el.style.top = 56 + rand(Math.max(1, window.innerHeight - 290)) + 'px';
    } else {
      el.style.left = Math.round((window.innerWidth - w) / 2) + 'px';
      el.style.bottom = '24px';
    }

    el.querySelector('.accept').addEventListener('click', () => {
      closeAll();
      toast('Cookies accepted. Great choice! 🍪');
    });
    el.querySelector('.reject').addEventListener('click', () => {
      el.remove();
      addRage(5);
      playSfx('reject');
      const more = Math.min(2, MAX - created);
      if (more <= 0) {
        closeAll();
        toast('We accepted for you ❤️');
        return;
      }
      for (let i = 0; i < more; i++) spawn(true);
    });
    layer.appendChild(el);
  }

  setTimeout(() => spawn(false), 600);
}

/* =========================================================
   3. Name: on-screen shuffling keyboard only
   ========================================================= */
function initNameKeyboard() {
  const input = $('name-input');
  const kb = $('name-keyboard');
  if (!input || !kb) return;
  const KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat(['Space', '⌫']);
  let lastWarn = 0;

  function render() {
    kb.innerHTML = '';
    shuffle(KEYS.slice()).forEach((k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = k;
      if (k.length > 1) b.classList.add('wide');
      b.addEventListener('click', () => press(k));
      kb.appendChild(b);
    });
  }

  function press(k) {
    playSfx('keyPress');
    const v = input.value;
    if (k === '⌫') input.value = v.slice(0, -2); // deletes 2, because why not
    else if (k === 'Space') input.value = v + ' ';
    else input.value = v + (v === '' || v.endsWith(' ') ? k : k.toLowerCase());
    render();
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') return;
    e.preventDefault();
    const now = Date.now();
    if (now - lastWarn > 1500) {
      lastWarn = now;
      fail('Physical keyboards are insecure. Use the secure keyboard 🔐');
    }
  });
  input.addEventListener('paste', (e) => { e.preventDefault(); fail('Pasting names is not allowed 🤨'); });
  render();
}

/* =========================================================
   4. Email: "helpful" autocorrect
   ========================================================= */
function initEmailAutocorrect() {
  const input = $('email-input');
  const hint = $('email-hint');
  if (!input) return;
  let corrections = 0;

  input.addEventListener('blur', () => {
    if (!/gmail\.com/i.test(input.value)) return;
    if (corrections >= 3) {
      hint.className = 'hint';
      hint.textContent = 'Fine. gmail.com it is. We’ll allow it 🙄';
      return;
    }
    corrections++;
    input.value = input.value.replace(/gmail\.com/gi, 'gmial.com');
    hint.className = 'hint bad';
    hint.textContent = 'We fixed a typo for you ✨';
    fail('Autocorrect: gmail.com → gmial.com ✨');
  });
}

/* =========================================================
   5. Phone: slider only
   ========================================================= */
function initPhoneSlider() {
  const slider = $('phone-slider');
  const display = $('phone-display');
  if (!slider || !display) return;
  const fmt = (n) => {
    const s = String(n).padStart(10, '0');
    return s.slice(0, 3) + '-' + s.slice(3, 6) + '-' + s.slice(6);
  };
  slider.addEventListener('input', () => { display.textContent = fmt(slider.value); });
  display.textContent = fmt(slider.value);
}

/* =========================================================
   6. Date of birth: −1 day / +1 year only
   ========================================================= */
function initDobButtons() {
  const display = $('dob-display');
  if (!display) return;
  const dob = new Date();
  dob.setHours(12, 0, 0, 0);
  const render = () => {
    display.textContent = dob.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  $('dob-minus-day').addEventListener('click', () => { dob.setDate(dob.getDate() - 1); render(); });
  $('dob-plus-year').addEventListener('click', () => {
    dob.setFullYear(dob.getFullYear() + 1);
    render();
    if (dob > new Date()) fail('You can’t be born in the future 🙃');
  });
  render();
}

/* =========================================================
   7. Password game
   ========================================================= */
function initPasswordGame() {
  const input = $('password-input');
  const list = $('password-rules');
  if (!input || !list) return;
  const digitSum = (p) => (p.match(/\d/g) || []).reduce((s, d) => s + Number(d), 0);
  const RULES = [
    { text: 'At least 8 characters', test: (p) => p.length >= 8 },
    { text: 'Must contain an uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { text: 'Must contain a number', test: (p) => /\d/.test(p) },
    { text: 'The digits must add up to 25', test: (p) => digitSum(p) === 25 },
    { text: 'Must contain the word "please"', test: (p) => /please/i.test(p) },
  ];
  const items = [];
  let celebrated = false;

  function reveal() {
    const i = items.length;
    const li = document.createElement('li');
    list.appendChild(li);
    items.push(li);
    if (i > 0) addRage(5);
  }

  function update() {
    const p = input.value;
    while (items.length < RULES.length && RULES.slice(0, items.length).every((r) => r.test(p))) reveal();
    items.forEach((li, i) => {
      const ok = RULES[i].test(p);
      li.className = ok ? 'ok' : '';
      li.textContent = (ok ? '✅ ' : '❌ ') + 'Rule ' + (i + 1) + ': ' + RULES[i].text;
    });
    const passed = RULES.filter((r) => r.test(p)).length;
    $('strength-fill').style.width = 8 + passed * 2 + '%';
    $('strength-text').textContent = 'Weak 😬'; // always.
    if (passed === RULES.length && !celebrated) {
      celebrated = true;
      toast('All rules passed! Password strength: Weak 😬');
    }
  }

  input.addEventListener('input', update);
  reveal();
  update();
}

/* =========================================================
   8. "I'm not a robot"
   ========================================================= */
function initRobotCheck() {
  const check = $('robot-check');
  const msg = $('robot-msg');
  if (!check) return;
  let tries = 0;
  let timer = null;

  check.addEventListener('change', () => {
    if (!check.checked) return;
    clearTimeout(timer);
    tries++;
    if (tries < 3) {
      msg.className = 'robot-msg';
      msg.textContent = 'Verifying…';
      timer = setTimeout(() => {
        check.checked = false;
        msg.textContent = 'Verification expired. Please try again.';
        fail();
        playSfx('captchaFail');
      }, 2000);
    } else {
      check.disabled = true;
      msg.className = 'robot-msg';
      msg.textContent = 'Too fast. Robots are fast.';
      fail();
      timer = setTimeout(() => {
        check.checked = true;
        msg.className = 'robot-msg ok';
        msg.textContent = 'Fine. You seem human enough ✅';
      }, 1800);
    }
  });
}

/* =========================================================
   9. Infinite Terms & Conditions
   ========================================================= */
function initInfiniteTerms() {
  const box = $('terms-box');
  const check = $('terms-check');
  const label = $('terms-label');
  if (!box || !check) return;
  const CLAUSES = [
    'By existing near a device running Profilr™, you agree to these Terms.',
    'Profilr™ may update these Terms at any time, including while you are reading them.',
    'You grant Profilr™ a perpetual, worldwide licence to your vibe.',
    'Your profile photo may be used to train our Feelings Engine™.',
    'Scrolling does not constitute reading. Reading does not constitute understanding.',
    'Any disputes will be settled by a rock-paper-scissors tournament (best of 99).',
    'Profilr™ is not liable for keyboards thrown in frustration.',
    'You agree not to agree to anything you have not already agreed to.',
    'Section 7(b) intentionally left confusing.',
  ];
  let section = 0;
  let appended = 0;
  let enabled = false;

  function addParagraphs(n) {
    for (let i = 0; i < n; i++) {
      const p = document.createElement('p');
      section++;
      p.textContent = section + '. ' + CLAUSES[(section - 1) % CLAUSES.length];
      box.appendChild(p);
    }
  }

  box.addEventListener('scroll', () => {
    if (enabled) return;
    if (box.scrollTop + box.clientHeight < box.scrollHeight - 20) return;
    if (appended < 3) {
      appended++;
      addParagraphs(4);
      fail('Oh wait, there’s more 📜');
    } else {
      enabled = true;
      check.disabled = false;
      label.classList.remove('disabled');
      toast('You may now agree. Or not not agree.');
    }
  });
  addParagraphs(6);
}

/* =========================================================
   10a. "Delete Account" — big, blue, harmless
   ========================================================= */
function initDeleteAccount() {
  const btn = $('delete-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    openModal(
      'Delete account?',
      'This will permanently delete your account, your friends, and your will to continue.',
      'Yes, delete',
      () => toast('Just kidding. Account deletion is a Profilr Premium™ feature 💎')
    );
  });
}

/* =========================================================
   10b. Runaway Save button
   ========================================================= */
function initRunawaySave() {
  const btn = $('save-btn');
  if (!btn) return;
  const MAX_DODGES = 5;
  let dodges = 0;
  let cooldown = false;

  document.addEventListener('mousemove', (e) => {
    if (dodges >= MAX_DODGES || cooldown) return;
    const r = btn.getBoundingClientRect();
    const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    if (dist > 80) return;

    dodges++;
    cooldown = true;
    setTimeout(() => { cooldown = false; }, 300);
    playSfx('dodge');
    addRage(5);

    let x, y, tries = 0;
    do {
      x = 20 + rand(Math.max(1, window.innerWidth - r.width - 40));
      y = 60 + rand(Math.max(1, window.innerHeight - r.height - 80));
      tries++;
    } while (Math.hypot(x - e.clientX, y - e.clientY) < 220 && tries < 15);
    btn.classList.add('running');
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';

    if (dodges >= MAX_DODGES) btn.textContent = 'Save (fine 🙄)';
  });

  // Saving is only allowed once the user is maximally furious.
  btn.addEventListener('click', () => {
    if (rage < 100) {
      addRage(5);
      playSfx('error');
      toast(rage < 100
        ? 'You’re not angry enough to save yet 😌 Rage: ' + rage + '% / 100%'
        : 'Rage maxed 💻🚀 NOW you may save.');
      return;
    }
    playSfx('saving');
    openModal(
      'Account info saved ✅',
      'Your profile has been saved. It only took ' + rage + '% of your sanity.',
      'OK 😊',
      null,
      true
    );
  });
}

/* =========================================================
   11. Dark-mode toggle
   ========================================================= */
function initDarkMode() {
  const btn = $('dark-toggle');
  const overlay = $('dark-overlay');
  if (!btn || !overlay) return;
  let level = 0;
  let waiting = false;

  btn.addEventListener('click', () => {
    if (waiting) return;
    playSfx('darkMode');
    if (document.body.classList.contains('blinding')) {
      document.body.classList.remove('blinding');
      level = 0;
    }
    level++;
    overlay.style.opacity = String(level * 0.2);
    btn.textContent = '🌙 Darker (' + level * 20 + '%)';
    if (level < 5) return;

    waiting = true;
    toast('Dark mode enabled ✅');
    setTimeout(() => {
      overlay.style.opacity = '0';
      document.body.classList.add('blinding');
      btn.textContent = '🌙 Dark mode';
      toast('Switched to light mode for your eyes ☀️');
      fail();
      level = 0;
      waiting = false;
    }, 3000);
  });
}

/* =========================================================
   12. saved.html — Error 418
   ========================================================= */
function initSavedPage() {
  const fill = $('save-fill');
  const pctEl = $('save-pct');
  const params = new URLSearchParams(location.search);
  const finalRage = Math.max(0, Math.min(100, parseInt(params.get('rage'), 10) || 0));
  let pct = 0;

  playSfx('saving');
  const tick = setInterval(() => {
    pct += pct < 60 ? 3 : pct < 90 ? 1.5 : 0.5;
    if (pct >= 99) {
      pct = 99;
      clearInterval(tick);
      setTimeout(showError, 1500);
    }
    fill.style.width = pct + '%';
    pctEl.textContent = Math.floor(pct) + '%';
  }, 100);

  function showError() {
    $('saving-card').classList.add('hidden');
    $('error-card').classList.remove('hidden');
    $('final-rage').textContent = finalRage + '%';
    playSfx('teapot');
  }

  $('ok-btn').addEventListener('click', () => { location.replace('index.html'); });
}

/* ---------- Boot ---------- */
(function boot() {
  const page = document.body.dataset.page;
  if (page === 'index') {
    [
      ['initRageMeter', initRageMeter],
      ['initCookieHydra', initCookieHydra],
      ['initNameKeyboard', initNameKeyboard],
      ['initEmailAutocorrect', initEmailAutocorrect],
      ['initPhoneSlider', initPhoneSlider],
      ['initDobButtons', initDobButtons],
      ['initPasswordGame', initPasswordGame],
      ['initRobotCheck', initRobotCheck],
      ['initInfiniteTerms', initInfiniteTerms],
      ['initDeleteAccount', initDeleteAccount],
      ['initRunawaySave', initRunawaySave],
      ['initDarkMode', initDarkMode],
    ].forEach(([name, fn]) => safe(name, fn));
  } else if (page === 'saved') {
    safe('initSavedPage', initSavedPage);
  }
})();
