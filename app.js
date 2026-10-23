/* Freeman Prints storefront — vanilla JavaScript, no build step. */
(() => {
  'use strict';

  // ===== Settings you should edit =====
  const CONFIG = {
    email: '',                                    // optional: business email; leave blank to send quotes via Treatstock
    treatstockUrl: 'https://www.treatstock.com/c/freemans-prints',
  };

  // ===== Data =====
  const COLORS = [
    { name: 'Midnight Black', hex: '#23272f' },
    { name: 'Arctic White', hex: '#f4f6f8' },
    { name: 'Royal Blue', hex: '#1d4ed8' },
    { name: 'Red Friday', hex: '#e31837' },
    { name: 'Fountain Teal', hex: '#00a6a6' },
    { name: 'Silk Gold', hex: '#d4a017' },
  ];

  // density g/cm³, scores 1–5
  const MATERIALS = [
    { id: 'pla', name: 'PLA / PLA-Silk', short: 'PLA', density: 1.24, desc: 'Easy, crisp and colorful. The go-to for display pieces, gifts, décor and early prototypes. Silk variants give a glossy, metallic sheen.', best: ['Décor', 'Gifts', 'Visual prototypes', 'Signs'], scores: { Strength: 3, Flexibility: 1, 'Heat resistance': 1, 'UV / outdoor': 1, Detail: 5 } },
    { id: 'petg', name: 'PET / PETG', short: 'PETG', density: 1.27, desc: 'Tough, slightly flexible and food-container friendly in its raw form. A great all-rounder for functional parts that see daily use.', best: ['Brackets', 'Enclosures', 'Organizers', 'Shop parts'], scores: { Strength: 3, Flexibility: 2, 'Heat resistance': 3, 'UV / outdoor': 3, Detail: 4 } },
    { id: 'pctg', name: 'PCTG', short: 'PCTG', density: 1.23, desc: 'A tougher, more impact-resistant cousin of PETG with excellent layer bonding and a clean finish.', best: ['Impact parts', 'Clips', 'Clear-ish parts'], scores: { Strength: 4, Flexibility: 3, 'Heat resistance': 3, 'UV / outdoor': 3, Detail: 4 } },
    { id: 'tpu', name: 'TPU (Flexible)', short: 'TPU', density: 1.21, desc: 'Rubber-like and bouncy. Ideal for gaskets, bumpers, grips, phone cases and anything that needs to flex and recover.', best: ['Gaskets', 'Bumpers', 'Grips', 'Drone guards'], scores: { Strength: 2, Flexibility: 5, 'Heat resistance': 2, 'UV / outdoor': 3, Detail: 3 } },
    { id: 'asa', name: 'ASA (UV stable)', short: 'ASA', density: 1.07, desc: 'Built for the outdoors and KC summers. Resists UV fading and heat, so it is great for automotive and exterior parts.', best: ['Car parts', 'Outdoor mounts', 'Garden', 'Signage'], scores: { Strength: 3, Flexibility: 2, 'Heat resistance': 4, 'UV / outdoor': 5, Detail: 4 } },
    { id: 'pa', name: 'PA (Nylon)', short: 'Nylon', density: 1.14, desc: 'Slippery, wear-resistant and tough. A classic engineering plastic for gears, bushings, hinges and moving parts.', best: ['Gears', 'Hinges', 'Bushings', 'Wear parts'], scores: { Strength: 4, Flexibility: 3, 'Heat resistance': 4, 'UV / outdoor': 3, Detail: 3 } },
    { id: 'pacf', name: 'PA6/12-CF/GF', short: 'CF / GF', density: 1.2, desc: 'Nylon reinforced with carbon or glass fiber. Stiff, strong and heat-tolerant for the most demanding functional parts.', best: ['Jigs & fixtures', 'Drone frames', 'Under-hood', 'Tooling'], scores: { Strength: 5, Flexibility: 1, 'Heat resistance': 5, 'UV / outdoor': 4, Detail: 3 } },
  ];

  const CATS = [
    { id: 'all', name: 'All' },
    { id: 'parts', name: 'Functional parts' },
    { id: 'proto', name: 'Prototypes' },
    { id: 'home', name: 'Home & desk' },
    { id: 'hobby', name: 'Gaming & hobby' },
    { id: 'auto', name: 'Automotive' },
    { id: 'gifts', name: 'Gifts & signs' },
  ];

  const PRODUCTS = [
    { id: 'gears', name: 'Custom Gears & Mechanical Parts', cat: 'parts', icon: 'gear', mats: ['pa', 'pacf', 'petg'], strength: 5, desc: 'Gears, pulleys, spacers and couplers sized to your spec. Nylon and carbon-fiber nylon for real loads.' },
    { id: 'brackets', name: 'Brackets & Mounts', cat: 'parts', icon: 'bracket', mats: ['petg', 'asa', 'pacf'], strength: 4, desc: 'Shelf brackets, camera mounts, tool holders and wall mounts that fit the first time.' },
    { id: 'proto', name: 'Rapid Prototypes', cat: 'proto', icon: 'proto', mats: ['pla', 'petg', 'pctg'], strength: 3, desc: 'Test form, fit and function before you commit to tooling. Iterate fast with a local shop.' },
    { id: 'enclosures', name: 'Electronics Enclosures', cat: 'proto', icon: 'box', mats: ['petg', 'asa', 'pctg'], strength: 4, desc: 'Project boxes for Arduino, Raspberry Pi and custom PCBs with vents, standoffs and cutouts.' },
    { id: 'replacement', name: 'Replacement Parts', cat: 'parts', icon: 'knob', mats: ['petg', 'pa', 'asa'], strength: 4, desc: 'Broken knob, clip or latch that is discontinued? Bring it in and we will measure and reprint it.' },
    { id: 'stands', name: 'Phone & Tablet Stands', cat: 'home', icon: 'stand', mats: ['pla', 'petg'], strength: 2, desc: 'Desk stands, docks and holders, sized for your device and case.' },
    { id: 'vases', name: 'Planters & Vases', cat: 'home', icon: 'vase', mats: ['pla', 'petg'], strength: 2, desc: 'Spiral-mode vases and planters with gorgeous layer texture. Silk PLA looks amazing here.' },
    { id: 'organizers', name: 'Cable & Desk Organizers', cat: 'home', icon: 'clip', mats: ['petg', 'tpu', 'pla'], strength: 2, desc: 'Cable clips, drawer dividers, Gridfinity bins and tidy-up hardware for your setup.' },
    { id: 'minis', name: 'Tabletop Minis & Terrain', cat: 'hobby', icon: 'd20', mats: ['pla', 'petg'], strength: 1, desc: 'Terrain, dice towers, token trays and custom bits for game night.' },
    { id: 'drone', name: 'Drone & RC Parts', cat: 'hobby', icon: 'drone', mats: ['pacf', 'tpu', 'petg'], strength: 5, desc: 'Arms, mounts, prop guards and bumpers that are light, stiff, and crash-friendly in TPU.' },
    { id: 'auto', name: 'Automotive Clips & Trim', cat: 'auto', icon: 'carclip', mats: ['asa', 'pa', 'pacf'], strength: 4, desc: 'Interior clips, trim pieces, gauge pods and mounts that hold up to a hot KC summer.' },
    { id: 'signs', name: 'Custom Signs & Name Plates', cat: 'gifts', icon: 'sign', mats: ['pla', 'asa'], strength: 1, desc: 'Business signs, desk name plates, KC-proud décor and personalized gifts.' },
  ];

  const AREAS = [
    { name: 'Downtown KC', x: 215, y: 200 }, { name: 'North KC', x: 222, y: 150 }, { name: 'Gladstone', x: 250, y: 120 },
    { name: 'Liberty', x: 300, y: 90 }, { name: 'Parkville', x: 150, y: 118 }, { name: 'Kansas City, KS', x: 140, y: 190, end: true },
    { name: 'Shawnee', x: 92, y: 220 }, { name: 'Lenexa', x: 92, y: 262 }, { name: 'Overland Park', x: 140, y: 300, end: true },
    { name: 'Olathe', x: 82, y: 336 }, { name: 'Leawood', x: 205, y: 290 }, { name: 'Grandview', x: 250, y: 330 },
    { name: 'Raytown', x: 282, y: 238 }, { name: 'Independence', x: 312, y: 186 }, { name: 'Blue Springs', x: 372, y: 228, end: true, dy: -14 },
    { name: "Lee's Summit", x: 335, y: 312, end: true, dy: -12 },
  ];

  const FAQ = [
    ['What files can I send?', 'STL and 3MF are ideal; OBJ and STEP work too. No file? Send photos, a sketch and measurements and ask about modeling help.'],
    ['Do you offer local pickup in Kansas City?', 'Yes. Freeman Prints is based in the Kansas City area, and pickup or meetup in the KC metro is arranged when your order is ready. Prefer shipping? Order through our Treatstock shop.'],
    ['How is my price calculated?', 'Mostly by material used and print time, plus quantity. Our Treatstock shop gives you an exact price when you upload your file. The estimator on this page shows roughly how much material and time a part needs.'],
    ['Which material should I pick?', 'Check the Materials section above. Short version: PLA for looks, PETG/PCTG for everyday function, ASA for outdoors and cars, TPU for flex, Nylon and CF/GF for strength and heat.'],
    ['Can you print in multiple colors?', 'We have a range of colors in stock. Pick a color on any product card, or mention what you need in the notes and we will confirm availability.'],
    ['Do you do small production runs?', 'Yes. From a single one-off to small batches. Ask about pricing for larger quantities.'],
  ];

  // ===== Helpers =====
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let uid = 0;

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const f = (c) => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
    const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  const tint = (hex) => (hex.toLowerCase() === '#f4f6f8' ? '#dfe4ec' : shade(hex, 0.86));

  function gearPath(cx, cy, ro, rr, teeth, hub = 0.3, holes = true) {
    const step = (Math.PI * 2) / teeth, pts = [];
    for (let i = 0; i < teeth; i++) {
      const a = i * step - Math.PI / 2;
      [[rr, a - step * 0.5], [rr, a - step * 0.27], [ro, a - step * 0.16], [ro, a + step * 0.16], [rr, a + step * 0.27]]
        .forEach(([r, t]) => pts.push(`${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`));
    }
    const circ = (x, y, r) => ` M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0 Z`;
    let d = 'M' + pts.join(' L') + ' Z' + circ(cx, cy, ro * hub);
    if (holes) for (let i = 0; i < 6; i++) { const t = i * Math.PI / 3 + Math.PI / 6; d += circ(cx + rr * 0.66 * Math.cos(t), cy + rr * 0.66 * Math.sin(t), rr * 0.15); }
    return d;
  }

  // Product illustrations — recolored live by the swatch picker. viewBox 0 0 200 160.
  const ICONS = {
    gear: (c) => `<path d="${gearPath(100, 80, 64, 54, 12)}" fill="${c}" fill-rule="evenodd"/><circle cx="100" cy="80" r="11" fill="${shade(c, -.35)}"/>`,
    bracket: (c) => `<path d="M50 130 V40 L80 25 V100 L160 60 V90 L80 130 Z" fill="${c}"/><path d="M50 40 L80 25 L110 40 L80 55Z" fill="${shade(c, .25)}"/><path d="M80 55 L110 40 V115 L80 130Z" fill="${shade(c, -.25)}"/><circle cx="135" cy="85" r="7" fill="${shade(c, -.45)}"/><circle cx="95" cy="110" r="6" fill="${shade(c, -.45)}"/>`,
    proto: (c) => `<g><path d="M40 100 L100 70 L160 100 L100 130Z" fill="${shade(c, .25)}"/><path d="M40 100 V115 L100 145 V130Z" fill="${c}"/><path d="M100 130 V145 L160 115 V100Z" fill="${shade(c, -.25)}"/><path d="M75 82 L100 70 L125 82 V55 L100 43 L75 55Z" fill="${c}"/><path d="M75 55 L100 43 L125 55 L100 67Z" fill="${shade(c, .3)}"/><path d="M100 67 L125 55 V82 L100 94Z" fill="${shade(c, -.2)}"/></g><path d="M30 60 H62 M30 54 V66 M62 54 V66" stroke="#0066ff" stroke-width="2.5" fill="none"/><text x="34" y="48" font-size="11" font-weight="700" fill="#0066ff">40.0</text>`,
    box: (c) => `<path d="M35 70 L100 40 L165 70 L100 100Z" fill="${shade(c, .25)}"/><path d="M35 70 V115 L100 145 V100Z" fill="${c}"/><path d="M100 100 V145 L165 115 V70Z" fill="${shade(c, -.25)}"/>${[0, 1, 2, 3].map((i) => `<path d="M${112 + i * 11} ${98 - i * 5} v22" stroke="${shade(c, -.5)}" stroke-width="4" stroke-linecap="round"/>`).join('')}<circle cx="60" cy="100" r="5" fill="#00f2ff"/>`,
    knob: (c) => `<ellipse cx="100" cy="118" rx="52" ry="18" fill="${shade(c, -.3)}"/><rect x="48" y="62" width="104" height="56" fill="${c}"/>${[...Array(9)].map((_, i) => `<rect x="${54 + i * 11}" y="64" width="5" height="54" fill="${shade(c, -.15)}"/>`).join('')}<ellipse cx="100" cy="62" rx="52" ry="18" fill="${shade(c, .2)}"/><path d="M92 54 h16 v14 h-16z" fill="${shade(c, -.45)}"/><path d="M100 46 v6" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
    stand: (c) => `<path d="M40 130 L160 130 L150 140 L50 140Z" fill="${shade(c, -.3)}"/><path d="M45 130 L120 40 L132 46 L70 130Z" fill="${c}"/><path d="M40 130 L160 130 L150 120 L50 120Z" fill="${shade(c, .2)}"/><rect x="98" y="22" width="40" height="78" rx="7" transform="rotate(38 118 61)" fill="#1b1f27"/><rect x="102" y="28" width="32" height="64" rx="4" transform="rotate(38 118 61)" fill="#5ab8ff"/>`,
    vase: (c) => `<path d="M72 20 H128 C124 45 150 60 150 95 C150 125 130 145 100 145 C70 145 50 125 50 95 C50 60 76 45 72 20Z" fill="${c}"/>${[...Array(18)].map((_, i) => `<path d="M40 ${28 + i * 6.6} H160" stroke="${shade(c, -.18)}" stroke-width="1.6"/>`).join('')}<path d="M72 20 H128 C124 45 150 60 150 95 C150 125 130 145 100 145 C70 145 50 125 50 95 C50 60 76 45 72 20Z" fill="none" stroke="${shade(c, -.3)}" stroke-width="2"/><ellipse cx="100" cy="20" rx="28" ry="5" fill="${shade(c, -.4)}"/>`,
    clip: (c) => `<rect x="30" y="55" width="140" height="60" rx="18" fill="${c}"/>${[0, 1, 2, 3].map((i) => `<circle cx="${55 + i * 30}" cy="70" r="10" fill="${shade(c, -.4)}"/><path d="M${55 + i * 30} 70 V20" stroke="${['#ff8a1f', '#0066ff', '#00c2dd', '#e31837'][i]}" stroke-width="9" stroke-linecap="round"/>`).join('')}<rect x="30" y="100" width="140" height="15" rx="7" fill="${shade(c, -.2)}"/>`,
    d20: (c) => `<path d="M100 18 L156 50 V112 L100 144 L44 112 V50Z" fill="${c}"/><path d="M100 18 L156 50 L130 100 H70 L44 50Z" fill="${shade(c, .2)}"/><path d="M70 100 L100 144 L130 100Z" fill="${shade(c, -.2)}"/><path d="M44 50 L70 100 L44 112Z M156 50 L130 100 L156 112Z" fill="${shade(c, -.32)}"/><path d="M70 100 L100 48 L130 100Z" fill="${shade(c, .35)}"/><text x="100" y="88" text-anchor="middle" font-size="22" font-weight="800" fill="${shade(c, -.55)}">20</text>`,
    drone: (c) => `<path d="M55 40 L145 120 M145 40 L55 120" stroke="${c}" stroke-width="14" stroke-linecap="round"/>${[[55, 40], [145, 40], [55, 120], [145, 120]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="30" ry="9" fill="${shade(c, .35)}" opacity=".8"/><circle cx="${x}" cy="${y}" r="9" fill="${shade(c, -.4)}"/>`).join('')}<rect x="80" y="66" width="40" height="28" rx="8" fill="${shade(c, -.25)}"/><circle cx="100" cy="80" r="6" fill="#00f2ff"/>`,
    carclip: (c) => `<path d="M100 20 C135 20 150 38 150 50 H50 C50 38 65 20 100 20Z" fill="${shade(c, .2)}"/><rect x="45" y="48" width="110" height="12" rx="6" fill="${c}"/><path d="M86 60 H114 L118 88 L108 96 L116 110 L104 140 H96 L84 110 L92 96 L82 88Z" fill="${c}"/><path d="M100 60 V138" stroke="${shade(c, -.35)}" stroke-width="3"/>`,
    sign: (c) => `<rect x="20" y="40" width="160" height="80" rx="16" fill="${c}"/><rect x="28" y="48" width="144" height="64" rx="10" fill="none" stroke="${shade(c, -.3)}" stroke-width="3"/><text x="100" y="96" text-anchor="middle" font-size="40" font-weight="800" letter-spacing="2" fill="${c.toLowerCase() === '#f4f6f8' ? '#1d4ed8' : '#ffffff'}">KC ♥</text><rect x="30" y="120" width="10" height="20" fill="${shade(c, -.3)}"/><rect x="160" y="120" width="10" height="20" fill="${shade(c, -.3)}"/>`,
  };
  const iconSvg = (icon, hex) => `<svg viewBox="0 0 200 160" aria-hidden="true">${ICONS[icon](hex)}</svg>`;

  // ===== Toast =====
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  // ===== Nav =====
  const nav = $('#nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive: true });
  $('#menuBtn').addEventListener('click', () => {
    const open = $('#navLinks').classList.toggle('open');
    $('#menuBtn').setAttribute('aria-expanded', open);
  });
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => $('#navLinks').classList.remove('open')));
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $$('#navLinks a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => navObs.observe(s));

  // ===== External links =====
  $$('[data-treatstock]').forEach((a) => (a.href = CONFIG.treatstockUrl));
  $$('[data-email]').forEach((a) => {
    if (CONFIG.email) a.href = 'mailto:' + CONFIG.email;
    else a.remove();
  });
  if (!CONFIG.email) $('#sendQuote').textContent = 'Copy quote & message us on Treatstock';

  // ===== Hero carousel =====
  const slides = $$('.slide');
  const SLIDE_MS = 6500;
  let current = 0, timer;
  document.documentElement.style.setProperty('--slide-ms', SLIDE_MS + 'ms');
  const dotsEl = $('#dots');
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = 'dot';
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    b.innerHTML = '<i></i>';
    b.addEventListener('click', () => go(i));
    dotsEl.appendChild(b);
  });
  function go(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === current));
    $$('.dot').forEach((d, k) => {
      d.classList.remove('on');
      d.classList.toggle('done', k < current);
      if (k === current) { void d.offsetWidth; d.classList.add('on'); }
    });
    restart();
  }
  function restart() {
    clearTimeout(timer);
    if (!$('#slides').classList.contains('paused')) timer = setTimeout(() => go(current + 1), SLIDE_MS);
  }
  $('#prevSlide').addEventListener('click', () => go(current - 1));
  $('#nextSlide').addEventListener('click', () => go(current + 1));
  const slidesEl = $('#slides');
  slidesEl.addEventListener('mouseenter', () => { slidesEl.classList.add('paused'); clearTimeout(timer); });
  slidesEl.addEventListener('mouseleave', () => { slidesEl.classList.remove('paused'); go(current); });
  let touchX = null;
  slidesEl.addEventListener('touchstart', (e) => (touchX = e.touches[0].clientX), { passive: true });
  slidesEl.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });
  go(0);

  // ===== Hero printer animation =====
  (function printer() {
    const svg = $('#printer');
    const gx = 260, gy = 245, R = 150, plate = gy + R + 12;
    const gear = gearPath(gx, gy, R, R - 22, 14, 0.27);
    const P = 8, L = 5.5;
    svg.innerHTML = `
      <defs>
        <pattern id="pl" width="520" height="${P}" patternUnits="userSpaceOnUse"><rect width="520" height="${L}" fill="#fff"/></pattern>
        <linearGradient id="pf" x1="0" y1="${gy - R}" x2="0" y2="${gy + R}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7ff9ff"/><stop offset=".45" stop-color="#00f2ff"/><stop offset="1" stop-color="#0066ff"/></linearGradient>
        <radialGradient id="tipg"><stop offset="0" stop-color="#fff3d6"/><stop offset=".35" stop-color="#ff8a1f"/><stop offset="1" stop-color="#ff8a1f" stop-opacity="0"/></radialGradient>
        <linearGradient id="nz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00f2ff"/><stop offset="1" stop-color="#0066ff"/></linearGradient>
        <clipPath id="gc"><path d="${gear}" clip-rule="evenodd"/></clipPath>
        <clipPath id="done"><rect id="doneRect" x="0" width="520" y="${plate}" height="0"/></clipPath>
        <mask id="lm"><rect width="520" height="440" fill="url(#pl)"/></mask>
        <filter id="blur"><feGaussianBlur stdDeviation="5"/></filter>
      </defs>
      <circle cx="${gx}" cy="${gy}" r="185" fill="#00f2ff" opacity=".07"/>
      <path d="${gear}" fill="#00f2ff" fill-opacity=".05" fill-rule="evenodd" stroke="#00f2ff" stroke-opacity=".35" stroke-dasharray="6 6"/>
      <g clip-path="url(#done)"><path d="${gear}" fill="url(#pf)" fill-rule="evenodd" mask="url(#lm)"/></g>
      <g clip-path="url(#gc)"><rect id="cur" y="0" height="${L}" x="0" width="0" fill="#d9fdff"/></g>
      <rect x="${gx - 220}" y="${plate}" width="440" height="3" rx="1.5" fill="#00f2ff" opacity=".6"/>
      <rect x="${gx - 240}" y="26" width="480" height="5" rx="2.5" fill="#2a3a55"/>
      <g id="head">
        <rect x="-34" y="-8" width="68" height="22" rx="5" fill="#1d2a40" stroke="#00f2ff" stroke-opacity=".5"/>
        <rect id="feed" x="-5" y="14" width="10" height="100" fill="#2f4566"/>
        <g id="hotend">
          <rect x="-24" y="-44" width="48" height="26" rx="5" fill="url(#nz)"/>
          <polygon points="-12,-18 12,-18 5,-4 -5,-4" fill="#cfd8e3"/>
          <circle cx="0" cy="0" r="16" fill="url(#tipg)"/>
        </g>
      </g>`;
    const doneRect = $('#doneRect', svg), cur = $('#cur', svg), head = $('#head', svg), hot = $('#hotend', svg), feed = $('#feed', svg);
    const top = gy - R, bottom = gy + R, layers = Math.ceil((bottom - top) / P), LAYER_MS = 240;
    const left = gx - R - 6, right = gx + R + 6;
    const draw = (layer, frac) => {
      const y = bottom - (layer + 1) * P;
      const dir = layer % 2 === 0 ? 1 : -1;
      const nx = dir > 0 ? left + (right - left) * frac : right - (right - left) * frac;
      doneRect.setAttribute('y', y + P - 0.01);
      doneRect.setAttribute('height', plate - (y + P));
      cur.setAttribute('y', y + (P - L));
      cur.setAttribute('x', dir > 0 ? left : nx);
      cur.setAttribute('width', dir > 0 ? nx - left : right - nx);
      head.setAttribute('transform', `translate(${nx},26)`);
      hot.setAttribute('transform', `translate(0,${y + P - 26 - 2})`);
      feed.setAttribute('height', Math.max(0, y + P - 26 - 2 - 44 - 14));
    };
    if (reduceMotion) { draw(Math.floor(layers * 0.62), 0.6); return; }
    let start = performance.now();
    const loop = (now) => {
      let t = now - start;
      const total = layers * LAYER_MS;
      if (t > total + 1400) { start = now; t = 0; }
      const tt = Math.min(t, total - 1);
      draw(Math.floor(tt / LAYER_MS), (tt % LAYER_MS) / LAYER_MS);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  })();

  // ===== Count-up =====
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, to = +el.dataset.to, t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / 1000);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  });
  $$('.count').forEach((el) => countObs.observe(el));

  // ===== Shop =====
  let activeCat = 'all', sortBy = 'featured';
  const cardColor = {};
  const matName = (id) => MATERIALS.find((m) => m.id === id).short;

  $('#chips').innerHTML = CATS.map((c) => `<button class="chip${c.id === 'all' ? ' on' : ''}" role="tab" data-cat="${c.id}">${c.name}</button>`).join('');
  $('#chips').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    activeCat = b.dataset.cat;
    $$('.chip').forEach((c) => c.classList.toggle('on', c === b));
    renderGrid();
  });
  $('#sortSel').addEventListener('change', (e) => { sortBy = e.target.value; renderGrid(); });

  function renderGrid() {
    let list = PRODUCTS.filter((p) => activeCat === 'all' || p.cat === activeCat);
    if (sortBy === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'strength') list = [...list].sort((a, b) => b.strength - a.strength);
    $('#grid').innerHTML = list.map((p, i) => {
      const col = cardColor[p.id] ?? 2;
      return `<article class="card" style="animation-delay:${i * 50}ms" data-id="${p.id}">
        <div class="card-art" data-open style="background:${tint(COLORS[col].hex)}">${iconSvg(p.icon, COLORS[col].hex)}</div>
        <span class="card-tag">${CATS.find((c) => c.id === p.cat).name}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="card-mats">Best in: ${p.mats.map(matName).join(' · ')}</div>
        <div class="card-foot">
          <div class="swatches">${COLORS.map((c, k) => `<button class="sw${k === col ? ' on' : ''}" style="background:${c.hex}" data-sw="${k}" title="${c.name}" aria-label="${c.name}"></button>`).join('')}</div>
          <button class="add" data-open>Customize</button>
        </div>
      </article>`;
    }).join('');
  }
  $('#grid').addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const p = PRODUCTS.find((x) => x.id === card.dataset.id);
    const sw = e.target.closest('[data-sw]');
    if (sw) {
      const k = +sw.dataset.sw;
      cardColor[p.id] = k;
      $$('.sw', card).forEach((s) => s.classList.toggle('on', s === sw));
      const art = $('.card-art', card);
      art.style.background = tint(COLORS[k].hex);
      art.innerHTML = iconSvg(p.icon, COLORS[k].hex);
      return;
    }
    if (e.target.closest('[data-open]')) openQuickView(p);
  });
  renderGrid();

  // ===== Quick view =====
  const modal = $('#modal');
  let qv = null;
  function openQuickView(p) {
    qv = { p, color: cardColor[p.id] ?? 2, mat: p.mats[0], qty: 1 };
    $('#qvCat').textContent = CATS.find((c) => c.id === p.cat).name;
    $('#qvTitle').textContent = p.name;
    $('#qvDesc').textContent = p.desc;
    $('#qvNotes').value = '';
    $('#qvQty').value = 1;
    $('#qvSwatches').innerHTML = COLORS.map((c, k) => `<button class="sw" style="background:${c.hex}" data-k="${k}" title="${c.name}" aria-label="${c.name}"></button>`).join('');
    $('#qvMats').innerHTML = p.mats.map((m) => `<button type="button" data-m="${m}">${matName(m)}</button>`).join('');
    paintQv();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => $('.modal-x', modal).focus(), 50);
  }
  function paintQv() {
    const c = COLORS[qv.color];
    $('#qvArt').style.background = tint(c.hex);
    $('#qvArt').innerHTML = iconSvg(qv.p.icon, c.hex);
    $('#qvColorName').textContent = c.name;
    $$('#qvSwatches .sw').forEach((s) => s.classList.toggle('on', +s.dataset.k === qv.color));
    $$('#qvMats button').forEach((b) => b.classList.toggle('on', b.dataset.m === qv.mat));
  }
  $('#qvSwatches').addEventListener('click', (e) => { const s = e.target.closest('[data-k]'); if (s) { qv.color = +s.dataset.k; paintQv(); } });
  $('#qvMats').addEventListener('click', (e) => { const b = e.target.closest('[data-m]'); if (b) { qv.mat = b.dataset.m; paintQv(); } });
  function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
  $$('[data-close]', modal).forEach((el) => el.addEventListener('click', closeModal));
  $('#qvAdd').addEventListener('click', () => {
    addToQuote({
      name: qv.p.name, icon: qv.p.icon, color: COLORS[qv.color].name, hex: COLORS[qv.color].hex,
      material: matName(qv.mat), qty: clampQty($('#qvQty').value), notes: $('#qvNotes').value.trim(),
    });
    closeModal();
  });

  // Steppers
  const clampQty = (v) => Math.max(1, Math.min(500, parseInt(v, 10) || 1));
  $$('.stepper').forEach((st) => {
    const input = $('input', st);
    st.addEventListener('click', (e) => {
      const b = e.target.closest('[data-step]');
      if (!b) return;
      input.value = clampQty(+input.value + +b.dataset.step);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    input.addEventListener('change', () => (input.value = clampQty(input.value)));
  });

  // ===== Quote list (persisted) =====
  const KEY = 'fp-quote';
  let quote = [];
  try { quote = JSON.parse(localStorage.getItem(KEY)) || []; } catch { quote = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(quote)); } catch { /* private mode */ } };

  function addToQuote(item) {
    quote.push({ ...item, key: Date.now() + '-' + uid++ });
    save();
    renderQuote(true);
    toast(`Added ${item.qty} × ${item.name}`);
  }
  function renderQuote(bump = false) {
    const n = quote.reduce((s, q) => s + q.qty, 0);
    const badge = $('#cartCount');
    badge.textContent = n;
    badge.classList.toggle('show', n > 0);
    if (bump) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
    $('#drawerBody').innerHTML = quote.length
      ? quote.map((q) => `<div class="line-item">
          <div class="thumb" style="background:${tint(q.hex || '#1d4ed8')}">${iconSvg(q.icon || 'proto', q.hex || '#1d4ed8')}</div>
          <div><h4>${q.qty} × ${escapeHtml(q.name)}</h4><small>${q.material}${q.color ? ' · ' + q.color : ''}</small>${q.notes ? `<small>${escapeHtml(q.notes)}</small>` : ''}</div>
          <button class="remove" data-key="${q.key}">Remove</button>
        </div>`).join('')
      : '<p class="empty">Your quote list is empty.<br>Customize a product or use the instant estimator.</p>';
  }
  const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  $('#drawerBody').addEventListener('click', (e) => {
    const r = e.target.closest('.remove');
    if (!r) return;
    quote = quote.filter((q) => q.key !== r.dataset.key);
    save();
    renderQuote();
  });

  const drawer = $('#drawer'), scrim = $('#scrim');
  const openDrawer = () => { drawer.classList.add('open'); scrim.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); };
  const closeDrawer = () => { drawer.classList.remove('open'); scrim.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); };
  $('#cartBtn').addEventListener('click', openDrawer);
  $$('[data-close-drawer]').forEach((el) => el.addEventListener('click', closeDrawer));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeDrawer(); } });

  $('#qArea').innerHTML = '<option value="">Choose your area</option>' + AREAS.map((a) => `<option>${a.name}</option>`).join('') + '<option>Other / ship it</option>';

  $('#sendQuote').addEventListener('click', async () => {
    if (!quote.length) { toast('Add something to your quote list first'); return; }
    const lines = quote.map((q, i) => `${i + 1}. ${q.qty} x ${q.name} | ${q.material}${q.color ? ' | ' + q.color : ''}${q.notes ? '\n   Notes: ' + q.notes : ''}`);
    const body = `Hi Freeman Prints,\n\nI'd like a quote for:\n${lines.join('\n')}\n\nName: ${$('#qName').value || '-'}\nPickup area: ${$('#qArea').value || '-'}\n\nThanks!`;
    if (CONFIG.email) {
      location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Quote request – Freeman Prints')}&body=${encodeURIComponent(body)}`;
    } else {
      try { await navigator.clipboard.writeText(body); toast('Quote copied. Paste it into your Treatstock message.'); }
      catch { toast('Message us on Treatstock with your quote list'); }
      window.open(CONFIG.treatstockUrl, '_blank', 'noopener');
    }
  });
  renderQuote();

  // ===== Estimator =====
  const est = { finish: 'standard' };
  $('#estMat').innerHTML = MATERIALS.map((m) => `<option value="${m.id}">${m.name}</option>`).join('');
  $$('input[type=range]').forEach((r) => {
    const paint = () => r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min)) * 100 + '%');
    r.addEventListener('input', paint);
    paint();
  });
  $('#estFinish').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    est.finish = b.dataset.v;
    $$('#estFinish button').forEach((x) => x.classList.toggle('on', x === b));
    updateEstimate();
  });
  ['#estMat', '#estSize', '#estInfill', '#estQty'].forEach((s) => $(s).addEventListener('input', updateEstimate));

  const shown = { grams: 0 };
  function animateNum(el, key, to, fmt) {
    const from = shown[key], t0 = performance.now();
    shown[key] = to;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 450);
      el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function estimate() {
    const m = MATERIALS.find((x) => x.id === $('#estMat').value);
    const size = +$('#estSize').value, infill = +$('#estInfill').value / 100, qty = clampQty($('#estQty').value);
    const volume = Math.pow(size, 3) * 0.12;               // part occupies ~12% of its bounding cube
    const grams = volume * m.density * (0.35 + 0.65 * infill);
    const speed = { standard: 1, fine: 1.6, draft: 0.7 }[est.finish];
    const hours = (grams / 12) * speed + 0.25;
    return { m, size, infill, qty, grams, hours };
  }
  function updateEstimate() {
    const r = estimate();
    $('#sizeOut').textContent = r.size + ' cm';
    $('#infillOut').textContent = Math.round(r.infill * 100) + '%';
    animateNum($('#estGrams'), 'grams', r.grams, (n) => '≈ ' + Math.round(n).toLocaleString() + ' g');
    const time = (h) => (h < 1 ? Math.round(h * 60) + ' min' : h.toFixed(1) + ' h');
    $('#estMeta').textContent = `~${time(r.hours)} print time each in ${r.m.short}` + (r.qty > 1 ? ` · ${r.qty} parts ≈ ${Math.round(r.grams * r.qty).toLocaleString()} g total` : '');
    drawCube(r);
  }
  function drawCube(r) {
    const s = 30 + r.size * 2.2, cx = 100, cy = 112;
    const c = { pla: '#1d4ed8', petg: '#00a6a6', pctg: '#5ab8ff', tpu: '#ff8a1f', asa: '#e31837', pa: '#e8e2d0', pacf: '#3a3f4a' }[r.m.id];
    const dx = s * 0.866, dy = s * 0.5;
    const topF = `${cx},${cy - s} ${cx + dx},${cy - s + dy} ${cx},${cy - s + 2 * dy} ${cx - dx},${cy - s + dy}`;
    const lines = Math.round(2 + r.infill * 10);
    let grid = '';
    for (let i = 1; i < lines; i++) {
      const t = i / lines;
      grid += `<line x1="${cx - dx + dx * t}" y1="${cy - s + dy - dy * t}" x2="${cx + dx * t}" y2="${cy - s + 2 * dy - dy * t}"/>`;
      grid += `<line x1="${cx - dx + dx * t}" y1="${cy - s + dy + dy * t}" x2="${cx + dx * t}" y2="${cy - s + dy * t}"/>`;
    }
    $('#estCube').innerHTML = `
      <polygon points="${cx - dx},${cy - s + dy} ${cx},${cy - s + 2 * dy} ${cx},${cy + 2 * dy} ${cx - dx},${cy + dy}" fill="${shade(c, -.1)}"/>
      <polygon points="${cx + dx},${cy - s + dy} ${cx},${cy - s + 2 * dy} ${cx},${cy + 2 * dy} ${cx + dx},${cy + dy}" fill="${shade(c, -.35)}"/>
      <polygon points="${topF}" fill="${shade(c, .15)}"/>
      <g stroke="${shade(c, -.45)}" stroke-width="1.2" opacity=".55">${grid}</g>
      <polygon points="${topF}" fill="none" stroke="#fff" stroke-opacity=".5"/>`;
  }
  $('#estAdd').addEventListener('click', () => {
    const r = estimate();
    addToQuote({
      name: 'Custom part', icon: 'proto', hex: '#1d4ed8', material: r.m.short, qty: r.qty, color: '',
      notes: `~${r.size} cm, ${Math.round(r.infill * 100)}% infill, ${est.finish} finish (≈ ${Math.round(r.grams)} g each)`,
    });
  });
  updateEstimate();

  // ===== Materials =====
  let activeMat = 'petg';
  $('#matTabs').innerHTML = MATERIALS.map((m) => `<button class="mat-tab" role="tab" data-m="${m.id}">${m.short}</button>`).join('');
  $('#matTabs').addEventListener('click', (e) => { const b = e.target.closest('[data-m]'); if (b) { activeMat = b.dataset.m; renderMat(); } });
  function renderMat() {
    const m = MATERIALS.find((x) => x.id === activeMat);
    $$('.mat-tab').forEach((t) => t.classList.toggle('on', t.dataset.m === activeMat));
    $('#matPanel').innerHTML = `
      <div><h3>${m.name}</h3><p>${m.desc}</p><div class="mat-best">${m.best.map((b) => `<span>${b}</span>`).join('')}</div></div>
      <div class="bars">${Object.entries(m.scores).map(([k, v]) => `<div class="bar-row">${k}<div class="bar"><i data-w="${v * 20}"></i></div></div>`).join('')}</div>`;
    requestAnimationFrame(() => requestAnimationFrame(() => $$('#matPanel .bar i').forEach((i) => (i.style.width = i.dataset.w + '%'))));
  }
  renderMat();

  // ===== Kansas City map =====
  (function kcMap() {
    const svg = $('#kcMap');
    svg.innerHTML = `
      <rect x="0" y="0" width="420" height="420" rx="20" fill="#f7f9fc"/>
      <g stroke="#e3e8ef" stroke-width="1">${[...Array(13)].map((_, i) => `<path d="M${i * 35} 0 V420 M0 ${i * 35} H420"/>`).join('')}</g>
      <path d="M180 196 V420" stroke="#b9c3d3" stroke-width="2" stroke-dasharray="6 6"/>
      <text x="168" y="404" text-anchor="end" font-size="11" font-weight="700" fill="#9aa6b8" letter-spacing="2">KANSAS</text>
      <text x="192" y="404" font-size="11" font-weight="700" fill="#9aa6b8" letter-spacing="2">MISSOURI</text>
      <path d="M-10 70 C70 95 120 150 170 172 C205 188 240 172 285 165 C335 158 380 148 430 138" fill="none" stroke="#9cd7ff" stroke-width="14" stroke-linecap="round"/>
      <path d="M-10 70 C70 95 120 150 170 172 C205 188 240 172 285 165 C335 158 380 148 430 138" fill="none" stroke="#c9ebff" stroke-width="6"/>
      <text x="300" y="148" font-size="10" font-weight="600" fill="#5aa6dd" transform="rotate(-6 300 148)">Missouri River</text>
      <circle class="ripple" cx="210" cy="215" r="200"/><circle class="ripple" cx="210" cy="215" r="200"/><circle class="ripple" cx="210" cy="215" r="200"/>
      ${AREAS.map((a, i) => `<circle class="map-dot" data-i="${i}" cx="${a.x}" cy="${a.y}" r="6" fill="#0066ff" stroke="#fff" stroke-width="2"><title>${a.name}</title></circle>
        <text class="map-label" data-i="${i}" x="${a.end ? a.x - 10 : a.x + 10}" y="${a.y + 4 + (a.dy || 0)}"${a.end ? ' text-anchor="end"' : ''}>${a.name}</text>`).join('')}
      <g transform="translate(20 20)"><rect width="156" height="30" rx="15" fill="#0b1830"/><circle cx="16" cy="15" r="5" fill="#ff8a1f"/><text x="28" y="19.5" font-size="11.5" font-weight="700" fill="#fff">Serving the KC metro</text></g>`;
    $('#areas').innerHTML = AREAS.map((a, i) => `<button class="area" data-i="${i}">${a.name}</button>`).join('');
    const select = (i) => {
      $$('.map-dot, .map-label', svg).forEach((el) => el.classList.toggle('on', +el.dataset.i === i));
      $$('.map-dot', svg).forEach((el) => el.setAttribute('r', +el.dataset.i === i ? 10 : 6));
      $$('.area').forEach((el) => el.classList.toggle('on', +el.dataset.i === i));
      $('#qArea').value = AREAS[i].name;
    };
    $('#areas').addEventListener('click', (e) => { const b = e.target.closest('.area'); if (b) { select(+b.dataset.i); toast(`Local pickup set to ${AREAS[+b.dataset.i].name}`); } });
    svg.addEventListener('click', (e) => { const d = e.target.closest('.map-dot'); if (d) select(+d.dataset.i); });
  })();

  // ===== FAQ =====
  $('#faqList').innerHTML = FAQ.map(([q, a]) => `<details class="reveal"><summary>${q}</summary><div class="ans"><p>${a}</p></div></details>`).join('');
  $$('#faqList details').forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) $$('#faqList details').forEach((o) => o !== d && (o.open = false));
  }));

  // ===== Local SEO structured data =====
  $('#ld-business').textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Freeman Prints',
    description: 'Custom 3D printing in Kansas City: functional parts, rapid prototypes, replacement parts and gifts.',
    image: 'assets/og-logo.png',
    areaServed: ['Kansas City, MO', 'Kansas City, KS', ...AREAS.map((a) => a.name)],
    address: { '@type': 'PostalAddress', addressLocality: 'Kansas City', addressRegion: 'MO', addressCountry: 'US' },
    sameAs: [CONFIG.treatstockUrl],
    ...(CONFIG.email ? { email: CONFIG.email } : {}),
  });

  // ===== Scroll reveal =====
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el) => revObs.observe(el));

  $('#year').textContent = new Date().getFullYear();
})();
