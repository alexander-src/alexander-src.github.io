/**
 * Zero-dependency WebGL2 / GLSL 300 es 3D particle sculpture engine.
 * Renders 36,000 GPU-driven procedural points across 4 morphable 3D manifolds
 * with interactive orbital parallax, 3D cursor turbulence, and pause / reduced-motion support.
 * Falls back cleanly to a 3D-projected 2D Canvas renderer if WebGL2 is unavailable.
 */
(function () {
  "use strict";

  const POINT_COUNT = 36000;
  const FALLBACK_POINTS = 2600;
  const PI2 = Math.PI * 2;

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function gaussian(rng) {
    const u = Math.max(1e-6, rng());
    const v = rng();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(PI2 * v);
  }

  function generateShapes(count) {
    const rng = mulberry32(0x51a7f3c9);
    const manifold = new Float32Array(count * 3);
    const gyro = new Float32Array(count * 3);
    const helix = new Float32Array(count * 3);
    const wave = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const u = rng() * PI2;
      const v = rng() * PI2;
      const shellPick = rng();

      // Per-point phase, size weight, and tint seed
      seeds[i3] = rng();
      seeds[i3 + 1] = 0.45 + Math.pow(rng(), 2.2) * 1.35;
      seeds[i3 + 2] = rng();

      // ---------------------------------------------------------------------
      // Shape 0: Sculptural Twisted Toroidal Manifold (sweeping organic ribbon)
      // ---------------------------------------------------------------------
      {
        const R = 1.24 + 0.25 * Math.cos(2.0 * u) + 0.14 * Math.sin(3.0 * u);
        const pinch = 0.28 + 0.21 * Math.sin(2.0 * u + 1.3 * v);
        // Concentrate 72% near the crisp surface shell, 28% as misty drift
        const spread =
          shellPick < 0.72
            ? 0.86 + Math.abs(gaussian(rng)) * 0.16
            : 0.45 + rng() * 1.15;
        const tube = pinch * spread;

        const ca = Math.cos(u);
        const sa = Math.sin(u);
        const cv = Math.cos(v + 0.7 * u);
        const sv = Math.sin(v + 0.7 * u);

        const px = (R + tube * cv) * ca;
        const py = (R + tube * cv) * sa * 0.92 + 0.22 * Math.sin(u * 2.0);
        const pz = tube * sv * 1.45 + 0.44 * Math.sin(2.0 * u - 0.55);

        // Diagonal sculptural tilt
        manifold[i3] = px * 0.92 - pz * 0.34;
        manifold[i3 + 1] = py * 0.96 + pz * 0.22;
        manifold[i3 + 2] = px * 0.34 + pz * 0.88;
      }

      // ---------------------------------------------------------------------
      // Shape 1: x86-64 Concentric Instruction Gyroscope (isa-audit / systems)
      // ---------------------------------------------------------------------
      {
        if (shellPick < 0.28) {
          // Dense core sphere (ELF section hub)
          const cosT = rng() * 2.0 - 1.0;
          const sinT = Math.sqrt(Math.max(0.0, 1.0 - cosT * cosT));
          const rad = 0.56 + gaussian(rng) * 0.055;
          gyro[i3] = rad * sinT * Math.cos(u);
          gyro[i3 + 1] = rad * sinT * Math.sin(u);
          gyro[i3 + 2] = rad * cosT;
        } else {
          // Three inclined orbital rings (Legacy/REX, VEX, EVEX)
          const ringIdx = i % 3;
          const rMajor = ringIdx === 0 ? 1.12 : ringIdx === 1 ? 1.46 : 1.76;
          const rMinor = 0.065 + Math.abs(gaussian(rng)) * 0.045;
          let rx = (rMajor + rMinor * Math.cos(v)) * Math.cos(u);
          let ry = (rMajor + rMinor * Math.cos(v)) * Math.sin(u);
          let rz = rMinor * Math.sin(v);

          const tiltX = ringIdx === 0 ? 0.55 : ringIdx === 1 ? -0.82 : 1.24;
          const tiltY = ringIdx === 0 ? 0.32 : ringIdx === 1 ? 0.95 : -0.62;
          const cy1 = ry * Math.cos(tiltX) - rz * Math.sin(tiltX);
          const cz1 = ry * Math.sin(tiltX) + rz * Math.cos(tiltX);
          const cx2 = rx * Math.cos(tiltY) + cz1 * Math.sin(tiltY);
          const cz2 = -rx * Math.sin(tiltY) + cz1 * Math.cos(tiltY);
          gyro[i3] = cx2;
          gyro[i3 + 1] = cy1;
          gyro[i3 + 2] = cz2;
        }
      }

      // ---------------------------------------------------------------------
      // Shape 2: Braided Trefoil Verification Loop (AI verify-loop)
      // ---------------------------------------------------------------------
      {
        const p = 2.0;
        const q = 3.0;
        const rKnot = 1.05 + 0.42 * Math.cos(q * u);
        const kx = rKnot * Math.cos(p * u);
        const ky = rKnot * Math.sin(p * u);
        const kz = 0.58 * Math.sin(q * u);

        const jitter = (shellPick < 0.7 ? 0.16 : 0.34) * (0.4 + rng() * 0.75);
        helix[i3] = kx + Math.cos(v) * jitter;
        helix[i3 + 1] = ky + Math.sin(v) * jitter;
        helix[i3 + 2] = kz + gaussian(rng) * jitter * 0.65;
      }

      // ---------------------------------------------------------------------
      // Shape 3: Hyperbolic Relinker Wave Lattice (AnyPS5 / open source)
      // ---------------------------------------------------------------------
      {
        const gx = (rng() * 2.0 - 1.0) * 1.9;
        const gy = (rng() * 2.0 - 1.0) * 1.55;
        const dist = Math.sqrt(gx * gx + gy * gy);
        const ripple =
          0.42 * Math.sin(gx * 2.4 + gy * 1.5) +
          0.26 * Math.cos(dist * 3.1) +
          0.18 * (gx * gx - gy * gy) * 0.45;
        const mist = shellPick < 0.78 ? gaussian(rng) * 0.035 : gaussian(rng) * 0.22;
        wave[i3] = gx;
        wave[i3 + 1] = gy * 0.82 + ripple * 0.35;
        wave[i3 + 2] = ripple + mist;
      }
    }

    return { manifold, gyro, helix, wave, seeds };
  }

  const VERT_SRC = `#version 300 es
precision highp float;

layout(location = 0) in vec3 aPosFrom;
layout(location = 1) in vec3 aPosTo;
layout(location = 2) in vec3 aSeed;

uniform float uTime;
uniform float uMorph;
uniform float uDpr;
uniform vec2 uAspect;
uniform vec2 uRot;
uniform vec2 uPointer;
uniform float uPointerActive;

out float vDepth;
out float vSparkle;
out float vTint;

mat2 rot2(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

void main() {
  // Smooth cubic ease for shape transitions
  float m = uMorph * uMorph * (3.0 - 2.0 * uMorph);
  vec3 pos = mix(aPosFrom, aPosTo, m);

  // Subtle GPU curl-harmonic breathing
  float phase = aSeed.x * 6.2831853 + uTime * 0.45;
  pos.x += sin(pos.y * 2.1 + phase) * 0.045;
  pos.y += cos(pos.z * 2.3 - phase * 0.85) * 0.045;
  pos.z += sin(pos.x * 1.9 + phase * 0.7) * 0.055;

  // Slow orbital drift + cursor parallax rotation
  float ry = uTime * 0.14 + uRot.x;
  float rx = 0.22 + uRot.y;
  pos.xz = rot2(ry) * pos.xz;
  pos.yz = rot2(rx) * pos.yz;

  // Interactive 3D cursor turbulence halo
  if (uPointerActive > 0.01) {
    vec2 pScreen = pos.xy * 0.56;
    vec2 delta = pScreen - uPointer;
    float d2 = dot(delta, delta);
    float influence = exp(-d2 * 4.2) * uPointerActive;
    vec2 swirl = vec2(-delta.y, delta.x) * 0.42 + normalize(delta + vec2(1e-4)) * 0.22;
    pos.xy += swirl * influence;
    pos.z += influence * 0.34;
  }

  // Perspective camera
  float camZ = 4.35;
  float z = camZ - pos.z;
  float invZ = 1.0 / max(0.65, z);
  vec2 projected = pos.xy * (1.72 * invZ) * uAspect;

  gl_Position = vec4(projected, clamp(pos.z * 0.22, -0.98, 0.98), 1.0);

  // Depth-attenuated photographic grain point size
  float depthNorm = clamp((pos.z + 2.1) / 4.2, 0.0, 1.0);
  float baseSize = (0.95 + aSeed.y * 1.65) * (0.55 + depthNorm * 0.95);
  gl_PointSize = clamp(baseSize * uDpr, 1.0, 4.5 * uDpr);

  vDepth = depthNorm;
  vSparkle = 0.72 + 0.28 * sin(uTime * 1.8 + aSeed.x * 31.4159);
  vTint = aSeed.z;
}
`;

  const FRAG_SRC = `#version 300 es
precision highp float;

in float vDepth;
in float vSparkle;
in float vTint;

out vec4 fragColor;

void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float r2 = dot(c, c);
  if (r2 > 0.25) discard;

  // Crisp glowing pinpoint core with soft halo falloff
  float core = exp(-r2 * 22.0);
  float halo = exp(-r2 * 7.5) * 0.42;
  float intensity = (core + halo) * vSparkle;

  // Luminous ice-white foreground receding into cool silver-violet mist
  vec3 farCol = vec3(0.46, 0.44, 0.72);
  vec3 midCol = mix(vec3(0.74, 0.78, 0.94), vec3(0.84, 0.76, 0.98), vTint);
  vec3 nearCol = vec3(0.98, 0.99, 1.0);

  vec3 col = mix(farCol, midCol, smoothstep(0.05, 0.62, vDepth));
  col = mix(col, nearCol, smoothstep(0.55, 0.98, vDepth));

  float alpha = clamp(intensity * (0.14 + vDepth * 0.62), 0.0, 0.92);
  fragColor = vec4(col * alpha, alpha);
}
`;

  function compileShader(gl, type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function createProgram(gl, vsSrc, fsSrc) {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteProgram(prog);
      return null;
    }
    return prog;
  }

  function initWebGL(canvas) {
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    if (!gl) return null;

    const prog = createProgram(gl, VERT_SRC, FRAG_SRC);
    if (!prog) return null;

    const shapes = generateShapes(POINT_COUNT);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const bufFrom = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufFrom);
    gl.bufferData(gl.ARRAY_BUFFER, shapes.manifold, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    const bufTo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufTo);
    gl.bufferData(gl.ARRAY_BUFFER, shapes.manifold, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

    const bufSeed = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufSeed);
    gl.bufferData(gl.ARRAY_BUFFER, shapes.seeds, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);

    const uLoc = {
      time: gl.getUniformLocation(prog, "uTime"),
      morph: gl.getUniformLocation(prog, "uMorph"),
      dpr: gl.getUniformLocation(prog, "uDpr"),
      aspect: gl.getUniformLocation(prog, "uAspect"),
      rot: gl.getUniformLocation(prog, "uRot"),
      pointer: gl.getUniformLocation(prog, "uPointer"),
      pointerActive: gl.getUniformLocation(prog, "uPointerActive"),
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = {
      paused: reducedMotion,
      time: 1.6,
      currentShape: "manifold",
      targetShape: "manifold",
      morph: 1.0,
      rotX: 0,
      rotY: 0,
      targetRotX: 0,
      targetRotY: 0,
      ptrX: 0,
      ptrY: 0,
      targetPtrX: 0,
      targetPtrY: 0,
      ptrActive: 0,
      targetPtrActive: 0,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      width: 1,
      height: 1,
      lastTs: 0,
      rafId: 0,
    };

    function resize() {
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.width = Math.max(1, Math.floor(window.innerWidth));
      state.height = Math.max(1, Math.floor(window.innerHeight));
      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function drawFrame() {
      gl.clearColor(0.0118, 0.0118, 0.0235, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      gl.useProgram(prog);
      gl.bindVertexArray(vao);

      const aspectRatio = state.width / state.height;
      const sx = aspectRatio > 1 ? 1.0 / aspectRatio : 1.0;
      const sy = aspectRatio > 1 ? 1.0 : aspectRatio;

      gl.uniform1f(uLoc.time, state.time);
      gl.uniform1f(uLoc.morph, state.morph);
      gl.uniform1f(uLoc.dpr, state.dpr);
      gl.uniform2f(uLoc.aspect, sx, sy);
      gl.uniform2f(uLoc.rot, state.rotX, state.rotY);
      gl.uniform2f(uLoc.pointer, state.ptrX, state.ptrY);
      gl.uniform1f(uLoc.pointerActive, state.ptrActive);

      gl.drawArrays(gl.POINTS, 0, POINT_COUNT);
      gl.bindVertexArray(null);
    }

    function tick(ts) {
      const dt = state.lastTs ? Math.min(0.05, (ts - state.lastTs) / 1000) : 0.016;
      state.lastTs = ts;

      if (!state.paused) {
        state.time += dt;
      }
      if (state.morph < 1.0) {
        state.morph = Math.min(1.0, state.morph + dt * 1.45);
      }

      const ease = 1.0 - Math.exp(-dt * 5.0);
      state.rotX += (state.targetRotX - state.rotX) * ease;
      state.rotY += (state.targetRotY - state.rotY) * ease;
      state.ptrX += (state.targetPtrX - state.ptrX) * ease;
      state.ptrY += (state.targetPtrY - state.ptrY) * ease;
      state.ptrActive += (state.targetPtrActive - state.ptrActive) * ease;

      drawFrame();

      const needsAnim =
        !state.paused ||
        state.morph < 1.0 ||
        Math.abs(state.targetRotX - state.rotX) > 0.001 ||
        Math.abs(state.targetRotY - state.rotY) > 0.001 ||
        state.ptrActive > 0.005;

      if (needsAnim) {
        state.rafId = window.requestAnimationFrame(tick);
      } else {
        state.rafId = 0;
        state.lastTs = 0;
      }
    }

    function ensureLoop() {
      if (!state.rafId) {
        state.lastTs = 0;
        state.rafId = window.requestAnimationFrame(tick);
      }
    }

    function setShape(name) {
      const key = shapes[name] ? name : "manifold";
      if (key === state.targetShape) return;
      const prevArr = shapes[state.targetShape];
      const nextArr = shapes[key];
      gl.bindBuffer(gl.ARRAY_BUFFER, bufFrom);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, prevArr);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufTo);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, nextArr);
      state.currentShape = state.targetShape;
      state.targetShape = key;
      state.morph = 0.0;
      ensureLoop();
    }

    function setPaused(paused) {
      state.paused = Boolean(paused);
      if (!state.paused) {
        ensureLoop();
      } else {
        drawFrame();
      }
    }

    window.addEventListener("resize", function () {
      resize();
      drawFrame();
    });

    window.addEventListener(
      "pointermove",
      function (ev) {
        const nx = (ev.clientX / Math.max(1, window.innerWidth)) * 2.0 - 1.0;
        const ny = 1.0 - (ev.clientY / Math.max(1, window.innerHeight)) * 2.0;
        state.targetRotX = nx * 0.38;
        state.targetRotY = -ny * 0.28;
        state.targetPtrX = nx;
        state.targetPtrY = ny;
        state.targetPtrActive = 1.0;
        ensureLoop();
      },
      { passive: true }
    );

    window.addEventListener(
      "pointerleave",
      function () {
        state.targetPtrActive = 0.0;
        state.targetRotX = 0.0;
        state.targetRotY = 0.0;
        ensureLoop();
      },
      { passive: true }
    );

    resize();
    drawFrame();
    if (!state.paused) ensureLoop();

    return {
      mode: "webgl2",
      pointCount: POINT_COUNT,
      setShape,
      setPaused,
      isPaused: function () {
        return state.paused;
      },
    };
  }

  function initCanvas2DFallback(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const shapes = generateShapes(FALLBACK_POINTS);
    let shapeKey = "manifold";
    let paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let angle = 0.5;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function render() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.fillStyle = "#030306";
      ctx.fillRect(0, 0, w, h);

      const pts = shapes[shapeKey];
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      const scale = Math.min(w, h) * 0.38;

      for (let i = 0; i < FALLBACK_POINTS; i++) {
        const i3 = i * 3;
        const x0 = pts[i3];
        const y0 = pts[i3 + 1];
        const z0 = pts[i3 + 2];
        const x = x0 * ca - z0 * sa;
        const z = x0 * sa + z0 * ca;
        const persp = 3.8 / (4.3 - z);
        const sx = w * 0.5 + x * scale * persp;
        const sy = h * 0.5 - y0 * scale * persp;
        const depth = Math.max(0.12, Math.min(0.95, (z + 2.0) / 3.8));
        ctx.fillStyle = "rgba(224,228,255," + (depth * 0.65).toFixed(2) + ")";
        ctx.fillRect(sx, sy, depth > 0.65 ? 1.8 : 1.1, depth > 0.65 ? 1.8 : 1.1);
      }
      if (!paused) {
        angle += 0.004;
        window.requestAnimationFrame(render);
      }
    }

    window.addEventListener("resize", function () {
      resize();
      if (paused) render();
    });
    resize();
    render();

    return {
      mode: "canvas2d",
      pointCount: FALLBACK_POINTS,
      setShape: function (name) {
        if (shapes[name]) {
          shapeKey = name;
          if (paused) render();
        }
      },
      setPaused: function (p) {
        paused = Boolean(p);
        if (!paused) render();
      },
      isPaused: function () {
        return paused;
      },
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("field-canvas");
    if (!canvas) return;
    const engine = initWebGL(canvas) || initCanvas2DFallback(canvas);
    if (!engine) return;
    window.ParticleField = engine;

    const ptsLabel = document.getElementById("field-pts-readout");
    if (ptsLabel) {
      ptsLabel.textContent = engine.pointCount.toLocaleString("en-US") + " PTS";
    }

    const pauseBtn = document.getElementById("field-pause-btn");
    if (pauseBtn) {
      function syncPauseLabel() {
        const p = engine.isPaused();
        pauseBtn.textContent = p ? "PLAY 3D" : "PAUSE 3D";
        pauseBtn.setAttribute("aria-pressed", p ? "true" : "false");
      }
      syncPauseLabel();
      pauseBtn.addEventListener("click", function () {
        engine.setPaused(!engine.isPaused());
        syncPauseLabel();
      });
    }
  });
})();
