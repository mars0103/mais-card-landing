import '@fontsource-variable/quicksand';
import '@fontsource-variable/montserrat';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './styles/base.css';
import './styles/chapters.css';
import './styles/phone.css';
import './styles/responsive.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { state } from './js/state.js';
import { initSmooth } from './js/smooth.js';
import { initHud, setChapter } from './js/hud.js';
import { initChapters, prepHeroIntro, playHeroIntro } from './js/chapters.js';
import { createLoader } from './js/loader.js';
import { Stage, webglAvailable } from './js/three/stage.js';
import { CARD_ART } from './js/three/textures.js';
import { config } from './config.js';

gsap.registerPlugin(ScrollTrigger);

const html = document.documentElement;
if (import.meta.env.DEV) window.__mais = state;

async function boot() {
  state.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader = createLoader();

  document.querySelectorAll('[href="https://soumaiscard.com.br/#baixar"]').forEach((a) => (a.href = config.links.cta));
  document.getElementById('ticket-code').textContent = config.demoReferralCode;

  await Promise.all([
    document.fonts.load('700 1em "Quicksand Variable"'),
    document.fonts.load('600 1em "Montserrat Variable"'),
    document.fonts.ready,
  ]).catch(() => {});
  loader.set(0.15);

  const canUse3D = !state.reduced && webglAvailable();
  if (canUse3D) {
    try {
      const stage = new Stage(document.getElementById('stage3d'));
      await stage.init((p) => loader.set(0.15 + p * 0.8));
      state.stage = stage;
    } catch (err) {
      console.warn('[MAIS] Cena 3D indisponível, seguindo sem 3D.', err);
    }
  }

  if (!state.stage) {
    html.classList.add('no-3d');
    document.querySelectorAll('[data-fallback-card]').forEach((img) => (img.src = CARD_ART[img.dataset.fallbackCard].front));
  }
  if (state.reduced) html.classList.add('is-static');

  initHud();
  if (!state.reduced) initSmooth();
  initChapters();
  prepHeroIntro();

  await loader.finish();
  html.classList.remove('is-loading');
  ScrollTrigger.refresh();
  window.scrollTo(0, 0);
  playHeroIntro();
  setChapter(0);
  state.stage?.setScene('hero', 0);
}

boot();
