import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// ── Alien Definitions ─────────────────────────────────────────────────────────
const ALIENS = {
  heatblast: {
    name: "Heatblast", color: 0xFF4500, accentColor: 0xFF8C00,
    emissive: 0xFF2200, emissiveIntensity: 0.6,
    speed: 8, sprintMult: 1.8, jumpVel: 9, canFly: true, gravity: -22, scale: 1.0, label: "🔥",
    attackLabel: "BLAZE", attackColor: 0xFF4500,
    buildMesh: (pg, mk) => {
      mk(new THREE.SphereGeometry(0.38, 10, 8), 0xFF4500, 0, 1.26, 0);
      mk(new THREE.BoxGeometry(0.68, 0.34, 0.38), 0xCC3300, 0, 0.80, 0);
      mk(new THREE.SphereGeometry(0.31, 12, 8), 0xFF6600, 0, 1.95, 0);
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.28, 5),
          new THREE.MeshLambertMaterial({ color: 0xFF8C00, emissive: 0xFF4400, emissiveIntensity: 0.8 }));
        cone.position.set(Math.cos(angle)*0.22, 2.18, Math.sin(angle)*0.22);
        cone.rotation.z = Math.cos(angle)*0.4; cone.rotation.x = Math.sin(angle)*0.4;
        pg.add(cone);
      }
      const lLeg = mk(new THREE.BoxGeometry(0.28, 0.76, 0.28), 0xCC3300, 0.19, 0.38, 0);
      const rLeg = mk(new THREE.BoxGeometry(0.28, 0.76, 0.28), 0xCC3300, -0.19, 0.38, 0);
      const lArm = mk(new THREE.BoxGeometry(0.22, 0.74, 0.22), 0xFF4500, 0.48, 1.26, 0);
      const rArm = mk(new THREE.BoxGeometry(0.22, 0.74, 0.22), 0xFF4500, -0.48, 1.26, 0);
      const lShoe = mk(new THREE.BoxGeometry(0.30, 0.14, 0.44), 0x880000, 0.19, 0.04, 0.06);
      const rShoe = mk(new THREE.BoxGeometry(0.30, 0.14, 0.44), 0x880000, -0.19, 0.04, 0.06);
      return { lLeg, rLeg, lArm, rArm, lShoe, rShoe };
    }
  },
  xlr8: {
    name: "XLR8", color: 0x003AFF, accentColor: 0x00AAFF,
    emissive: 0, emissiveIntensity: 0,
    speed: 21, sprintMult: 3.0, jumpVel: 10, canFly: false, gravity: -22, scale: 0.9, label: "⚡",
    attackLabel: "SLASH", attackColor: 0x00AAFF,
    buildMesh: (pg, mk) => {
      mk(new THREE.BoxGeometry(0.60, 0.85, 0.36), 0x003AFF, 0, 1.26, 0);
      mk(new THREE.BoxGeometry(0.58, 0.30, 0.34), 0x001199, 0, 0.80, 0);
      mk(new THREE.SphereGeometry(0.29, 12, 8), 0x111122, 0, 1.95, 0);
      mk(new THREE.BoxGeometry(0.44, 0.18, 0.12), 0x00AAFF, 0, 1.97, 0.22);
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.55, 6),
        new THREE.MeshLambertMaterial({ color: 0x003AFF }));
      tail.rotation.x = Math.PI / 2; tail.position.set(0, 1.0, 0.38); pg.add(tail);
      const lLeg = mk(new THREE.BoxGeometry(0.22, 0.72, 0.22), 0x001199, 0.17, 0.38, 0);
      const rLeg = mk(new THREE.BoxGeometry(0.22, 0.72, 0.22), 0x001199, -0.17, 0.38, 0);
      const lArm = mk(new THREE.BoxGeometry(0.18, 0.68, 0.18), 0x003AFF, 0.42, 1.26, 0);
      const rArm = mk(new THREE.BoxGeometry(0.18, 0.68, 0.18), 0x003AFF, -0.42, 1.26, 0);
      const lShoe = mk(new THREE.BoxGeometry(0.26, 0.12, 0.50), 0x002288, 0.17, 0.04, 0.06);
      const rShoe = mk(new THREE.BoxGeometry(0.26, 0.12, 0.50), 0x002288, -0.17, 0.04, 0.06);
      return { lLeg, rLeg, lArm, rArm, lShoe, rShoe };
    }
  },
  fourarms: {
    name: "Four Arms", color: 0xCC1111, accentColor: 0xFF3333,
    emissive: 0, emissiveIntensity: 0,
    speed: 6, sprintMult: 1.4, jumpVel: 16, canFly: false, gravity: -22, scale: 1.4, label: "💪",
    attackLabel: "SMASH", attackColor: 0xFF3333,
    buildMesh: (pg, mk) => {
      mk(new THREE.BoxGeometry(1.10, 1.10, 0.60), 0xCC1111, 0, 1.40, 0);
      mk(new THREE.BoxGeometry(0.90, 0.42, 0.54), 0xAA0000, 0, 0.78, 0);
      mk(new THREE.SphereGeometry(0.38, 12, 8), 0xCC1111, 0, 2.08, 0);
      mk(new THREE.BoxGeometry(0.78, 0.08, 0.42), 0x111111, 0, 2.06, 0);
      const lArm  = mk(new THREE.BoxGeometry(0.30, 0.90, 0.30), 0xCC1111,  0.72, 1.45, 0);
      const rArm  = mk(new THREE.BoxGeometry(0.30, 0.90, 0.30), 0xCC1111, -0.72, 1.45, 0);
      const lArm2 = mk(new THREE.BoxGeometry(0.28, 0.82, 0.28), 0xAA0000,  0.72, 0.95, 0);
      const rArm2 = mk(new THREE.BoxGeometry(0.28, 0.82, 0.28), 0xAA0000, -0.72, 0.95, 0);
      const lLeg  = mk(new THREE.BoxGeometry(0.40, 0.90, 0.40), 0xAA0000,  0.27, 0.36, 0);
      const rLeg  = mk(new THREE.BoxGeometry(0.40, 0.90, 0.40), 0xAA0000, -0.27, 0.36, 0);
      const lShoe = mk(new THREE.BoxGeometry(0.44, 0.18, 0.58), 0x550000, 0.27, 0.04, 0.06);
      const rShoe = mk(new THREE.BoxGeometry(0.44, 0.18, 0.58), 0x550000, -0.27, 0.04, 0.06);
      return { lLeg, rLeg, lArm, rArm, lShoe, rShoe, extra: [lArm2, rArm2] };
    }
  },
  diamondhead: {
    name: "Diamondhead", color: 0x00CED1, accentColor: 0x7FFFD4,
    emissive: 0, emissiveIntensity: 0,
    speed: 7, sprintMult: 1.5, jumpVel: 10, canFly: false, gravity: -22, scale: 1.05, label: "💎",
    attackLabel: "SPIKE", attackColor: 0x7FFFD4,
    buildMesh: (pg, mk) => {
      mk(new THREE.BoxGeometry(0.80, 0.95, 0.44), 0x00CED1, 0, 1.26, 0);
      mk(new THREE.BoxGeometry(0.68, 0.32, 0.38), 0x008B8B, 0, 0.80, 0);
      mk(new THREE.OctahedronGeometry(0.30), 0x00E5EE, 0, 1.95, 0);
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const sp = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.35, 4),
          new THREE.MeshLambertMaterial({ color: 0x7FFFD4 }));
        sp.position.set(Math.cos(angle)*0.20, 2.20, Math.sin(angle)*0.20);
        sp.rotation.z = Math.cos(angle)*0.5; sp.rotation.x = Math.sin(angle)*0.5;
        pg.add(sp);
      }
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.42, 4),
        new THREE.MeshLambertMaterial({ color: 0x7FFFD4 }));
      spike.position.set(0, 2.38, 0); pg.add(spike);
      const lLeg  = mk(new THREE.BoxGeometry(0.30, 0.78, 0.30), 0x008B8B, 0.20, 0.38, 0);
      const rLeg  = mk(new THREE.BoxGeometry(0.30, 0.78, 0.30), 0x008B8B, -0.20, 0.38, 0);
      const lArm  = mk(new THREE.BoxGeometry(0.24, 0.76, 0.24), 0x00CED1, 0.50, 1.26, 0);
      const rArm  = mk(new THREE.BoxGeometry(0.24, 0.76, 0.24), 0x00CED1, -0.50, 1.26, 0);
      const lShoe = mk(new THREE.BoxGeometry(0.32, 0.14, 0.46), 0x006666, 0.20, 0.04, 0.06);
      const rShoe = mk(new THREE.BoxGeometry(0.32, 0.14, 0.46), 0x006666, -0.20, 0.04, 0.06);
      return { lLeg, rLeg, lArm, rArm, lShoe, rShoe };
    }
  },
  stinkfly: {
    name: "Stinkfly", color: 0x9ACD32, accentColor: 0xFFFF00,
    emissive: 0, emissiveIntensity: 0,
    speed: 9, sprintMult: 1.6, jumpVel: 0, canFly: true, gravity: 0, scale: 1.0, label: "🪲",
    attackLabel: "SPIT", attackColor: 0xFFFF00,
    buildMesh: (pg, mk) => {
      mk(new THREE.BoxGeometry(0.70, 0.88, 0.40), 0x9ACD32, 0, 1.26, 0);
      mk(new THREE.BoxGeometry(0.60, 0.30, 0.36), 0x6B8E23, 0, 0.80, 0);
      mk(new THREE.SphereGeometry(0.30, 12, 8), 0xADFF2F, 0, 1.95, 0);
      mk(new THREE.SphereGeometry(0.13, 8, 6), 0xFF6600,  0.22, 1.96, 0.22);
      mk(new THREE.SphereGeometry(0.13, 8, 6), 0xFF6600, -0.22, 1.96, 0.22);
      const wingGeo = new THREE.PlaneGeometry(0.9, 0.38);
      const wingMat = new THREE.MeshLambertMaterial({ color: 0xEEFF88, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      for (const [wx, wy, wz, ry] of [[0.65,1.55,0,0.3],[0.55,1.25,0,0.2],[-0.65,1.55,0,-0.3],[-0.55,1.25,0,-0.2]]) {
        const w = new THREE.Mesh(wingGeo, wingMat);
        w.position.set(wx, wy, wz); w.rotation.y = ry; pg.add(w);
      }
      const stinger = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.35, 6),
        new THREE.MeshLambertMaterial({ color: 0x556B2F }));
      stinger.rotation.x = -Math.PI / 2; stinger.position.set(0, 1.05, 0.38); pg.add(stinger);
      const lLeg  = mk(new THREE.BoxGeometry(0.22, 0.70, 0.22), 0x6B8E23, 0.19, 0.38, 0);
      const rLeg  = mk(new THREE.BoxGeometry(0.22, 0.70, 0.22), 0x6B8E23, -0.19, 0.38, 0);
      const lArm  = mk(new THREE.BoxGeometry(0.18, 0.68, 0.18), 0x9ACD32, 0.46, 1.26, 0);
      const rArm  = mk(new THREE.BoxGeometry(0.18, 0.68, 0.18), 0x9ACD32, -0.46, 1.26, 0);
      const lShoe = mk(new THREE.BoxGeometry(0.26, 0.12, 0.40), 0x4B5320, 0.19, 0.04, 0.06);
      const rShoe = mk(new THREE.BoxGeometry(0.26, 0.12, 0.40), 0x4B5320, -0.19, 0.04, 0.06);
      return { lLeg, rLeg, lArm, rArm, lShoe, rShoe };
    }
  },
  ghostfreak: {
    name: "Ghostfreak", color: 0xC8C8C8, accentColor: 0xEEEEEE,
    emissive: 0, emissiveIntensity: 0,
    speed: 7, sprintMult: 1.5, jumpVel: 0, canFly: true, gravity: 0, scale: 1.0,
    transparent: true, label: "👻",
    attackLabel: "HAUNT", attackColor: 0xEEEEEE,
    buildMesh: (pg, mk) => {
      const ghostMat = (col) => new THREE.MeshLambertMaterial({ color: col, transparent: true, opacity: 0.55 });
      const gm = (geo, col, px, py, pz) => {
        const m = new THREE.Mesh(geo, ghostMat(col));
        m.position.set(px, py, pz); m.castShadow = false; pg.add(m); return m;
      };
      gm(new THREE.BoxGeometry(0.74, 0.92, 0.40), 0xC8C8C8, 0, 1.26, 0);
      gm(new THREE.BoxGeometry(0.68, 0.34, 0.38), 0xAAAAAA, 0, 0.80, 0);
      gm(new THREE.SphereGeometry(0.29, 12, 8), 0xDDDDDD, 0, 1.95, 0);
      gm(new THREE.SphereGeometry(0.15, 10, 8), 0xFF0000, 0, 1.97, 0.20);
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const wisp = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.01, 0.5, 5),
          new THREE.MeshLambertMaterial({ color: 0xAAAAAA, transparent: true, opacity: 0.4 }));
        wisp.position.set(Math.cos(angle)*0.18, 0.20, Math.sin(angle)*0.18);
        wisp.rotation.z = Math.cos(angle)*0.6;
        pg.add(wisp);
      }
      const lLeg  = gm(new THREE.BoxGeometry(0.28, 0.76, 0.28), 0xAAAAAA, 0.19, 0.38, 0);
      const rLeg  = gm(new THREE.BoxGeometry(0.28, 0.76, 0.28), 0xAAAAAA, -0.19, 0.38, 0);
      const lArm  = gm(new THREE.BoxGeometry(0.22, 0.74, 0.22), 0xC8C8C8, 0.48, 1.26, 0);
      const rArm  = gm(new THREE.BoxGeometry(0.22, 0.74, 0.22), 0xC8C8C8, -0.48, 1.26, 0);
      const lShoe = gm(new THREE.BoxGeometry(0.30, 0.14, 0.44), 0x888888, 0.19, 0.04, 0.06);
      const rShoe = gm(new THREE.BoxGeometry(0.30, 0.14, 0.44), 0x888888, -0.19, 0.04, 0.06);
      return { lLeg, rLeg, lArm, rArm, lShoe, rShoe };
    }
  },
  upgrade: {
    name: "Upgrade", color: 0x111111, accentColor: 0x00FF66,
    emissive: 0, emissiveIntensity: 0,
    speed: 8, sprintMult: 1.6, jumpVel: 10, canFly: false, gravity: -22, scale: 1.0, label: "🤖",
    attackLabel: "MORPH", attackColor: 0x00FF66,
    buildMesh: (pg, mk) => {
      mk(new THREE.BoxGeometry(0.74, 0.92, 0.40), 0x111111, 0, 1.26, 0);
      mk(new THREE.BoxGeometry(0.68, 0.34, 0.38), 0x0A0A0A, 0, 0.80, 0);
      mk(new THREE.SphereGeometry(0.29, 12, 8), 0x111111, 0, 1.95, 0);
      mk(new THREE.SphereGeometry(0.18, 10, 8), 0x00FF66, 0, 1.97, 0.20);
      mk(new THREE.SphereGeometry(0.08, 8, 6), 0x003311, 0, 1.97, 0.36);
      for (let i = 0; i < 4; i++) {
        const circ = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.04, 0.02),
          new THREE.MeshLambertMaterial({ color: 0x00FF66, emissive: 0x00AA44, emissiveIntensity: 0.6 }));
        circ.position.set(0, 1.0 + i*0.18, 0.21); pg.add(circ);
      }
      const lLeg  = mk(new THREE.BoxGeometry(0.28, 0.76, 0.28), 0x0A0A0A, 0.19, 0.38, 0);
      const rLeg  = mk(new THREE.BoxGeometry(0.28, 0.76, 0.28), 0x0A0A0A, -0.19, 0.38, 0);
      const lArm  = mk(new THREE.BoxGeometry(0.22, 0.74, 0.22), 0x111111, 0.48, 1.26, 0);
      const rArm  = mk(new THREE.BoxGeometry(0.22, 0.74, 0.22), 0x111111, -0.48, 1.26, 0);
      const lShoe = mk(new THREE.BoxGeometry(0.30, 0.14, 0.44), 0x050505, 0.19, 0.04, 0.06);
      const rShoe = mk(new THREE.BoxGeometry(0.30, 0.14, 0.44), 0x050505, -0.19, 0.04, 0.06);
      return { lLeg, rLeg, lArm, rArm, lShoe, rShoe };
    }
  },
  greymatter: {
    name: "Grey Matter", color: 0x808080, accentColor: 0xAAAAAA,
    emissive: 0, emissiveIntensity: 0,
    speed: 5, sprintMult: 1.3, jumpVel: 18, canFly: false, gravity: -22, scale: 0.45, label: "🧠",
    attackLabel: "ZAP", attackColor: 0xAAAAAA,
    buildMesh: (pg, mk) => {
      mk(new THREE.BoxGeometry(0.74, 0.92, 0.40), 0x808080, 0, 1.26, 0);
      mk(new THREE.BoxGeometry(0.68, 0.34, 0.38), 0x696969, 0, 0.80, 0);
      mk(new THREE.SphereGeometry(0.46, 12, 8), 0x909090, 0, 2.10, 0);
      mk(new THREE.SphereGeometry(0.14, 8, 6), 0xFF6600, 0.18, 2.08, 0.36);
      mk(new THREE.SphereGeometry(0.14, 8, 6), 0xFF6600, -0.18, 2.08, 0.36);
      const lLeg  = mk(new THREE.BoxGeometry(0.28, 0.76, 0.28), 0x696969, 0.19, 0.38, 0);
      const rLeg  = mk(new THREE.BoxGeometry(0.28, 0.76, 0.28), 0x696969, -0.19, 0.38, 0);
      const lArm  = mk(new THREE.BoxGeometry(0.22, 0.74, 0.22), 0x808080, 0.48, 1.26, 0);
      const rArm  = mk(new THREE.BoxGeometry(0.22, 0.74, 0.22), 0x808080, -0.48, 1.26, 0);
      const lShoe = mk(new THREE.BoxGeometry(0.30, 0.14, 0.44), 0x555555, 0.19, 0.04, 0.06);
      const rShoe = mk(new THREE.BoxGeometry(0.30, 0.14, 0.44), 0x555555, -0.19, 0.04, 0.06);
      return { lLeg, rLeg, lArm, rArm, lShoe, rShoe };
    }
  },
};

const ALIEN_KEYS = Object.keys(ALIENS);

// ── 8-Directional snapping ────────────────────────────────────────────────────
// Snap any angle to the nearest of 8 cardinal/diagonal directions
const DIRS_8 = Array.from({ length: 8 }, (_, i) => (i * Math.PI * 2) / 8);
const snapTo8Dir = (angle) => {
  // Normalize to [0, 2π)
  const a = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  let best = DIRS_8[0], bestDist = Infinity;
  for (const d of DIRS_8) {
    let diff = Math.abs(a - d);
    if (diff > Math.PI) diff = Math.PI * 2 - diff;
    if (diff < bestDist) { bestDist = diff; best = d; }
  }
  return best;
};

// Convert viewport-space delta → element/game-space delta
const toGame = (vdx, vdy, rotated) => rotated ? [vdy, -vdx] : [vdx, vdy];

// ── Animation state machine ───────────────────────────────────────────────────
// States: IDLE, WALK, RUN, JUMP, FALL, LAND, FLY, ATTACK

// ── GLB Model Config ──────────────────────────────────────────────────────────
// For aliens that use Mixamo GLB files, define their animation clip name mappings.
// Files go in: public/models/<alienKey>/
//   - T-pose/rigged mesh: character.glb  (with or without skin)
//   - Animations (separate files or embedded): idle.glb, walk.glb, run.glb, jump.glb, fall.glb, land.glb, attack.glb, fly.glb
//
// useGLB: true  → load GLB instead of buildMesh()
// withSkin: true → render the Mixamo mesh directly (fourarms)
// withSkin: false → apply skeleton to buildMesh() geometry (all others)
//
// Animation clip files per alien – the loader tries these paths.
// If a file is missing, it falls back to the procedural animation.
// Shared rig animation files (used by all non-skinned humanoid aliens)
const SHARED_ANIMS = {
  idle:    "./models/shared/Idle.glb",
  run:     "./models/shared/run.glb",
  jump:    "./models/shared/jump.glb",
  attack:  "./models/shared/punch1.glb",
  attack2: "./models/shared/punch2.glb",
  attack3: "./models/shared/punch3.glb",
  // walk/fall/land use procedural fallback (no shared file)
};

const GLB_CONFIG = {
  // ── Four Arms: skin + unique file naming (fa prefix) ─────────────────────
  fourarms: {
    useGLB: true, withSkin: true,
    model: "./models/fourarms/character.glb",
    anims: {
      walk:    "./models/fourarms/fawalk.glb",
      run:     "./models/fourarms/farun.glb",
      jump:    "./models/fourarms/fajump.glb",
      attack:  "./models/fourarms/fapunch1.glb",
      attack2: "./models/fourarms/fapunch2.glb",
      attack3: "./models/fourarms/fastrongpunch.glb",
      // idle/fall/land fall back to procedural (no fa-specific files)
    },
  },

  // ── XLR8: shared rig + unique speedup animation ───────────────────────────
  xlr8: {
    useGLB: true, withSkin: false,
    model: "./models/shared/Idle.glb",
    anims: {
      ...SHARED_ANIMS,
      speedup: "./models/xlr8/xlr8speedup.glb", // plays when sprint activates
    },
  },

  // ── All other humanoid aliens: shared rig, no skin ────────────────────────
  heatblast:   { useGLB: true, withSkin: false, model: "./models/shared/Idle.glb", anims: { ...SHARED_ANIMS } },
  diamondhead: { useGLB: true, withSkin: false, model: "./models/shared/Idle.glb", anims: { ...SHARED_ANIMS } },
  stinkfly:    { useGLB: true, withSkin: false, model: "./models/shared/Idle.glb", anims: { ...SHARED_ANIMS } },
  ghostfreak:  { useGLB: true, withSkin: false, model: "./models/shared/Idle.glb", anims: { ...SHARED_ANIMS } },
  upgrade:     { useGLB: true, withSkin: false, model: "./models/shared/Idle.glb", anims: { ...SHARED_ANIMS } },
  greymatter:  { useGLB: true, withSkin: false, model: "./models/shared/Idle.glb", anims: { ...SHARED_ANIMS } },
};

// Animation clip name → ANIM state mapping
const ANIM_CLIP_MAP = {
  idle: 0,   // ANIM.IDLE
  walk: 1,   // ANIM.WALK
  run:  2,   // ANIM.RUN
  jump: 3,   // ANIM.JUMP
  fall: 4,   // ANIM.FALL
  land: 5,   // ANIM.LAND
  fly:  6,   // ANIM.FLY
  attack: 7, // ANIM.ATTACK
};
const ANIM = { IDLE: 0, WALK: 1, RUN: 2, JUMP: 3, FALL: 4, LAND: 5, FLY: 6, ATTACK: 7 };

// ── Virtual Joystick ───────────────────────────────────────────────────────────
function VirtualJoystick({ onChange, stRef, style }) {
  const baseRef = useRef(null);
  const knobRef = useRef(null);
  const touchId = useRef(null);
  const MAX = 44;

  useEffect(() => {
    const el = baseRef.current;
    if (!el) return;
    const center = () => {
      const r = el.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    };
    const move = (tx, ty) => {
      const [cx, cy] = center();
      const vdx = tx - cx, vdy = ty - cy;
      let [dx, dy] = toGame(vdx, vdy, stRef?.current?.rotated);
      const d = Math.hypot(dx, dy);
      if (d > MAX) { dx = dx / d * MAX; dy = dy / d * MAX; }
      if (knobRef.current)
        knobRef.current.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      onChange(dx / MAX, dy / MAX);
    };
    const reset = () => {
      touchId.current = null;
      if (knobRef.current) knobRef.current.style.transform = "translate(-50%, -50%)";
      onChange(0, 0);
    };
    const onTS = (e) => { e.preventDefault(); e.stopPropagation(); if (touchId.current !== null) return; const t = e.changedTouches[0]; touchId.current = t.identifier; move(t.clientX, t.clientY); };
    const onTM = (e) => { e.preventDefault(); e.stopPropagation(); for (const t of e.changedTouches) if (t.identifier === touchId.current) move(t.clientX, t.clientY); };
    const onTE = (e) => { e.stopPropagation(); for (const t of e.changedTouches) if (t.identifier === touchId.current) reset(); };
    el.addEventListener("touchstart", onTS, { passive: false });
    el.addEventListener("touchmove", onTM, { passive: false });
    el.addEventListener("touchend", onTE);
    el.addEventListener("touchcancel", onTE);
    return () => {
      el.removeEventListener("touchstart", onTS);
      el.removeEventListener("touchmove", onTM);
      el.removeEventListener("touchend", onTE);
      el.removeEventListener("touchcancel", onTE);
    };
  }, [onChange]);

  return (
    <div ref={baseRef} style={{ position: "absolute", width: 118, height: 118, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.2)", touchAction: "none", ...style }}>
      <div ref={knobRef} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.28)", border: "2px solid rgba(255,255,255,0.55)", pointerEvents: "none" }} />
    </div>
  );
}

const rand = (a, b) => a + Math.random() * (b - a);

const THEME_SONGS = [
  "./songs/jegede.mp3", "./songs/yayo.mp3", "./songs/mydealer.mp3", 
];

// ── Main Game ─────────────────────────────────────────────────────────────────
export default function Ben10Game() {
  const containerRef = useRef(null);
  const [portrait, setPortrait] = useState(false);
  const [orientationLocked, setOrientLocked] = useState(false);
  const [selectedAlien, setSelectedAlien] = useState("heatblast");
  const [isFlying, setIsFlying] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [animState, setAnimState] = useState("IDLE");
  const [attackFlash, setAttackFlash] = useState(false);

  const audioRef = useRef(null);
  const trackIdxRef = useRef(0);
  const shuffledRef = useRef([]);

  useEffect(() => {
    const shuffle = (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    shuffledRef.current = shuffle(THEME_SONGS);
    trackIdxRef.current = 0;
    const audio = new Audio();
    audio.volume = 0.65;
    audio.preload = "auto";
    audioRef.current = audio;
    const playNext = () => {
      const songs = shuffledRef.current;
      audio.src = songs[trackIdxRef.current % songs.length];
      trackIdxRef.current++;
      if (trackIdxRef.current >= songs.length) {
        shuffledRef.current = shuffle(THEME_SONGS);
        trackIdxRef.current = 0;
      }
      setTimeout(() => { audio.play().catch(() => {}); }, 1000);
    };
    audio.addEventListener("ended", playNext);
    const startMusic = () => {
      if (audio.paused) playNext();
      document.removeEventListener("pointerdown", startMusic);
      document.removeEventListener("keydown", startMusic);
      document.removeEventListener("touchstart", startMusic);
    };
    document.addEventListener("pointerdown", startMusic);
    document.addEventListener("keydown", startMusic);
    document.addEventListener("touchstart", startMusic);
    const onVisible = () => {
      if (!document.hidden && audio.paused && audio.src) audio.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      audio.pause();
      audio.removeEventListener("ended", playNext);
      document.removeEventListener("pointerdown", startMusic);
      document.removeEventListener("keydown", startMusic);
      document.removeEventListener("touchstart", startMusic);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const st = useRef({
    mx: 0, mz: 0, sprint: false, jump: false,
    flyUp: false, flyDown: false,
    attack: false,
    camYaw: Math.PI, camPitch: 0.32,
    camTouches: {},
    rotated: false,
    alienKey: "heatblast",
    flyingActive: false,
    // animation state shared with render loop
    animState: ANIM.IDLE,
    attackTimer: 0,
    attackVariant: 0,
    landTimer: 0,
    wasOnGround: true,
  });

  const alienChangeRef = useRef(null);
  const animStateRef = useRef(ANIM.IDLE);

  const onLeft = useCallback((x, y) => { st.current.mx = x; st.current.mz = y; }, []);

  useEffect(() => {
    const check = () => setPortrait(window.innerWidth < window.innerHeight);
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => { window.removeEventListener("resize", check); window.removeEventListener("orientationchange", check); };
  }, []);

  useEffect(() => {
    const lock = async () => { try { await screen.orientation.lock("landscape"); setOrientLocked(true); } catch {} };
    lock();
    document.addEventListener("touchstart", lock, { once: true });
    document.addEventListener("click", lock, { once: true });
    return () => { document.removeEventListener("touchstart", lock); document.removeEventListener("click", lock); };
  }, []);

  const isRotated = portrait && !orientationLocked;
  useEffect(() => { st.current.rotated = isRotated; window.dispatchEvent(new Event("resize")); }, [isRotated]);

  useEffect(() => {
    st.current.alienKey = selectedAlien;
    st.current.flyingActive = false;
    setIsFlying(false);
    if (alienChangeRef.current) alienChangeRef.current(selectedAlien);
  }, [selectedAlien]);

  // ── Three.js setup ─────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const s = st.current;
    const W = container.clientWidth, H = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.cssText = "position:absolute;top:0;left:0;z-index:0;";
    container.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.FogExp2(0x8DC9E8, 0.0055);

    const camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 400);

    scene.add(new THREE.AmbientLight(0xfff8e8, 0.5));
    const sun = new THREE.DirectionalLight(0xFFF4D6, 1.5);
    sun.position.set(120, 180, 90); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -120, right: 120, top: 120, bottom: -120, far: 400 });
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x88BBFF, 0.3);
    fill.position.set(-60, 40, -80); scene.add(fill);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(800, 800),
      new THREE.MeshLambertMaterial({ color: 0x4a7c44 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

    const GRID = 50, RW = 11;
    const roadMat = new THREE.MeshLambertMaterial({ color: 0x222228 });
    const swMat = new THREE.MeshLambertMaterial({ color: 0x8a8878 });
    const markMat = new THREE.MeshLambertMaterial({ color: 0xFFFF88 });

    for (let i = -6; i <= 6; i++) {
      const p = i * GRID;
      const hr = new THREE.Mesh(new THREE.PlaneGeometry(800, RW), roadMat);
      hr.rotation.x = -Math.PI / 2; hr.position.set(0, 0.01, p); scene.add(hr);
      const vr = new THREE.Mesh(new THREE.PlaneGeometry(RW, 800), roadMat);
      vr.rotation.x = -Math.PI / 2; vr.position.set(p, 0.01, 0); scene.add(vr);
      for (const sg of [-1, 1]) {
        const hs = new THREE.Mesh(new THREE.PlaneGeometry(800, 2.8), swMat);
        hs.rotation.x = -Math.PI / 2; hs.position.set(0, 0.02, p + sg * (RW / 2 + 1.4)); scene.add(hs);
        const vs = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 800), swMat);
        vs.rotation.x = -Math.PI / 2; vs.position.set(p + sg * (RW / 2 + 1.4), 0.02, 0); scene.add(vs);
      }
      for (let d = -16; d <= 16; d++) {
        const dh = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 3.5), markMat);
        dh.rotation.x = -Math.PI / 2; dh.position.set(p, 0.025, d * GRID / 2); scene.add(dh);
        const dv = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.25), markMat);
        dv.rotation.x = -Math.PI / 2; dv.position.set(d * GRID / 2, 0.025, p); scene.add(dv);
      }
    }

    const buildingBoxes = [];
    const bColors = [0x607D8B, 0x78909C, 0x546E7A, 0x8D6E63, 0x6D4C41, 0xB0BEC5, 0x455A64, 0x4A148C, 0x1A237E, 0x33691E, 0x37474F];
    for (let bx = -6; bx <= 6; bx++) {
      for (let bz = -6; bz <= 6; bz++) {
        const cx = bx * GRID, cz = bz * GRID;
        for (let k = 0; k < Math.ceil(rand(1, 4)); k++) {
          const w = rand(7, 22), d = rand(7, 22), h = rand(6, 58);
          const px = cx + rand(-17, 17), pz = cz + rand(-17, 17);
          const col = bColors[Math.floor(Math.random() * bColors.length)];
          const bm = new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
            new THREE.MeshLambertMaterial({ color: col }));
          bm.position.set(px, h / 2, pz); bm.castShadow = true; bm.receiveShadow = true; scene.add(bm);
          const rm = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.6, d + 0.4),
            new THREE.MeshLambertMaterial({ color: 0x1a1a22 }));
          rm.position.set(px, h + 0.3, pz); scene.add(rm);
          if (Math.random() > 0.55) {
            const ac = new THREE.Mesh(new THREE.BoxGeometry(rand(1,3),rand(0.8,2),rand(1,3)),
              new THREE.MeshLambertMaterial({ color: 0x9E9E9E }));
            ac.position.set(px + rand(-w/4,w/4), h + rand(0.8,1.6), pz + rand(-d/4,d/4));
            scene.add(ac);
          }
          buildingBoxes.push({ cx: px, cy: h / 2, cz: pz, hw: w / 2, hh: h / 2, hd: d / 2, top: h });
        }
      }
    }

    const R = 0.7, PH = 2.2;
    const resolveBuildings = (pos, velY, onGround) => {
      let floorY = 0, hitCeiling = false;
      for (const b of buildingBoxes) {
        const dx = pos.x - b.cx;
        const dy = pos.y + PH / 2 - b.cy;
        const dz = pos.z - b.cz;
        const overlapX = (b.hw + R) - Math.abs(dx);
        const overlapY = (b.hh + PH / 2) - Math.abs(dy);
        const overlapZ = (b.hd + R) - Math.abs(dz);
        if (overlapX <= 0 || overlapY <= 0 || overlapZ <= 0) continue;
        const minO = Math.min(overlapX, overlapY, overlapZ);
        if (minO === overlapY) {
          if (dy > 0) { floorY = Math.max(floorY, b.top); }
          else { hitCeiling = true; }
        } else if (minO === overlapX) {
          pos.x += overlapX * Math.sign(dx);
        } else {
          pos.z += overlapZ * Math.sign(dz);
        }
      }
      return { floorY, hitCeiling };
    };

    const poleMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const bulbMat = new THREE.MeshLambertMaterial({ color: 0xFFFF99, emissive: 0xFFFF99, emissiveIntensity: 0.8 });
    const addLamp = (x, z) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 5.2, 6), poleMat);
      pole.position.set(x, 2.6, z); scene.add(pole);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 6), poleMat);
      arm.rotation.z = Math.PI / 2; arm.position.set(x + 0.9, 5.3, z); scene.add(arm);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 5), bulbMat);
      bulb.position.set(x + 1.8, 5.3, z); scene.add(bulb);
    };
    for (let i = -6; i <= 6; i++) {
      for (const sg of [-1, 1]) {
        const p = i * GRID;
        addLamp(p + RW / 2 + 3, sg * (GRID / 2 - 6));
        addLamp(sg * (GRID / 2 - 6), p + RW / 2 + 3);
      }
    }

    const carCols = [0xE53935, 0x1565C0, 0xFFD600, 0x2E7D32, 0xF5F5F5, 0x424242, 0xFF6F00, 0xAD1457];
    const makeCar = (x, z, ry) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 4.6),
        new THREE.MeshLambertMaterial({ color: carCols[Math.floor(Math.random() * carCols.length)] }));
      body.position.y = 0.55; body.castShadow = true; g.add(body);
      const cab = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.82, 2.5),
        new THREE.MeshLambertMaterial({ color: 0x1a1a28 }));
      cab.position.set(0, 1.41, -0.25); g.add(cab);
      const wGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 10);
      const wMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
      for (const [wx, wz] of [[-1.1,-1.5],[1.1,-1.5],[-1.1,1.5],[1.1,1.5]]) {
        const wh = new THREE.Mesh(wGeo, wMat);
        wh.rotation.z = Math.PI / 2; wh.position.set(wx, 0.36, wz); g.add(wh);
      }
      g.position.set(x, 0.06, z); g.rotation.y = ry; scene.add(g);
    };
    for (let i = -6; i <= 6; i++) {
      const p = i * GRID;
      makeCar(p + 4.2, rand(-250, 250), 0);
      makeCar(p - 4.2, rand(-250, 250), Math.PI);
      makeCar(rand(-250, 250), p + 4.2, Math.PI / 2);
      makeCar(rand(-250, 250), p - 4.2, -Math.PI / 2);
    }

    // ── Player Group ──────────────────────────────────────────────────────────
    const pg = new THREE.Group(); scene.add(pg);

    const mk = (geo, col, px, py, pz) => {
      const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: col }));
      m.position.set(px, py, pz); m.castShadow = true; pg.add(m); return m;
    };

    // Attack effect particles
    const attackParticles = [];
    const trailParticles = [];
    const trailGeo = new THREE.SphereGeometry(0.1, 4, 3);

    let limbs = null;


    // ── GLB / Animation Mixer system ──────────────────────────────────────────
    // Tracks loaded GLB models and their AnimationMixers per alien key
    const glbMixers = {};      // { alienKey: THREE.AnimationMixer }
    const glbClips  = {};      // { alienKey: { idle, walk, run, ... } AnimationClip }
    const glbActions = {};     // { alienKey: { idle, walk, ... } AnimationAction }
    const glbMeshes = {};      // { alienKey: THREE.Group } (the skinned model root)
    let   activeGLBKey = null; // which alien's GLB is currently active

    // Dynamically import GLTFLoader only when needed
    let GLTFLoader = null;
    const getGLTFLoader = async () => {
      if (GLTFLoader) return GLTFLoader;
      const mod = await import("three/examples/jsm/loaders/GLTFLoader.js");
      GLTFLoader = mod.GLTFLoader;
      return GLTFLoader;
    };

    // Load a single GLB file and return its scene + clips
    const loadGLB = async (url) => {
      const Loader = await getGLTFLoader();
      return new Promise((resolve, reject) => {
        new Loader().load(url, resolve, undefined, reject);
      });
    };

    // Load all GLBs for a given alien key (non-blocking, best-effort)
    const loadAlienGLB = async (key) => {
      const cfg = GLB_CONFIG[key];
      if (!cfg || glbMixers[key]) return; // already loaded or not configured

      try {
        // Load base character model
        const gltf = await loadGLB(cfg.model);
        const root = gltf.scene;
        root.visible = false; // hide until activated
        root.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
        scene.add(root);
        glbMeshes[key] = root;

        // Create mixer on the root
        const mixer = new THREE.AnimationMixer(root);
        glbMixers[key] = mixer;
        glbClips[key]   = {};
        glbActions[key] = {};

        // Load animation clips (from the character file first)
        for (const clip of gltf.animations) {
          const animKey = guessAnimName(clip.name);
          if (animKey) {
            glbClips[key][animKey] = clip;
            glbActions[key][animKey] = mixer.clipAction(clip);
          }
        }

        // Load per-anim GLB files
        for (const [animKey, url] of Object.entries(cfg.anims || {})) {
          if (glbClips[key][animKey]) continue; // already got it from character file
          try {
            const ag = await loadGLB(url);
            if (ag.animations.length > 0) {
              const clip = ag.animations[0];
              // Retarget to our mixer's root if needed
              const retargeted = THREE.AnimationClip.parse(THREE.AnimationClip.toJSON(clip));
              glbClips[key][animKey] = retargeted;
              glbActions[key][animKey] = mixer.clipAction(retargeted);
            }
          } catch {
            // Anim file missing – will fall back to procedural for this state
          }
        }

        // If this alien is already selected, activate it now
        if (s.alienKey === key) activateGLB(key);

      } catch {
        // Model file missing – alien stays procedural
      }
    };

    // Guess the animation name from a Mixamo/arbitrary clip name
    const guessAnimName = (clipName) => {
      const n = clipName.toLowerCase();
      if (n.includes("idle"))   return "idle";
      if (n.includes("walk"))   return "walk";
      if (n.includes("run"))    return "run";
      if (n.includes("sprint")) return "run";
      if (n.includes("jump") || n.includes("leap")) return "jump";
      if (n.includes("fall") || n.includes("falling")) return "fall";
      if (n.includes("land"))   return "land";
      if (n.includes("fly") || n.includes("hover") || n.includes("float")) return "fly";
      if (n.includes("punch") || n.includes("attack") || n.includes("hit") || n.includes("strike")) return "attack";
      return null;
    };

    // Activate a GLB model for display, hide procedural pg children
    const activateGLB = (key) => {
      if (!glbMeshes[key]) return;
      const cfg = GLB_CONFIG[key];

      // Hide previous GLB
      if (activeGLBKey && glbMeshes[activeGLBKey]) {
        glbMeshes[activeGLBKey].visible = false;
      }
      activeGLBKey = key;

      const root = glbMeshes[key];

      if (cfg.withSkin) {
        // Show GLB mesh, hide the procedural pg geometry (keep pg as physics anchor)
        root.visible = true;
        pg.children.forEach(c => { c.visible = false; });
      }
      // withSkin: false → GLB loads for animation clips only; procedural boxes stay visible
      // Scale the GLB root to match alien scale
      const alien = ALIENS[key];
      root.scale.setScalar(alien.scale * 0.01); // Mixamo exports at 100x scale typically
    };

    // Deactivate GLB, restore procedural geometry
    const deactivateGLB = (key) => {
      if (glbMeshes[key]) glbMeshes[key].visible = false;
      pg.children.forEach(c => { c.visible = true; });
      activeGLBKey = null;
    };

    // Switch animation clip on a GLB mixer
    let currentGLBAnimKey = null;
    const playGLBClip = (alienKey, animKey, loop = true) => {
      const actions = glbActions[alienKey];
      if (!actions) return false;
      // Try exact match, then "attack" for attack2/attack3
      const key = actions[animKey] ? animKey : (animKey.startsWith("attack") ? "attack" : null);
      if (!key || !actions[key]) return false;
      if (currentGLBAnimKey === key) return true;

      // Fade out current
      if (currentGLBAnimKey && actions[currentGLBAnimKey]) {
        actions[currentGLBAnimKey].fadeOut(0.2);
      }
      // Fade in new
      const action = actions[key];
      action.reset().setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
      action.clampWhenFinished = !loop;
      action.fadeIn(0.2).play();
      currentGLBAnimKey = key;
      return true;
    };

    // Map ANIM state → clip name
    const ANIM_TO_CLIP = ["idle","walk","run","jump","fall","land","fly","attack"];
    const buildAlien = (key) => {
      while (pg.children.length > 0) pg.remove(pg.children[0]);
      trailParticles.forEach(p => scene.remove(p));
      trailParticles.length = 0;
      attackParticles.forEach(p => scene.remove(p));
      attackParticles.length = 0;
      const alien = ALIENS[key];
      pg.scale.setScalar(alien.scale);
      limbs = alien.buildMesh(pg, mk);
    };

    buildAlien("heatblast");

    alienChangeRef.current = (key) => { buildAlien(key); };

    // Upgraded alienChange: handles both GLB and procedural
    alienChangeRef.current = (key) => {
      // Deactivate previous GLB if any
      if (activeGLBKey) deactivateGLB(activeGLBKey);
      currentGLBAnimKey = null;

      // Rebuild procedural mesh
      buildAlien(key);

      // Try to activate GLB (may already be loaded)
      const cfg = GLB_CONFIG[key];
      if (cfg) {
        if (glbMeshes[key]) {
          activateGLB(key);
        } else {
          // Kick off background load
          loadAlienGLB(key);
        }
      }
    };

    // Kick off background loading of all configured GLB aliens
    for (const key of Object.keys(GLB_CONFIG)) {
      loadAlienGLB(key);
    }

    // ── Player state ──────────────────────────────────────────────────────────
    const player = {
      pos: new THREE.Vector3(5, 0, 5),
      rot: 0,          // current Y rotation (smooth)
      snappedRot: 0,   // 8-dir snapped rotation (for sprite-like facing)
      animT: 0,
      velY: 0,
      onGround: true,
      flyY: 0,
    };

    const keys = {};
    const onKD = (e) => {
      keys[e.code] = true;
      if (e.code === "Space") {
        const alien = ALIENS[s.alienKey];
        if (alien.canFly) {
          s.flyingActive = !s.flyingActive;
          setIsFlying(s.flyingActive);
        } else if (player.onGround) {
          player.velY = alien.jumpVel;
          player.onGround = false;
        }
      }
      // Attack on F key
      if (e.code === "KeyF") { s.attack = true; }
    };
    const onKU = (e) => {
      keys[e.code] = false;
      if (e.code === "KeyF") { s.attack = false; }
    };
    window.addEventListener("keydown", onKD);
    window.addEventListener("keyup", onKU);

    const onTS = (e) => { for (const t of e.changedTouches) s.camTouches[t.identifier] = { lx: t.clientX, ly: t.clientY }; };
    const onTM = (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        const prev = s.camTouches[t.identifier];
        if (!prev) continue;
        const vdx = t.clientX - prev.lx, vdy = t.clientY - prev.ly;
        const [gdx, gdy] = toGame(vdx, vdy, s.rotated);
        s.camYaw -= gdx * 0.004;
        s.camPitch = Math.max(0.05, Math.min(1.1, s.camPitch + gdy * 0.004));
        prev.lx = t.clientX; prev.ly = t.clientY;
      }
    };
    const onTE = (e) => { for (const t of e.changedTouches) delete s.camTouches[t.identifier]; };
    container.addEventListener("touchstart", onTS, { passive: true });
    container.addEventListener("touchmove", onTM, { passive: false });
    container.addEventListener("touchend", onTE);
    container.addEventListener("touchcancel", onTE);

    let mDown = false, mLX = 0, mLY = 0;
    const onMD = (e) => { mDown = true; mLX = e.clientX; mLY = e.clientY; };
    const onMM = (e) => {
      if (!mDown) return;
      s.camYaw -= (e.clientX - mLX) * 0.004;
      s.camPitch = Math.max(0.05, Math.min(1.1, s.camPitch + (e.clientY - mLY) * 0.004));
      mLX = e.clientX; mLY = e.clientY;
    };
    const onMU = () => { mDown = false; };
    container.addEventListener("mousedown", onMD);
    container.addEventListener("mousemove", onMM);
    container.addEventListener("mouseup", onMU);
    container.addEventListener("contextmenu", (e) => e.preventDefault());

    // ── Spawn attack effect ───────────────────────────────────────────────────
    const spawnAttackEffect = (alienKey) => {
      const alien = ALIENS[alienKey];
      const col = alien.attackColor;
      const pGeo = new THREE.SphereGeometry(0.15, 5, 4);
      const count = (alienKey === "fourarms") ? 8 : 5;
      for (let i = 0; i < count; i++) {
        const p = new THREE.Mesh(pGeo,
          new THREE.MeshLambertMaterial({ color: col, emissive: col, emissiveIntensity: 0.8, transparent: true, opacity: 0.9 }));
        const angle = (i / count) * Math.PI * 2;
        p.position.copy(pg.position);
        p.position.y += 1.2;
        p.userData.vel = new THREE.Vector3(
          Math.cos(angle) * 3.5,
          rand(1, 3),
          Math.sin(angle) * 3.5
        );
        p.userData.life = 1.0;
        scene.add(p);
        attackParticles.push(p);
      }
    };

    // ── Animation loop ────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      const alien = ALIENS[s.alienKey];

      if (keys["KeyQ"]) s.camYaw += dt * 1.8;
      if (keys["KeyE"]) s.camYaw -= dt * 1.8;

      let mx = s.mx, mz = s.mz;
      if (keys["KeyW"] || keys["ArrowUp"]) mz -= 1;
      if (keys["KeyS"] || keys["ArrowDown"]) mz += 1;
      if (keys["KeyA"] || keys["ArrowLeft"]) mx -= 1;
      if (keys["KeyD"] || keys["ArrowRight"]) mx += 1;

      const mag = Math.hypot(mx, mz);
      if (mag > 1) { mx /= mag; mz /= mag; }
      const sprint = keys["ShiftLeft"] || s.sprint;
      const spd = alien.speed * (sprint ? alien.sprintMult : 1.0);
      const moving = mag > 0.05;

      // ── Attack timer ────────────────────────────────────────────────────────
      const attacking = s.attackTimer > 0;
      if (s.attack && s.attackTimer <= 0) {
        s.attackTimer = 0.55; // 0.55s attack window
        // Cycle through punch variants: attack → attack2 → attack3 → attack → ...
        s.attackVariant = ((s.attackVariant || 0) % 3) + 1;
        spawnAttackEffect(s.alienKey);
        // Flash the HUD
        setAttackFlash(true);
        setTimeout(() => setAttackFlash(false), 300);
      }
      if (s.attackTimer > 0) s.attackTimer -= dt;

      // Update attack particles
      for (let i = attackParticles.length - 1; i >= 0; i--) {
        const p = attackParticles[i];
        p.userData.life -= dt * 1.8;
        p.position.addScaledVector(p.userData.vel, dt);
        p.userData.vel.y -= 6 * dt;
        p.material.opacity = Math.max(0, p.userData.life);
        p.scale.setScalar(p.userData.life * 1.2);
        if (p.userData.life <= 0) {
          scene.remove(p);
          attackParticles.splice(i, 1);
        }
      }

      // ── Horizontal movement ─────────────────────────────────────────────────
      if (moving && !attacking) {
        const sinY = Math.sin(s.camYaw), cosY = Math.cos(s.camYaw);
        const mvX = cosY * mx + sinY * mz;
        const mvZ = -sinY * mx + cosY * mz;
        const mvLen = Math.hypot(mvX, mvZ);
        if (mvLen > 0.01) {
          const nx = mvX / mvLen, nz = mvZ / mvLen;
          const targetAngle = Math.atan2(nx, nz);

          // 8-direction snap: snap the facing to nearest 45° increment
          const snapped = snapTo8Dir(targetAngle);
          player.snappedRot = snapped;

          // Smooth rotation toward snapped direction
          let diff = snapped - player.rot;
          while (diff > Math.PI) diff -= 2 * Math.PI;
          while (diff < -Math.PI) diff += 2 * Math.PI;
          player.rot += diff * Math.min(1, dt * 18); // fast snap-to

          player.pos.x += nx * mag * spd * dt;
          player.pos.z += nz * mag * spd * dt;
        }
      }

      // Attack: player freezes in place but arms swing
      if (attacking) {
        // Lock position, just animate arms outward
      }

      // ── Vertical physics ────────────────────────────────────────────────────
      const isFlyer = alien.canFly && s.flyingActive;
      if (isFlyer) {
        let vertInput = 0;
        if (s.flyUp   || keys["Space"])        vertInput =  1;
        if (s.flyDown || keys["ControlLeft"])  vertInput = -1;
        player.velY = vertInput * 10;
        player.pos.y += player.velY * dt;
      } else {
        if (s.jump && player.onGround) {
          player.velY = alien.jumpVel;
          player.onGround = false;
          s.jump = false;
        }
        player.velY += alien.gravity * dt;
        player.pos.y += player.velY * dt;
      }

      // ── Collision ───────────────────────────────────────────────────────────
      const wasOnGround = s.wasOnGround;
      if (s.alienKey !== "ghostfreak") {
        const { floorY, hitCeiling } = resolveBuildings(player.pos, player.velY, player.onGround);
        if (player.pos.y <= floorY) {
          player.pos.y = floorY;
          player.velY = 0;
          player.onGround = true;
        } else {
          if (player.pos.y > floorY + 0.05) player.onGround = false;
        }
        if (hitCeiling && player.velY > 0) player.velY = 0;
      } else {
        if (player.pos.y <= 0) { player.pos.y = 0; player.velY = 0; player.onGround = true; }
        else if (player.pos.y > 0.05) player.onGround = false;
      }
      if (player.pos.y < 0) { player.pos.y = 0; player.velY = 0; player.onGround = true; }

      // Detect just-landed
      const justLanded = !wasOnGround && player.onGround;
      if (justLanded) s.landTimer = 0.18;
      if (s.landTimer > 0) s.landTimer -= dt;
      s.wasOnGround = player.onGround;

      // ── Animation state machine ─────────────────────────────────────────────
      let newAnimState = ANIM.IDLE;
      if (attacking)                                     newAnimState = ANIM.ATTACK;
      else if (isFlyer)                                  newAnimState = ANIM.FLY;
      else if (s.landTimer > 0)                          newAnimState = ANIM.LAND;
      else if (!player.onGround && player.velY > 0)     newAnimState = ANIM.JUMP;
      else if (!player.onGround && player.velY <= 0)    newAnimState = ANIM.FALL;
      else if (moving && sprint)                         newAnimState = ANIM.RUN;
      else if (moving)                                   newAnimState = ANIM.WALK;
      else                                               newAnimState = ANIM.IDLE;

      s.animState = newAnimState;

      // Surface animState to React UI (throttled via ref compare)
      if (newAnimState !== animStateRef.current) {
        animStateRef.current = newAnimState;
        const names = ["IDLE","WALK","RUN","JUMP","FALL","LAND","FLY","ATTACK"];
        setAnimState(names[newAnimState]);
      }

      // ── Apply animations to limbs ───────────────────────────────────────────
      if (limbs) {
        const { lLeg, rLeg, lArm, rArm, lShoe, rShoe, extra } = limbs;

        // Helper to smoothly return a value to target
        const lerp = (a, b, t) => a + (b - a) * t;
        const lerpRot = dt * 14;

        switch (newAnimState) {
          case ANIM.IDLE: {
            // Subtle breathing bob on arms
            const breathe = Math.sin(elapsed * 1.8) * 0.06;
            if (lArm) lArm.rotation.x = lerp(lArm.rotation.x, breathe, lerpRot);
            if (rArm) rArm.rotation.x = lerp(rArm.rotation.x, -breathe, lerpRot);
            if (lLeg) lLeg.rotation.x = lerp(lLeg.rotation.x, 0, lerpRot);
            if (rLeg) rLeg.rotation.x = lerp(rLeg.rotation.x, 0, lerpRot);
            if (extra) { extra.forEach(a => a.rotation.x = lerp(a.rotation.x, 0, lerpRot)); }
            if (lShoe) lShoe.position.z = 0.06;
            if (rShoe) rShoe.position.z = 0.06;
            pg.position.y = player.pos.y + Math.sin(elapsed * 1.8) * 0.03;
            break;
          }
          case ANIM.WALK: {
            player.animT += dt * 10;
            const sw = Math.sin(player.animT) * 0.55;
            if (lLeg) lLeg.rotation.x = sw;
            if (rLeg) rLeg.rotation.x = -sw;
            if (lArm) lArm.rotation.x = -sw * 0.42;
            if (rArm) rArm.rotation.x = sw * 0.42;
            if (extra) { extra[0].rotation.x = sw * 0.3; extra[1].rotation.x = -sw * 0.3; }
            if (lShoe) lShoe.position.z = 0.06 + Math.sin(player.animT) * 0.12;
            if (rShoe) rShoe.position.z = 0.06 - Math.sin(player.animT) * 0.12;
            pg.position.y = player.pos.y + Math.abs(Math.sin(player.animT * 2)) * 0.07;
            break;
          }
          case ANIM.RUN: {
            player.animT += dt * 16;
            const sw = Math.sin(player.animT) * 0.82;
            if (lLeg) lLeg.rotation.x = sw;
            if (rLeg) rLeg.rotation.x = -sw;
            if (lArm) lArm.rotation.x = -sw * 0.65;
            if (rArm) rArm.rotation.x = sw * 0.65;
            if (extra) { extra[0].rotation.x = sw * 0.5; extra[1].rotation.x = -sw * 0.5; }
            if (lShoe) lShoe.position.z = 0.06 + Math.sin(player.animT) * 0.18;
            if (rShoe) rShoe.position.z = 0.06 - Math.sin(player.animT) * 0.18;
            pg.position.y = player.pos.y + Math.abs(Math.sin(player.animT * 2)) * 0.12;
            // Lean forward when running
            pg.rotation.x = lerp(pg.rotation.x, -0.12, dt * 8);
            // XLR8 blur trail
            if (s.alienKey === "xlr8") {
              const tp = new THREE.Mesh(trailGeo,
                new THREE.MeshLambertMaterial({ color: 0x003AFF, transparent: true, opacity: 0.5 }));
              tp.position.copy(pg.position); tp.position.y += 1.0;
              scene.add(tp); trailParticles.push(tp);
              if (trailParticles.length > 12) scene.remove(trailParticles.shift());
              trailParticles.forEach((p, i) => { p.material.opacity = (i / trailParticles.length) * 0.4; });
            }
            break;
          }
          case ANIM.JUMP: {
            // Arms flung up, legs tucked
            if (lArm) lArm.rotation.x = lerp(lArm.rotation.x, -1.1, lerpRot);
            if (rArm) rArm.rotation.x = lerp(rArm.rotation.x, -1.1, lerpRot);
            if (lLeg) lLeg.rotation.x = lerp(lLeg.rotation.x, -0.55, lerpRot);
            if (rLeg) rLeg.rotation.x = lerp(rLeg.rotation.x, -0.55, lerpRot);
            if (extra) { extra[0].rotation.x = lerp(extra[0].rotation.x, -0.4, lerpRot); extra[1].rotation.x = lerp(extra[1].rotation.x, -0.4, lerpRot); }
            pg.rotation.x = lerp(pg.rotation.x, 0.08, dt * 8); // slight back lean
            pg.position.y = player.pos.y;
            break;
          }
          case ANIM.FALL: {
            // Arms out wide, legs down
            if (lArm) lArm.rotation.x = lerp(lArm.rotation.x, 0.6, lerpRot);
            if (rArm) rArm.rotation.x = lerp(rArm.rotation.x, 0.6, lerpRot);
            if (lLeg) lLeg.rotation.x = lerp(lLeg.rotation.x, 0.3, lerpRot);
            if (rLeg) rLeg.rotation.x = lerp(rLeg.rotation.x, 0.3, lerpRot);
            if (extra) { extra[0].rotation.x = lerp(extra[0].rotation.x, 0.4, lerpRot); extra[1].rotation.x = lerp(extra[1].rotation.x, 0.4, lerpRot); }
            pg.rotation.x = lerp(pg.rotation.x, -0.08, dt * 8);
            pg.position.y = player.pos.y;
            break;
          }
          case ANIM.LAND: {
            // Crouching squat: legs out, arms forward
            if (lArm) lArm.rotation.x = lerp(lArm.rotation.x, 0.8, lerpRot * 2);
            if (rArm) rArm.rotation.x = lerp(rArm.rotation.x, 0.8, lerpRot * 2);
            if (lLeg) lLeg.rotation.x = lerp(lLeg.rotation.x, 0.45, lerpRot * 2);
            if (rLeg) rLeg.rotation.x = lerp(rLeg.rotation.x, 0.45, lerpRot * 2);
            // Squash on Y briefly
            pg.scale.y = lerp(pg.scale.y, 0.72, dt * 22);
            pg.position.y = player.pos.y;
            break;
          }
          case ANIM.FLY: {
            // Float hover with arm wing pose
            if (lArm) lArm.rotation.x = lerp(lArm.rotation.x, -0.5, lerpRot);
            if (rArm) rArm.rotation.x = lerp(rArm.rotation.x, -0.5, lerpRot);
            if (lLeg) lLeg.rotation.x = lerp(lLeg.rotation.x, 0.2, lerpRot);
            if (rLeg) rLeg.rotation.x = lerp(rLeg.rotation.x, 0.2, lerpRot);
            pg.position.y = player.pos.y + Math.sin(elapsed * 3) * 0.08;
            pg.rotation.z = Math.sin(elapsed * 2) * 0.05;
            break;
          }
          case ANIM.ATTACK: {
            const t = s.attackTimer; // counts down from 0.55 to 0
            const phase = 1.0 - (t / 0.55); // 0→1 over attack
            // Phase 0–0.3: wind-up (pull arms back)
            // Phase 0.3–0.65: punch forward
            // Phase 0.65–1.0: recover
            let armAngle, legAngle;
            if (phase < 0.3) {
              const p = phase / 0.3;
              armAngle = -0.8 * p; // pull back
              legAngle = 0.2 * p;
            } else if (phase < 0.65) {
              const p = (phase - 0.3) / 0.35;
              armAngle = -0.8 + 2.2 * p; // punch forward
              legAngle = 0.2 - 0.3 * p;
            } else {
              const p = (phase - 0.65) / 0.35;
              armAngle = 1.4 - 1.4 * p; // return
              legAngle = -0.1 + 0.1 * p;
            }
            // Alternate L/R on each attack alternation
            if (lArm) lArm.rotation.x = armAngle;
            if (rArm) rArm.rotation.x = -armAngle * 0.5;
            if (lLeg) lLeg.rotation.x = legAngle;
            if (rLeg) rLeg.rotation.x = -legAngle;
            // Twist body into the punch
            pg.rotation.y = player.rot + Math.sin(phase * Math.PI) * 0.22;
            if (extra) { extra[0].rotation.x = armAngle * 0.8; extra[1].rotation.x = -armAngle * 0.8; }
            pg.position.y = player.pos.y + Math.sin(phase * Math.PI) * 0.1;
            break;
          }
          default: break;
        }

        // Restore Y scale when not landing
        if (newAnimState !== ANIM.LAND) {
          pg.scale.y = lerp(pg.scale.y, alien.scale, dt * 10);
        }

        // Restore X rotation when not running/jumping/falling
        if (newAnimState !== ANIM.RUN && newAnimState !== ANIM.JUMP && newAnimState !== ANIM.FALL) {
          if (newAnimState !== ANIM.ATTACK) {
            pg.rotation.x = lerp(pg.rotation.x || 0, 0, dt * 8);
          }
        }
      }

      // XLR8 trail fade when stopped
      if (newAnimState !== ANIM.RUN) {
        trailParticles.forEach(p => { p.material.opacity *= 0.85; });
      }

      // ── 8-dir snapped rotation applied to player group ─────────────────────
      if (newAnimState !== ANIM.ATTACK) {
        pg.rotation.y = player.rot;
      }

      pg.position.x = player.pos.x;
      pg.position.z = player.pos.z;

      // Camera
      const camDist = 6.5 * (alien.scale || 1.0);

      // ── GLB mixer update + clip switching ────────────────────────────────────
      // If this alien has a loaded GLB, update its mixer and drive animation clips.
      // The procedural limb animations above still run but the GLB mesh is on top.
      if (activeGLBKey === s.alienKey) {
        const mixer = glbMixers[s.alienKey];
        if (mixer) {
          mixer.update(dt);
          // Sync GLB position/rotation to the procedural player group
          const root = glbMeshes[s.alienKey];
          if (root) {
            root.position.copy(pg.position);
            root.rotation.y = pg.rotation.y;
            root.rotation.x = pg.rotation.x;
          }
          // Pick clip name — attack cycles through variants, XLR8 sprint triggers speedup
          let clipName = ANIM_TO_CLIP[newAnimState];
          if (newAnimState === ANIM.ATTACK) {
            // Cycle: 1→"attack", 2→"attack2", 3→"attack3"
            const v = s.attackVariant || 1;
            clipName = v === 1 ? "attack" : `attack${v}`;
          } else if (s.alienKey === "xlr8" && newAnimState === ANIM.RUN && sprint) {
            // XLR8 speed boost: play speedup clip instead of run when sprinting
            clipName = "speedup";
          }
          const isLooping = newAnimState !== ANIM.LAND && newAnimState !== ANIM.ATTACK;
          playGLBClip(s.alienKey, clipName, isLooping);
        }
      }

      const tCam = new THREE.Vector3(
        player.pos.x + Math.sin(s.camYaw) * camDist * Math.cos(s.camPitch),
        player.pos.y + 1.65 * (alien.scale || 1.0) + Math.sin(s.camPitch) * camDist,
        player.pos.z + Math.cos(s.camYaw) * camDist * Math.cos(s.camPitch)
      );
      camera.position.lerp(tCam, 0.11);
      camera.lookAt(player.pos.x, player.pos.y + 1.4 * (alien.scale || 1.0), player.pos.z);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const W = container.clientWidth, H = container.clientHeight;
      renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      alienChangeRef.current = null;
      window.removeEventListener("keydown", onKD);
      window.removeEventListener("keyup", onKU);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("touchstart", onTS);
      container.removeEventListener("touchmove", onTM);
      container.removeEventListener("touchend", onTE);
      container.removeEventListener("touchcancel", onTE);
      container.removeEventListener("mousedown", onMD);
      container.removeEventListener("mousemove", onMM);
      container.removeEventListener("mouseup", onMU);
      // Dispose GLB mixers
      Object.values(glbMixers).forEach(m => m.stopAllAction());
      Object.values(glbMeshes).forEach(m => scene.remove(m));
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  const stopEvt = (e) => e.stopPropagation();
  const alien = ALIENS[selectedAlien];
  const accentHex = "#" + alien.accentColor.toString(16).padStart(6, "0");
  const colorHex  = "#" + alien.color.toString(16).padStart(6, "0");

  const containerStyle = isRotated ? {
    position: "fixed", top: "50%", left: "50%",
    width: "100vh", height: "100vw",
    transform: "translate(-50%, -50%) rotate(90deg)",
    overflow: "hidden", background: "#000",
    touchAction: "none", userSelect: "none",
  } : {
    position: "fixed", top: 0, left: 0,
    width: "100vw", height: "100vh",
    overflow: "hidden", background: "#000",
    touchAction: "none", userSelect: "none",
  };

  // Animation state badge colors
  const animColors = {
    IDLE: "#888", WALK: "#00cc88", RUN: "#ffaa00",
    JUMP: "#44aaff", FALL: "#aa66ff", LAND: "#ff8844",
    FLY: "#88ffff", ATTACK: "#ff3333"
  };

  return (
    <div ref={containerRef} style={containerStyle}>

      {/* Title */}
      <div onTouchStart={stopEvt} style={{
        position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.62)", borderRadius: 8, padding: "4px 18px",
        color: "#00e676", fontSize: 13, fontWeight: "bold", letterSpacing: 4,
        fontFamily: "monospace", textShadow: "0 0 10px #00e676aa",
        border: "1px solid rgba(0,230,118,0.25)", zIndex: 20, pointerEvents: "none",
      }}>
        BEN 10
      </div>

      {/* Animation state badge */}
      <div onTouchStart={stopEvt} style={{
        position: "absolute", top: 36, left: "50%", transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.55)", borderRadius: 6, padding: "2px 10px",
        color: animColors[animState] || "#aaa",
        fontSize: 9, fontFamily: "monospace", fontWeight: "bold", letterSpacing: 2,
        border: `1px solid ${animColors[animState] || "#444"}55`,
        zIndex: 20, pointerEvents: "none",
        transition: "color 0.1s, border-color 0.1s",
        boxShadow: attackFlash ? `0 0 18px ${accentHex}` : "none",
      }}>
        {animState}
      </div>

      {/* ── Alien Selector Toggle ── */}
      <div onTouchStart={stopEvt} style={{ position: "absolute", top: 58, left: "50%", transform: "translateX(-50%)", zIndex: 20 }}>
        <button
          onPointerDown={(e) => { e.stopPropagation(); setShowSelector(v => !v); }}
          style={{
            background: colorHex + "33",
            border: `2px solid ${accentHex}`,
            color: accentHex,
            borderRadius: 20, padding: "4px 16px",
            fontFamily: "monospace", fontWeight: "bold", fontSize: 13,
            cursor: "pointer", letterSpacing: 1,
            boxShadow: `0 0 12px ${accentHex}66`,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {alien.label} {alien.name} {showSelector ? "▲" : "▼"}
        </button>

        {showSelector && (
          <div onPointerDown={(e) => e.stopPropagation()} style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.90)", border: "1px solid rgba(0,230,118,0.3)",
            borderRadius: 12, padding: 8, marginTop: 4,
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 4, minWidth: 240, zIndex: 30,
          }}>
            {ALIEN_KEYS.map(key => {
              const a = ALIENS[key];
              const ac = "#" + a.accentColor.toString(16).padStart(6, "0");
              const cl = "#" + a.color.toString(16).padStart(6, "0");
              const sel = selectedAlien === key;
              return (
                <button key={key}
                  onPointerDown={(e) => { e.stopPropagation(); setSelectedAlien(key); setShowSelector(false); }}
                  style={{
                    background: sel ? cl + "55" : "rgba(255,255,255,0.05)",
                    border: `1.5px solid ${sel ? ac : "rgba(255,255,255,0.15)"}`,
                    color: sel ? ac : "#ccc",
                    borderRadius: 8, padding: "5px 8px",
                    fontFamily: "monospace", fontSize: 11,
                    cursor: "pointer", letterSpacing: 0.5, textAlign: "left",
                    boxShadow: sel ? `0 0 8px ${ac}55` : "none",
                  }}
                >
                  {a.label} {a.name}
                  {a.canFly && <span style={{ marginLeft: 4, fontSize: 9, color: "#88FF88" }}>✈</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Left joystick */}
      <VirtualJoystick onChange={onLeft} stRef={st} style={{ bottom: 22, left: 20 }} />

      {/* ── Right-side buttons ── */}
      <div onTouchStart={stopEvt} style={{
        position: "absolute", bottom: 16, right: 16, zIndex: 10,
        display: "flex", flexDirection: "column", gap: 6, alignItems: "center"
      }}>

        {/* ATTACK button */}
        <button
          onTouchStart={(e) => { e.stopPropagation(); st.current.attack = true; }}
          onTouchEnd={(e) => { e.stopPropagation(); st.current.attack = false; }}
          style={{
            width: 70, height: 70, borderRadius: "50%", outline: "none", cursor: "pointer",
            background: attackFlash ? `${accentHex}88` : `${accentHex}22`,
            border: `3px solid ${accentHex}`,
            color: accentHex, fontSize: 11, fontFamily: "monospace", fontWeight: "bold",
            letterSpacing: 1, touchAction: "none",
            boxShadow: attackFlash
              ? `0 0 28px ${accentHex}, 0 0 8px ${accentHex}`
              : `0 0 14px ${accentHex}66`,
            transition: "all 0.08s",
          }}
        >
          {alien.attackLabel}
        </button>

        {/* JUMP / TOGGLE FLY */}
        {alien.canFly ? (
          <button
            onTouchStart={(e) => {
              e.stopPropagation();
              const newFlying = !st.current.flyingActive;
              st.current.flyingActive = newFlying;
              setIsFlying(newFlying);
            }}
            style={{
              width: 70, height: 70, borderRadius: "50%", outline: "none", cursor: "pointer",
              background: isFlying ? `${accentHex}44` : "rgba(255,255,255,0.08)",
              border: `2px solid ${accentHex}`,
              color: accentHex, fontSize: 11, fontFamily: "monospace", fontWeight: "bold",
              letterSpacing: 1, touchAction: "none",
              boxShadow: isFlying ? `0 0 20px ${accentHex}88` : `0 0 8px ${accentHex}44`,
              transition: "all 0.15s",
            }}
          >
            {isFlying ? "🛑 LAND" : "✈ FLY"}
          </button>
        ) : (
          <button
            onTouchStart={(e) => { e.stopPropagation(); st.current.jump = true; }}
            onTouchEnd={(e) => { e.stopPropagation(); st.current.jump = false; }}
            style={{
              width: 70, height: 70, borderRadius: "50%", outline: "none", cursor: "pointer",
              background: `${accentHex}22`,
              border: `2px solid ${accentHex}99`,
              color: accentHex, fontSize: 11, fontFamily: "monospace", fontWeight: "bold",
              letterSpacing: 1, touchAction: "none",
              boxShadow: `0 0 14px ${accentHex}44`,
            }}
          >
            JUMP
          </button>
        )}

        {/* FLY UP / DOWN */}
        {alien.canFly && isFlying && (
          <>
            <button
              onTouchStart={(e) => { e.stopPropagation(); st.current.flyUp = true; }}
              onTouchEnd={(e) => { e.stopPropagation(); st.current.flyUp = false; }}
              style={{
                width: 70, height: 36, borderRadius: 8, outline: "none", cursor: "pointer",
                background: "rgba(100,255,100,0.1)", border: "2px solid rgba(100,255,100,0.5)",
                color: "#88FF88", fontSize: 10, fontFamily: "monospace", fontWeight: "bold",
                letterSpacing: 1, touchAction: "none",
              }}
            >▲ UP</button>
            <button
              onTouchStart={(e) => { e.stopPropagation(); st.current.flyDown = true; }}
              onTouchEnd={(e) => { e.stopPropagation(); st.current.flyDown = false; }}
              style={{
                width: 70, height: 36, borderRadius: 8, outline: "none", cursor: "pointer",
                background: "rgba(255,100,100,0.1)", border: "2px solid rgba(255,100,100,0.5)",
                color: "#FF8888", fontSize: 10, fontFamily: "monospace", fontWeight: "bold",
                letterSpacing: 1, touchAction: "none",
              }}
            >▼ DOWN</button>
          </>
        )}

        {/* SPRINT */}
        <button
          onTouchStart={(e) => { e.stopPropagation(); st.current.sprint = true; }}
          onTouchEnd={(e) => { e.stopPropagation(); st.current.sprint = false; }}
          style={{
            width: 70, height: 28, borderRadius: 8, outline: "none", cursor: "pointer",
            background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.3)",
            color: "#fff", fontSize: 9, fontFamily: "monospace", fontWeight: "bold",
            letterSpacing: 1, touchAction: "none",
          }}
        >
          {selectedAlien === "xlr8" ? "⚡ BOOST" : "SPRINT"}
        </button>
      </div>

      {/* Stats HUD */}
      <div onTouchStart={stopEvt} style={{
        position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.55)", borderRadius: 8, padding: "3px 12px",
        color: accentHex, fontSize: 10, fontFamily: "monospace",
        border: `1px solid ${accentHex}44`,
        zIndex: 10, pointerEvents: "none",
        display: "flex", gap: 12,
        boxShadow: `0 0 8px ${accentHex}33`,
      }}>
        <span>SPD {alien.speed}</span>
        <span>JMP {alien.canFly ? "∞" : alien.jumpVel}</span>
        <span>{alien.canFly ? "✈ FLIES" : "🏃 RUNS"}</span>
        {alien.scale !== 1.0 && <span>SZ {alien.scale}x</span>}
        <span style={{ color: alien.attackColor ? "#" + alien.attackColor.toString(16).padStart(6,"0") : accentHex }}>
          ⚔ {alien.attackLabel}
        </span>
      </div>

      {/* Desktop hint */}
      <div style={{
        position: "absolute", top: 4, right: 8,
        color: "rgba(255,255,255,0.22)", fontSize: 8, fontFamily: "monospace",
        whiteSpace: "nowrap", zIndex: 10, pointerEvents: "none",
      }}>
        WASD • SPACE {alien.canFly ? "toggle fly" : "jump"} • SHIFT sprint • F attack
      </div>

    </div>
  );
}
