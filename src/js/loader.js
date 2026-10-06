import { gsap } from 'gsap';

export function createLoader() {
  const el = document.getElementById('loader');
  const start = performance.now();

  return {
    set() {},
    async finish() {
      const wait = Math.max(0, 1400 - (performance.now() - start));
      await new Promise((r) => setTimeout(r, wait + 350));
      await gsap.to(el, { yPercent: -100, duration: 1, ease: 'power4.inOut' }).then();
      el.remove();
    },
  };
}
