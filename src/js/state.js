export const state = {
  stage: null,
  lenis: null,
  reduced: false,
  active: -1,
  color: 'amarelo',
  beats: {},
};

export const isMobile = () => window.matchMedia('(max-width: 900px)').matches;
