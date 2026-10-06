import * as THREE from 'three';

export const CARD_ART = {
  yellow: { front: '/textures/card-yellow-front.png', back: '/textures/card-yellow-back.png' },
  black: { front: '/textures/card-black-front.png', back: '/textures/card-black-back.png' },
};

const loader = new THREE.TextureLoader();
const cache = new Map();

function load(url, renderer) {
  if (cache.has(url)) return cache.get(url);
  const p = loader.loadAsync(url).then((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;
    t.generateMipmaps = true;
    return t;
  });
  cache.set(url, p);
  return p;
}

export async function loadCardTextures(kind, renderer) {
  const urls = CARD_ART[kind];
  const [front, back] = await Promise.all([load(urls.front, renderer), load(urls.back, renderer)]);
  return { front, back };
}
