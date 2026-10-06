import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { config } from '../../config.js';
import { loadCardTextures } from './textures.js';
import { buildCard, CARD_W } from './card.js';
import { buildProceduralBand } from './band.js';
import { POSES } from './poses.js';

const KEYS = ['cardK', 'cardY', 'band'];
const DEFAULT = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, o: 0, fl: 0, par: 0 };
const D2R = Math.PI / 180;
const HALF_H = 5; // altura visível = 10 unidades no plano z = 0

export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

export class Stage {
  constructor(canvas) {
    this.canvas = canvas;
    this.mq = window.matchMedia('(max-width: 900px)');
    this.mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    this.sceneName = null;
    this.beat = -1;
    this.color = 'amarelo';
    this.ready = false;
    this.wasVisible = false;
    this.dragRot = { ry: 0, rx: 0 };
    this.drag = { active: false, x: 0, y: 0 };
  }

  get mobile() { return this.mq.matches; }

  async init(report = () => {}) {
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.NoToneMapping; // cores fiéis à marca
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

    const pmrem = new THREE.PMREMGenerator(renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.42;
    pmrem.dispose();
    const key = new THREE.DirectionalLight(0xffffff, 0.95);
    key.position.set(3, 4, 6);
    const rim = new THREE.DirectionalLight(0xfff0b0, 0.6);
    rim.position.set(-5, 2, -3);
    this.scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.5));
    report(0.2);

    const [texY, texK] = await Promise.all([loadCardTextures('yellow', renderer), loadCardTextures('black', renderer)]);
    report(0.45);

    const defs = {
      cardY: { cfg: config.models.cardYellow, make: () => buildCard('yellow', texY), target: 'card' },
      cardK: { cfg: config.models.cardBlack, make: () => buildCard('black', texK), target: 'card' },
      band: { cfg: config.models.band, make: () => buildProceduralBand(), target: 'band' },
    };
    this.objs = {};
    let done = 0;
    for (const k of KEYS) {
      const d = defs[k];
      let model = null;
      if (d.cfg?.url) {
        try { model = await this.loadModel(d.cfg, d.target); } catch (e) { console.warn(`[MAIS] Modelo ${d.cfg.url} não carregou, usando o provisório.`, e); }
      }
      if (!model) model = d.make();
      const pivot = new THREE.Group();
      pivot.name = k;
      pivot.rotation.order = 'ZYX';
      pivot.add(model);
      pivot.visible = false;
      pivot.userData.state = { ...DEFAULT };
      pivot.userData.mats = [];
      pivot.userData._o = -1;
      pivot.userData.phase = Math.random() * 6.28;
      model.traverse((m) => {
        if (m.isMesh) (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat) => pivot.userData.mats.push(mat));
      });
      pivot.userData.setApproved = model.userData.setApproved;
      this.scene.add(pivot);
      this.objs[k] = pivot;
      report(0.45 + 0.45 * (++done / KEYS.length));
    }

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('pointermove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
    this._bindDrag();
    this.ready = true;
    report(1);
    gsap.ticker.add((t) => this.render(t));
    if (this._pending) this.setScene(...this._pending);
  }

  _bindDrag() {
    const isDraggable = () => this.sceneName === 'tour' && this.beat === 1;
    const start = (x, y) => {
      if (!isDraggable()) return;
      this.drag.active = true;
      this.drag.x = x;
      this.drag.y = y;
      this.canvas.style.cursor = 'grabbing';
    };
    const move = (x, y) => {
      if (!this.drag.active) return;
      const dx = x - this.drag.x, dy = y - this.drag.y;
      this.drag.x = x;
      this.drag.y = y;
      this.dragRot.ry += dx * 0.35;
      this.dragRot.rx = Math.max(-35, Math.min(35, this.dragRot.rx - dy * 0.25));
    };
    const end = () => {
      if (!this.drag.active) return;
      this.drag.active = false;
      this.canvas.style.cursor = isDraggable() ? 'grab' : '';
    };
    this.canvas.addEventListener('pointerdown', (e) => start(e.clientX, e.clientY));
    window.addEventListener('pointermove', (e) => move(e.clientX, e.clientY));
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  }

  async loadModel(cfg, target) {
    const [{ GLTFLoader }, { DRACOLoader }, { MeshoptDecoder }] = await Promise.all([
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('three/examples/jsm/loaders/DRACOLoader.js'),
      import('three/examples/jsm/libs/meshopt_decoder.module.js'),
    ]);
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath(config.dracoPath);
    loader.setDRACOLoader(draco);
    loader.setMeshoptDecoder(MeshoptDecoder);
    const gltf = await loader.loadAsync(cfg.url);
    const root = gltf.scene;
    if (cfg.rotation) root.rotation.set(...cfg.rotation.map((d) => d * D2R));
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const norm = (target === 'card' ? CARD_W / size.x : 3.4 / size.y) * (cfg.scale ?? 1);
    const inner = new THREE.Group();
    root.position.sub(center);
    inner.add(root);
    inner.scale.setScalar(norm);
    if (cfg.position) inner.position.set(...cfg.position);
    const wrap = new THREE.Group();
    wrap.add(inner);
    return wrap;
  }

  resize() {
    if (!this.renderer) return;
    const w = window.innerWidth, h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.mobile ? 1.5 : 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.camera.aspect = aspect;
    this.camera.position.set(0, 0, HALF_H / Math.tan((this.camera.fov / 2) * D2R));
    this.camera.updateProjectionMatrix();
    this.halfW = aspect * HALF_H;
    this.fit = this.mobile ? 1 : Math.min(1, aspect / 1.55);
    if (this._wasMobile !== this.mobile) {
      this._wasMobile = this.mobile;
      if (this.ready) this.setScene(this.sceneName, this.beat, true);
    }
  }

  setScene(name, beat = 0, instant = false) {
    if (!this.ready) { this._pending = [name, beat]; return; }
    const table = (this.mobile ? POSES.mobile : POSES.desktop)[name];
    if (!table) return;
    const idx = Math.min(beat, table.length - 1);
    if (!instant && name === this.sceneName && idx === this.beat && !this._force) return;
    const prev = this.sceneName;
    this.sceneName = name;
    this.beat = idx;
    this._force = false;
    this.applyPose(table[idx], { instant, flip: false, fromScene: prev });
    const draggable = name === 'tour' && idx === 1;
    this.canvas.style.pointerEvents = draggable ? 'auto' : 'none';
    this.canvas.style.cursor = draggable ? 'grab' : '';
    if (!draggable) { this.dragRot.ry = 0; this.dragRot.rx = 0; this.drag.active = false; }
    this.canvas.style.zIndex = name === 'pague' ? '3' : '1';
  }

  setColor(color) {
    if (this.color === color) return;
    this.color = color;
    if (this.sceneName === 'tour') { this._force = true; this.applyPose(this._currentTable()[this.beat], { flip: true }); this._force = false; }
    if (this.sceneName === 'cta') { this._force = true; this.setScene('cta', 0); }
  }

  _currentTable() { return (this.mobile ? POSES.mobile : POSES.desktop)[this.sceneName]; }

  applyPose(pose, { instant = false, flip = false } = {}) {
    const targets = {};
    if (pose.sel) {
      const selKey = this.color === 'preto' ? 'cardK' : 'cardY';
      const other = selKey === 'cardK' ? 'cardY' : 'cardK';
      targets[selKey] = pose.sel;
      targets[other] = { o: 0 };
      targets.band = pose.band ?? { o: 0 };
    } else {
      KEYS.forEach((k) => (targets[k] = pose[k] ?? { o: 0 }));
    }
    if (this.sceneName === 'cta' && targets.cardY.o && targets.cardK.o) {
      const front = this.color === 'preto' ? 'cardK' : 'cardY';
      const back = front === 'cardK' ? 'cardY' : 'cardK';
      targets[front] = { ...targets[front], z: 0.5 };
      targets[back] = { ...targets[back], z: -0.5 };
    }

    KEYS.forEach((k) => {
      const obj = this.objs[k];
      const st = obj.userData.state;
      const t = targets[k];
      gsap.killTweensOf(st);
      if (!t.o) {
        if (t.exitX) {
          gsap.to(st, { x: st.x + t.exitX, o: 0, duration: 0.9, ease: 'power2.in' });
        } else {
          st.o = 0;
        }
        return;
      }
      const { dropY, ...tt } = t;
      const full = { ...DEFAULT, ...tt };
      if (instant) { Object.assign(st, full); return; }
      const appearing = st.o < 0.05;
      const drop = dropY;
      if (appearing) {
        Object.assign(st, { ...full, o: full.o, y: full.y + (drop ?? -0.14), s: full.s * 0.86, ry: full.ry + (flip ? -70 : drop ? 0 : -22) });
      } else {
        st.o = full.o;
      }
      const { y, ...rest } = full;
      gsap.to(st, { ...rest, duration: 1.15, ease: 'power3.inOut' });
      gsap.to(st, { y, duration: drop ? 1.5 : 1.15, ease: drop ? 'bounce.out' : 'power3.inOut', delay: drop ? 0.1 : 0 });
    });
  }

  bandApproved(v) { this.objs?.band?.userData.setApproved?.(v); }

  render(time) {
    if (!this.ready || document.hidden || this.paused) return;
    const m = this.mouse;
    m.sx += (m.x - m.sx) * 0.06;
    m.sy += (m.y - m.sy) * 0.06;
    let any = false;
    for (const k of KEYS) {
      const g = this.objs[k];
      const st = g.userData.state;
      g.visible = st.o > 0.01;
      if (!g.visible) continue;
      any = true;
      const ph = g.userData.phase;
      const fy = Math.sin(time * 0.9 + ph) * 0.07 * st.fl;
      const frz = Math.sin(time * 0.6 + ph) * 0.022 * st.fl;
      const isSel = this.sceneName === 'tour' && this.beat === 1 && k === (this.color === 'preto' ? 'cardK' : 'cardY');
      const drag = isSel ? this.dragRot : { ry: 0, rx: 0 };
      g.position.set(st.x * this.halfW, st.y * HALF_H + fy, st.z);
      g.rotation.set(
        st.rx * D2R - m.sy * 0.12 * st.par + drag.rx * D2R,
        st.ry * D2R + m.sx * 0.2 * st.par + drag.ry * D2R,
        st.rz * D2R + frz,
      );
      g.scale.setScalar(st.s * this.fit);
      this._opacity(g, st.o);
    }
    if (any || this.wasVisible) this.renderer.render(this.scene, this.camera);
    this.wasVisible = any;
  }

  _opacity(g, o) {
    const u = g.userData;
    if (Math.abs(u._o - o) < 0.004) return;
    const wasT = u._o >= 0 && u._o < 0.999;
    const nowT = o < 0.999;
    u._o = o;
    u.mats.forEach((mat) => {
      mat.opacity = o;
      mat.transparent = nowT;
      mat.depthWrite = !nowT;
      if (wasT !== nowT) mat.needsUpdate = true;
    });
  }
}
