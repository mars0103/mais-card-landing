import * as THREE from 'three';
import { roundedRectShape, shapePlane } from './shapes.js';

const R = 1.3;
const T = 0.16;
const BW = 1.0;

function ringProfile(r0, r1, w, rc = 0.05) {
  const pts = [];
  const hw = w / 2;
  const corner = (cx, cy, a0, a1) => {
    for (let i = 0; i <= 5; i++) {
      const a = a0 + ((a1 - a0) * i) / 5;
      pts.push(new THREE.Vector2(cx + Math.cos(a) * rc, cy + Math.sin(a) * rc));
    }
  };
  corner(r0 + rc, -hw + rc, Math.PI, Math.PI * 1.5);
  corner(r1 - rc, -hw + rc, Math.PI * 1.5, Math.PI * 2);
  corner(r1 - rc, hw - rc, 0, Math.PI * 0.5);
  corner(r0 + rc, hw - rc, Math.PI * 0.5, Math.PI);
  pts.push(pts[0].clone());
  return pts;
}

export function buildProceduralBand() {
  const group = new THREE.Group();
  group.name = 'band';
  const rubber = new THREE.MeshPhysicalMaterial({ color: '#1C1C1C', roughness: 0.58, metalness: 0.05, clearcoat: 0.25, clearcoatRoughness: 0.5 });
  const yellow = new THREE.MeshPhysicalMaterial({ color: '#FDC908', roughness: 0.4, metalness: 0.1, clearcoat: 0.6 });

  const strap = new THREE.Group();
  const ringGeo = new THREE.LatheGeometry(ringProfile(R, R + T, BW), 120);
  strap.add(new THREE.Mesh(ringGeo, rubber));
  const stripeGeo = new THREE.LatheGeometry(ringProfile(R - 0.003, R + T + 0.012, BW + 0.012, 0.02), 6, Math.PI * 0.16, 0.085);
  strap.add(new THREE.Mesh(stripeGeo, yellow));
  const holeMat = new THREE.MeshBasicMaterial({ color: '#050505' });
  for (let k = 0; k < 5; k++) {
    const a = -0.75 - k * 0.14;
    const rr = R + T + 0.002;
    const hole = new THREE.Mesh(new THREE.CircleGeometry(0.045, 20), holeMat);
    hole.position.set(Math.sin(a) * rr, 0, Math.cos(a) * rr);
    hole.lookAt(hole.position.clone().multiplyScalar(2));
    strap.add(hole);
  }
  strap.rotation.z = Math.PI / 2;
  group.add(strap);

  const zFront = R + T;
  const mod = new THREE.Group();
  mod.position.z = zFront + 0.02;
  const caseGeo = new THREE.ExtrudeGeometry(roundedRectShape(1.42, 1.66, 0.42), {
    depth: 0.28, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelOffset: -0.03, bevelSegments: 3, curveSegments: 24,
  });
  caseGeo.translate(0, 0, -0.14);
  mod.add(new THREE.Mesh(caseGeo, new THREE.MeshPhysicalMaterial({ color: '#0D0D0D', roughness: 0.32, metalness: 0.85, clearcoat: 0.8 })));
  const rimGeo = new THREE.ExtrudeGeometry(roundedRectShape(1.5, 1.74, 0.46), { depth: 0.05, bevelEnabled: false, curveSegments: 24 });
  rimGeo.translate(0, 0, -0.16);
  mod.add(new THREE.Mesh(rimGeo, yellow));

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 600;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const screen = new THREE.Mesh(shapePlane(1.24, 1.46, 0.34), new THREE.MeshBasicMaterial({ map: tex }));
  screen.position.z = 0.176;
  mod.add(screen);
  group.add(mod);

  const ctx = canvas.getContext('2d');
  const draw = (approved) => {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 512, 600);
    ctx.textAlign = 'center';
    if (!approved) {
      ctx.strokeStyle = '#FDC908';
      ctx.lineWidth = 34;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(256, 130); ctx.lineTo(256, 320); ctx.moveTo(161, 225); ctx.lineTo(351, 225); ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = '700 84px "Montserrat Variable", Montserrat, sans-serif';
      ctx.fillText('09:41', 256, 470);
    } else {
      ctx.fillStyle = '#1E9E4A';
      ctx.beginPath(); ctx.arc(256, 230, 110, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 34;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(200, 232); ctx.lineTo(244, 278); ctx.lineTo(320, 186); ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = '700 64px "Montserrat Variable", Montserrat, sans-serif';
      ctx.fillText('R$ 89,90', 256, 430);
      ctx.fillStyle = '#9AE0B2';
      ctx.font = '600 44px "Montserrat Variable", Montserrat, sans-serif';
      ctx.fillText('Aprovado', 256, 500);
    }
    tex.needsUpdate = true;
  };
  draw(false);
  group.userData.setApproved = (v) => {
    if (group.userData._ap === v) return;
    group.userData._ap = v;
    draw(v);
  };
  return group;
}
