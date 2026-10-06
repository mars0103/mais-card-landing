import * as THREE from 'three';
import { roundedRectShape, shapePlane } from './shapes.js';

export const CARD_W = 3.4;
export const CARD_H = 2.145;
const CARD_D = 0.06;
const RIM = 0.012;

export function buildCard(kind, textures) {
  const yellow = kind === 'yellow';
  const group = new THREE.Group();
  group.name = `card-${kind}`;

  const bodyShape = roundedRectShape(CARD_W, CARD_H, 0.17);
  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
    depth: CARD_D - RIM * 2,
    bevelEnabled: true,
    bevelThickness: RIM,
    bevelSize: RIM,
    bevelOffset: -RIM,
    bevelSegments: 3,
    curveSegments: 28,
  });
  bodyGeo.translate(0, 0, -(CARD_D - RIM * 2) / 2);
  const edge = new THREE.MeshPhysicalMaterial({ color: yellow ? '#D3A800' : '#060606', roughness: 0.42, metalness: 0.25, clearcoat: 0.4 });
  group.add(new THREE.Mesh(bodyGeo, edge));

  const faceW = CARD_W - RIM * 2, faceH = CARD_H - RIM * 2;
  const faceGeo = shapePlane(faceW, faceH, 0.17 - RIM);
  const mat = (map) =>
    new THREE.MeshPhysicalMaterial({
      map,
      roughness: yellow ? 0.5 : 0.7,
      specularIntensity: yellow ? 1 : 0.55,
      metalness: 0.04,
      clearcoat: yellow ? 0.55 : 0.18,
      clearcoatRoughness: yellow ? 0.28 : 0.42,
      envMapIntensity: yellow ? 1 : 0.4,
    });
  const front = new THREE.Mesh(faceGeo, mat(textures.front));
  front.position.z = CARD_D / 2 + 0.0006;
  const back = new THREE.Mesh(faceGeo, mat(textures.back));
  back.rotation.y = Math.PI;
  back.position.z = -CARD_D / 2 - 0.0006;
  group.add(front, back);
  return group;
}
