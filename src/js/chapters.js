import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { state, isMobile } from './state.js';
import { setChapter, setActiveLink } from './hud.js';
import { screens } from './screens.js';
import { config } from '../config.js';

const SCENES = ['hero', 'manifesto', 'vantagens', 'pague', 'tour', 'seguranca', 'cta'];
const THEMES = ['yellow', 'black', 'yellow', 'black', 'white', 'black', 'yellow'];
const TOUR_SCREENS = ['identidade', null, 'parcelado', 'carteira', 'coins', 'indique'];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const beatOf = (p, n) => Math.min(n - 1, Math.floor(p * n));

const tourTheme = (b) => ['white', state.color === 'preto' ? 'yellow' : 'black', 'white', 'black', 'yellow', 'black'][b];
const setTheme = (t) => { if (document.body.dataset.theme !== t) document.body.dataset.theme = t; };

const CHIPS = [
  [
    { t: 'Documento aprovado', i: 'check', k: 'ok', x: '-62%', y: '20%' },
    { t: 'Selfie validada', i: 'check', k: 'ok', x: '-48%', y: '32%' },
    { t: 'Limite pré-aprovado R$ 1.500,00', i: 'shield', k: 'y', dark: true, x: '46%', y: '86%' },
  ],
  [],
  [
    { t: 'Crédito automático na Carteira+', i: 'wallet', k: 'y', x: '-74%', y: '10%' },
    { t: 'Parcelas na fatura do cartão', i: 'calendar', k: 'y', x: '-58%', y: '86%' },
  ],
  [
    { t: '+ R$ 10,00 · Indicação concluída', i: 'gift', k: 'y', x: '-76%', y: '20%' },
    { t: 'Saque via Pix', i: 'pix', k: 'y', x: '-40%', y: '80%' },
  ],
  [
    { t: '+1.000 +Coins por indicação', i: 'coins', k: 'y', dark: true, x: '-66%', y: '18%' },
    { t: '5.000 +Coins = R$ 2,00', i: 'arrow-right', k: 'y', x: '-46%', y: '80%' },
  ],
  [
    { t: 'Toque no código para copiar', i: 'check', k: 'ok', x: '-68%', y: '30%' },
    { t: 'Você recebe R$ 10,00 na Carteira+', i: 'wallet', k: 'y', x: '-54%', y: '80%' },
  ],
];

function activate(i) {
  state.active = i;
  const scene = SCENES[i];
  setTheme(i === 4 ? tourTheme(state.beats.tour ?? 0) : THEMES[i]);
  setChapter(i);
  state.stage?.setScene(scene, state.beats[scene] ?? 0);
  if (i === 3) pagueWhiteoutDismissed = false; // voltou para "pague": o flash pode acontecer de novo
  else hidePagueWhiteout();
}

let pagueWhiteoutDismissed = false;
function hidePagueWhiteout() {
  if (state.active === 3) return; // voltou para "pague" antes de confirmar — cancela
  const wo = $('#pague-whiteout');
  const app = $('#app');
  if (!wo) return;
  if (!app || app.getBoundingClientRect().top <= window.innerHeight * 0.5) {
    wo.style.opacity = '0';
    pagueWhiteoutDismissed = true;
    return;
  }
  requestAnimationFrame(hidePagueWhiteout);
}

export function initChapters() {
  const secs = $$('.chapter');
  const stagger = state.reduced ? false : true;

  secs.forEach((sec, i) => {
    const start = sec.id === 'comece' ? 'top 20%' : 'top 55%';
    ScrollTrigger.create({
      trigger: sec, start, end: 'bottom 55%',
      onToggle: (self) => { if (self.isActive) activate(i); },
    });
  });
  ScrollTrigger.create({
    trigger: '#rodape', start: 'top 62%',
    onEnter: () => setTheme('black'),
    onLeaveBack: () => setTheme('yellow'),
  });

  if (state.reduced) return; // modo estático: só tema por capítulo

  initManifesto();
  initPague();
  initTour();
  if (stagger) initReveals();
}


export function playHeroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to('.hero__title .line > span', { yPercent: 0, y: 0, duration: 1.2, stagger: 0.12 }, 0.1)
    .to('.hero__copy [data-reveal]', { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.5)
    .to('.hero__phone', { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' }, 0.6)
    .to('[data-reveal-chip]', { opacity: 1, scale: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'back.out(1.6)' }, 0.9);
  return tl;
}

export function prepHeroIntro() {
  gsap.set('.hero__title .line > span', { yPercent: 105 });
  gsap.set('.hero__copy [data-reveal]', { y: 24 });
  gsap.set('.hero__phone', { opacity: 0, y: 28, scale: 0.94 });
  gsap.set('[data-reveal-chip]', { y: 16, scale: 0.85 });
}


function initManifesto() {
  const lines = $$('.mline');
  const typed = $('#manifesto-typed-text');
  const balloon = $('#manifesto-balloon');
  const balloonText = balloon?.querySelector('p');
  const n = lines.length;
  let cur = -1;

  const render = (progress) => {
    const seg = 1 / n;
    const i = Math.min(n - 1, Math.floor(progress / seg));
    const u = (progress - i * seg) / seg;
    const full = lines[i].textContent;
    const isLast = i === n - 1;
    const frac = isLast ? Math.min(1, u / 0.5) : u < 0.5 ? u / 0.5 : 1 - (u - 0.5) / 0.5;
    if (typed) typed.textContent = full.slice(0, Math.round(frac * full.length));

    if (i !== cur) {
      cur = i;
      if (balloon) {
        balloonText.textContent = lines[i].dataset.balloon || '';
        gsap.fromTo(balloon, { opacity: 0, y: 14, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.6)' });
      }
      if (state.active === 1) state.stage?.setScene('manifesto', i);
    }
  };

  ScrollTrigger.create({ trigger: '#manifesto', start: 'top top', end: 'bottom bottom', onUpdate: (s) => render(s.progress) });
  render(0);
}


const PAGUE_FLASH_START = 0.9;
function initPague() {
  const nfc = $('#nfc'), pos = $('#pos'), status = $('#pos-status em');
  const whiteout = $('#pague-whiteout');
  let originX = window.innerWidth / 2, originY = window.innerHeight / 2, scaleTarget = 5;
  const updateOrigin = () => {
    const screen = $('#pos-screen');
    if (!screen) return;
    const r = screen.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    originX = r.left + r.width / 2;
    originY = r.top + r.height / 2;
    whiteout.style.left = `${originX}px`;
    whiteout.style.top = `${originY}px`;
    const dx = Math.max(originX, window.innerWidth - originX);
    const dy = Math.max(originY, window.innerHeight - originY);
    scaleTarget = (Math.sqrt(dx * dx + dy * dy) / 160) * 1.05; // 160 = metade dos 320px do círculo base
  };

  let cur = -1;
  let wasInFlash = false;
  const set = (b) => {
    if (b === cur) return;
    cur = b;
    state.beats.pague = b;
    nfc.classList.toggle('is-tap', b === 2);
    pos.classList.toggle('is-ok', b === 2);
    status.textContent = b === 2 ? 'Aprovado' : 'Aproxime';
    gsap.delayedCall(b === 2 ? 0.9 : 0, () => state.stage?.bandApproved(b === 2));
    if (state.active === 3) state.stage?.setScene('pague', b);
  };
  const setWhiteout = (progress) => {
    if (pagueWhiteoutDismissed) return; // já foi escondido depois de sair de "pague" — ver hidePagueWhiteout
    const t = Math.max(0, Math.min(1, (progress - PAGUE_FLASH_START) / (1 - PAGUE_FLASH_START)));
    if (t > 0 && !wasInFlash) updateOrigin();
    wasInFlash = t > 0;
    whiteout.style.opacity = t > 0 ? String(Math.min(1, t / 0.3)) : '0';
    whiteout.style.transform = `scale(${(t * scaleTarget).toFixed(2)})`;
  };
  ScrollTrigger.create({
    trigger: '#pague', start: 'top top', end: 'bottom bottom',
    onUpdate: (s) => { set(beatOf(s.progress, 3)); setWhiteout(s.progress); },
  });
}


function fitPhone() {
  const phone = $('#phone');
  if (!phone) return;
  const h = isMobile() ? window.innerHeight * 0.4 : Math.min(window.innerHeight * 0.78, 730);
  phone.style.setProperty('--ps', (h / 850).toFixed(4));
}

function renderChips(b) {
  const ul = $('#tour-chips');
  const list = CHIPS[b] || [];
  ul.innerHTML = list
    .map((c) => `<li class="chip${c.dark ? ' chip--dark' : ''}" style="left:${c.x};top:${c.y}"><span class="chip__ico chip__ico--${c.k}"><svg class="i"><use href="#i-${c.i}"/></svg></span>${c.t}</li>`)
    .join('');
  if (!list.length) return;
  gsap.fromTo(ul.children, { opacity: 0, y: 18, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.16, delay: 0.55, ease: 'back.out(1.5)' });
}

function initTour() {
  const tour = $('#app');
  const panels = $$('.beat', tour), dots = $$('#tour-dots i');
  screens.mount($('#phone-viewport'));
  fitPhone();
  window.addEventListener('resize', fitPhone);
  let cur = -1;

  const set = (b, force = false) => {
    if (b === cur && !force) return;
    cur = b;
    state.beats.tour = b;
    panels.forEach((p, i) => p.classList.toggle('is-active', i === b));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === b));
    tour.classList.toggle('is-cor', b === 1);
    const sc = TOUR_SCREENS[b];
    if (sc) screens.show(sc);
    renderChips(b);
    if (b === 4) countCoins();
    if (state.active === 4) {
      setTheme(tourTheme(b));
      state.stage?.setScene('tour', b);
      setActiveLink(b === 4 ? '#coins' : '#app');
    }
  };
  ScrollTrigger.create({ trigger: tour, start: 'top top', end: 'bottom bottom', onUpdate: (s) => set(beatOf(s.progress, 6)) });
  set(0, true);

  $$('.swatch').forEach((btn) => btn.addEventListener('click', () => {
    const color = btn.dataset.color;
    state.color = color;
    $$('.swatch').forEach((b) => { const on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', String(on)); });
    setTheme(tourTheme(1));
    state.stage?.setColor(color);
  }));

  const range = $('#sim-range'), out = $('#sim-value'), chips = $$('.sim__chips button');
  let n = 6;
  const fmt = (v) => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  const sync = () => {
    const v = Number(range.value);
    out.textContent = fmt(v);
    range.style.setProperty('--p', `${((v - 25) / 275) * 100}%`);
    chips.forEach((c) => { const on = Number(c.dataset.n) === n; c.classList.toggle('is-on', on); c.setAttribute('aria-checked', String(on)); });
    screens.setParcelado(v, n);
  };
  range.addEventListener('input', sync);
  chips.forEach((c) => c.addEventListener('click', () => { n = Number(c.dataset.n); sync(); }));
  range.style.setProperty('--p', '100%');

  const btn = $('#copy-code'), label = btn.querySelector('span');
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(config.demoReferralCode); } catch {  }
    label.textContent = 'Copiado!';
    screens.flashCopied();
    setTimeout(() => (label.textContent = 'Copiar'), 1800);
  });
}

function countCoins() {
  const el = $('#coins-num');
  const o = { v: 0 };
  gsap.to(o, { v: Number(el.dataset.to), duration: 1.8, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString('pt-BR')) });
}


function initReveals() {
  gsap.from('.card3', {
    y: 60, opacity: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out',
    scrollTrigger: { trigger: '.cards3', start: 'top 82%', toggleActions: 'play none none reverse' },
  });
  gsap.from('.sec__title, #seguranca .kicker', {
    y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '#seguranca', start: 'top 70%', toggleActions: 'play none none reverse' },
  });
  gsap.from('.cta__copy > *', {
    y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '#comece', start: 'top 65%', toggleActions: 'play none none reverse' },
  });
}
