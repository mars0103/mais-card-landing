
const HIDE = { o: 0 };

const desktop = {
  hero: [
    {
      cardK: { x: 0.44, y: -0.36, z: -0.4, rz: -12, s: 1.4, o: 1, fl: 0.8, par: 0.7 },
      cardY: { x: 0.54, y: 0.3, z: -0.7, rz: 16, s: 1.4, o: 1, fl: 0.8, par: 0.5 },
      band: HIDE,
    },
  ],
  manifesto: [
    {
      cardY: { x: -0.32, y: -0.14, z: 0, rz: -14, ry: 8, s: 2, o: 1, fl: 0.5, par: 0.3 },
      cardK: { o: 0, exitX: 0.9 },
      band: HIDE,
    },
    {
      cardY: { x: -0.32, y: -0.1, z: -0.2, rz: 10, ry: -12, s: 2.05, o: 1, fl: 0.5, par: 0.3 },
      cardK: { o: 0, exitX: 0.9 },
      band: HIDE,
    },
    {
      cardY: { x: -0.32, y: -0.18, z: 0, rz: -8, ry: 14, s: 2.05, o: 1, fl: 0.5, par: 0.3 },
      cardK: { o: 0, exitX: 0.9 },
      band: HIDE,
    },
    {
      cardY: { x: -0.28, y: -0.16, z: 0.1, rz: -78, ry: 0, s: 1.75, o: 1, fl: 0.5, par: 0.3 },
      cardK: { o: 0, exitX: 0.9 },
      band: HIDE,
    },
  ],
  vantagens: [{ cardK: HIDE, cardY: HIDE, band: HIDE }],
  pague: [
    {
      band: { x: -0.4, y: -0.42, z: -0.3, rz: 18, ry: -22, rx: 0, s: 0.68, o: 1, fl: 0.6, par: 0.4 },
      cardY: { x: 0.34, y: -0.7, z: -0.2, rz: 14, s: 0.62, o: 1, fl: 0.5 },
      cardK: HIDE,
    },
    {
      band: { x: -0.2, y: -0.46, z: 0, rz: 12, ry: 14, rx: -6, s: 0.74, o: 1, fl: 0.4, par: 0.3 },
      cardY: { x: 0.32, y: -0.7, z: -0.2, rz: 14, s: 0.62, o: 1, fl: 0.5 },
      cardK: HIDE,
    },
    {
      band: { x: 0, y: -0.36, z: 0.5, rz: 0, ry: 180, rx: -12, s: 0.46, o: 1, fl: 0.15, par: 0.1 },
      cardY: { x: 0.32, y: -0.7, z: -0.2, rz: 14, s: 0.62, o: 0 },
      cardK: HIDE,
    },
  ],
  tour: [
    { cardK: HIDE, cardY: HIDE, band: HIDE },
    { sel: { x: 0.3, y: 0, z: 0, rz: -9, ry: 0, s: 2.1, o: 1, fl: 0.6, par: 0.6 }, band: HIDE },
    { cardK: HIDE, cardY: HIDE, band: HIDE },
    { cardK: HIDE, cardY: HIDE, band: HIDE },
    { cardK: HIDE, cardY: HIDE, band: HIDE },
    { cardK: HIDE, cardY: HIDE, band: HIDE },
  ],
  seguranca: [
    { cardK: { x: 0.6, y: 0.36, z: 0, rz: -12, ry: 180, s: 1.25, o: 1, fl: 0.6, par: 0.4 }, cardY: HIDE, band: HIDE },
  ],
  cta: [
    {
      cardY: { x: 0.6, y: 0.27, z: -0.5, rz: 15, ry: 0, s: 1.6, o: 1, fl: 0.8, par: 0.5, dropY: 1.4 },
      cardK: { x: 0.46, y: -0.24, z: 0.5, rz: -12, ry: 0, s: 1.6, o: 1, fl: 0.8, par: 0.5, dropY: 1.9 },
      band: HIDE,
    },
  ],
};

const mobile = {
  hero: [
    {
      cardK: { x: -0.06, y: -0.46, z: 0, rz: -14, s: 1.05, o: 1, fl: 1, par: 0.5 },
      cardY: { x: 0.2, y: -0.28, z: -1, rz: 16, s: 1.05, o: 1, fl: 1, par: 0.3 },
      band: HIDE,
    },
  ],
  manifesto: [
    { cardY: { x: 0, y: -0.3, z: 0, rz: -16, ry: 6, s: 1, o: 1, fl: 0.5 }, cardK: { o: 0, exitX: 0.7 }, band: HIDE },
    { cardY: { x: 0, y: -0.24, z: -0.2, rz: 10, ry: -10, s: 1.02, o: 1, fl: 0.5 }, cardK: { o: 0, exitX: 0.7 }, band: HIDE },
    { cardY: { x: 0, y: -0.18, z: 0, rz: -8, ry: 12, s: 1.02, o: 1, fl: 0.5 }, cardK: { o: 0, exitX: 0.7 }, band: HIDE },
    { cardY: { x: 0, y: -0.28, z: 0, rz: -78, s: 1.1, o: 1, fl: 0.5 }, cardK: { o: 0, exitX: 0.7 }, band: HIDE },
  ],
  vantagens: [{ cardK: HIDE, cardY: HIDE, band: HIDE }],
  pague: [
    { band: { x: -0.28, y: -0.28, z: -0.3, rz: 18, ry: -20, s: 0.5, o: 1, fl: 0.5 }, cardY: HIDE, cardK: HIDE },
    { band: { x: -0.14, y: -0.3, rz: 12, ry: 14, rx: -6, s: 0.54, o: 1, fl: 0.4 }, cardY: HIDE, cardK: HIDE },
    { band: { x: 0, y: -0.22, z: 0.5, rz: 0, ry: 0, rx: -12, s: 0.26, o: 1, fl: 0.15 }, cardY: HIDE, cardK: HIDE },
  ],
  tour: [
    { cardK: HIDE, cardY: HIDE, band: HIDE },
    { sel: { x: 0, y: -0.28, z: 0, rz: -8, s: 1.2, o: 1, fl: 0.6 }, band: HIDE },
    { cardK: HIDE, cardY: HIDE, band: HIDE },
    { cardK: HIDE, cardY: HIDE, band: HIDE },
    { cardK: HIDE, cardY: HIDE, band: HIDE },
    { cardK: HIDE, cardY: HIDE, band: HIDE },
  ],
  seguranca: [{ cardK: HIDE, cardY: HIDE, band: HIDE }],
  cta: [
    {
      cardY: { x: 0.2, y: -0.62, z: -0.5, rz: 15, s: 0.92, o: 1, fl: 0.8, dropY: -0.35 },
      cardK: { x: -0.1, y: -0.8, z: 0.5, rz: -12, s: 0.92, o: 1, fl: 0.8, dropY: -0.4 },
      band: HIDE,
    },
  ],
};

export const POSES = { desktop, mobile };
