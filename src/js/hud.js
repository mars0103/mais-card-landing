import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { goTo } from './smooth.js';
import { state } from './state.js';

export const CHAPTERS = [
  { id: 'hero', title: 'Hero' },
  { id: 'manifesto', title: 'Manifesto' },
  { id: 'vantagens', title: 'Vantagens' },
  { id: 'pague', title: 'Pague com um toque' },
  { id: 'app', title: 'App tour' },
  { id: 'seguranca', title: 'Segurança e atendimento' },
  { id: 'comece', title: 'Comece agora' },
];

const pad = (n) => String(n + 1).padStart(2, '0');

export function initHud() {
  const rail = document.getElementById('hud-rail');
  rail.innerHTML = CHAPTERS.map((c, i) => `<button type="button" data-i="${i}" aria-label="Ir para ${c.title}">+</button>`).join('');
  rail.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) goTo('#' + CHAPTERS[Number(b.dataset.i)].id);
  });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-nav]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    document.body.classList.remove('menu-open');
    const t = document.querySelector(href);
    if (!t) return;
    const beat = a.dataset.beatLink != null ? Number(a.dataset.beatLink) : t.dataset.beatAnchor != null ? Number(t.dataset.beatAnchor) : undefined;
    goTo(t.dataset.beatAnchor != null ? '#app' : t, beat);
  });

  const toggle = document.getElementById('menu-toggle');
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (state.lenis) open ? state.lenis.stop() : state.lenis.start();
  });
  document.getElementById('hud-nav').addEventListener('click', () => {
    if (document.body.classList.contains('menu-open')) {
      document.body.classList.remove('menu-open');
      state.lenis?.start();
    }
  });

  const bar = document.getElementById('progress-bar');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => gsap.set(bar, { scaleX: s.progress }) });

  initCursor();
  initMagnetic();
}

export function setChapter(i) {
  const c = CHAPTERS[i];
  if (!c) return;
  document.getElementById('chapter-n').textContent = `${pad(i)} / ${String(CHAPTERS.length).padStart(2, '0')}`;
  document.getElementById('chapter-t').textContent = c.title;
  document.querySelectorAll('#hud-rail button').forEach((b) => b.classList.toggle('is-active', Number(b.dataset.i) === i));
  document.body.classList.toggle('is-cta', i === 6);
  setActiveLink(i === 4 && state.beats.tour === 4 ? '#coins' : '#' + c.id);
}

export function setActiveLink(href) {
  document.querySelectorAll('#hud-nav a').forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === href));
}

function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || state.reduced) return;
  const cur = document.getElementById('cursor');
  document.body.classList.add('has-cursor');
  const qx = gsap.quickTo(cur, 'x', { duration: 0.25, ease: 'power3' });
  const qy = gsap.quickTo(cur, 'y', { duration: 0.25, ease: 'power3' });
  window.addEventListener('pointermove', (e) => {
    cur.classList.add('is-on');
    qx(e.clientX);
    qy(e.clientY);
  }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    cur.classList.toggle('is-hover', !!e.target.closest('a, button, input, .swatch'));
    const onCanvas = e.target.id === 'stage3d' && e.target.style.pointerEvents === 'auto';
    cur.classList.toggle('is-drag', onCanvas);
    cur.textContent = onCanvas ? '↻' : '+';
  });
  document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
}

function initMagnetic() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || state.reduced) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * 0.22, y: (e.clientY - (r.top + r.height / 2)) * 0.3, duration: 0.4, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }));
  });
}
