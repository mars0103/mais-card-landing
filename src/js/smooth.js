import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { state } from './state.js';

gsap.registerPlugin(ScrollTrigger);

export function initSmooth() {
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  state.lenis = lenis;
  return lenis;
}

export function goTo(target, beat) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const sec = el.closest('.chapter') || el;
  let y = sec.getBoundingClientRect().top + window.scrollY;
  const n = Number(sec.dataset.beats || 0);
  if (beat != null && n) {
    const len = sec.offsetHeight - window.innerHeight;
    y += ((beat + 0.5) / n) * len;
  } else if (!sec.classList.contains('chapter')) {
    y = el.getBoundingClientRect().top + window.scrollY;
  }
  if (state.lenis) state.lenis.scrollTo(y, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top: y, behavior: state.reduced ? 'auto' : 'smooth' });
}
