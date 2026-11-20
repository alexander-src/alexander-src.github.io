/**
 * Lightweight browser x86-64 instruction decoder mirroring isa-audit's Rust
 * src/decoder.rs logic for live homepage inspection.
 * Parses legacy prefixes, REX, VEX2 (0xC5), VEX3 (0xC4), EVEX (0x62), ModRM/SIB,
 * and evaluates the avx-no-fma target policy in real time.
 */
(function () {
  "use strict";

  const PRESETS = [
    {
      label: "vfmadd213ps",
      hex: "c4 e2 75 a8 c2",
      note: "256-bit fused multiply-add (from GCC -mavx -mfma)",
    },
    {
      label: "vaddps",
      hex: "c5 f4 58 c2",
      note: "256-bit baseline AVX floating-point add",
    },
    {
      label: "vpaddd (ymm)",
      hex: "c5 f5 fe c2",
      note: "256-bit integer SIMD add (requires AVX2)",
    },
    {
      label: "vmovdqa64 (zmm)",
      hex: "62 71 fd 48 6f 2d 8e 14 02 00",
      note: "512-bit EVEX load observed in /usr/bin/ls",
    },
    {
      label: "tzcnt (rep bsf)",
      hex: "f3 0f bc c0",
      note: "Baseline-safe encoding emitted by rustc and LLVM",
    },
    {
      label: "andn",
      hex: "c4 e2 70 f2 c2",
      note: "VEX-encoded BMI1 bitwise and-not",
    },
  ];

  function modrmLength(bytes, pos) {
    if (pos >= bytes.length) return null;
    const modrm = bytes[pos];
    const mod = modrm >> 6;
    const rm = modrm & 7;
    let extra = 1;
    if (mod === 0) {
      if (rm === 4) {
        if (pos + 1 >= bytes.length) return null;
        extra += 1;
        if ((bytes[pos + 1] & 7) === 5) extra += 4;
      } else if (rm === 5) {
        extra += 4;
      }
    } else if (mod === 1) {
      extra += rm === 4 ? 2 : 1;
    } else if (mod === 2) {
      extra += rm === 4 ? 5 : 4;
    }
    return pos + extra <= bytes.length ? extra : null;
  }

  function decodeX86(bytes) {
    if (!bytes.length) {
      return { error: "Enter at least one hex byte (for example: c4 e2 75 a8 c2)." };
    }

    let pos = 0;
    let has66 = false;
    let hasF0 = false;
    let hasF2 = false;
    let hasF3 = false;
    let lastRep = 0;

    while (pos < bytes.length && pos < 14) {
      const b = bytes[pos];
      if (b === 0x26 || b === 0x2e || b === 0x36 || b === 0x3e || b === 0x64 || b === 0x65 || b === 0x67) {
        pos += 1;
      } else if (b === 0x66) {
        has66 = true;
        pos += 1;
      } else if (b === 0xf0) {
        hasF0 = true;
        pos += 1;
      } else if (b === 0xf2) {
        hasF2 = true;
        lastRep = 0xf2;
        pos += 1;
      } else if (b === 0xf3) {
        hasF3 = true;
        lastRep = 0xf3;
        pos += 1;
      } else {
        break;
      }
    }

    if (pos >= bytes.length) {
      return { error: "Input ends after legacy prefixes with no opcode byte." };
    }

    const conflicting = has66 || hasF0 || hasF2 || hasF3;
    const b0 = bytes[pos];

    // VEX2 (0xC5) or VEX3 (0xC4)
    if (!conflicting && (b0 === 0xc5 || b0 === 0xc4)) {
      const isVex2 = b0 === 0xc5;
      if (isVex2 && pos + 2 >= bytes.length) {
        return { error: "Truncated 2-byte VEX instruction." };
      }
      if (!isVex2 && pos + 3 >= bytes.length) {
        return { error: "Truncated 3-byte VEX instruction." };
      }

      const map = isVex2 ? 1 : bytes[pos + 1] & 0x1f;
      if (map < 1 || map > 3) {
        return { error: "Invalid VEX escape map (" + map + "); rejected as non-instruction bytes." };
      }
      const b2 = isVex2 ? bytes[pos + 1] : bytes[pos + 2];
      const opcode = isVex2 ? bytes[pos + 2] : bytes[pos + 3];
      const bodyPos = isVex2 ? pos + 3 : pos + 4;
      const l256 = ((b2 >> 2) & 1) !== 0;
      const pp = b2 & 3;
      const mapLabel = map === 1 ? "0F" : map === 2 ? "0F38" : "0F3A";
      const ppLabel = pp === 0 ? "none" : pp === 1 ? "66" : pp === 2 ? "F3" : "F2";
      const widthLabel = l256 ? "256-bit" : "128-bit";

      if (map === 1 && opcode === 0x77) {
        return {
          encoding: (isVex2 ? "2-byte VEX" : "3-byte VEX") + " (map 0F, " + widthLabel + ")",
          length: bodyPos,
          feature: "AVX",
          mnemonic: l256 ? "vzeroall" : "vzeroupper",
          avxNoFmaAllowed: true,
          reason: "Allowed under avx-no-fma (no ModRM byte required).",
        };
      }

      const mLen = modrmLength(bytes, bodyPos);
      if (mLen === null) {
        return { error: "Truncated ModRM, SIB, or displacement bytes after VEX opcode." };
      }
      const modrm = bytes[bodyPos];
      const reg = (modrm >> 3) & 7;
      const imm = map === 3 || (map === 1 && [0x70, 0x71, 0x72, 0x73, 0xc2, 0xc4, 0xc5, 0xc6].includes(opcode)) ? 1 : 0;
      const total = bodyPos + mLen + imm;
      if (total > bytes.length || total > 15) {
        return { error: "Instruction requires " + total + " bytes, but only " + bytes.length + " were provided." };
      }

      let feature = "AVX";
      let mnemonic = "avx-op";

      if (map === 2 && pp === 1 && ((opcode >= 0x96 && opcode <= 0x9f) || (opcode >= 0xa6 && opcode <= 0xaf) || (opcode >= 0xb6 && opcode <= 0xbf))) {
        feature = "FMA3";
        mnemonic = "vfmadd / vfmsub";
      } else if (map === 2 && pp === 0 && (opcode === 0xf2 || opcode === 0xf3 || opcode === 0xf7)) {
        feature = "BMI1";
        mnemonic = opcode === 0xf2 ? "andn" : opcode === 0xf7 ? "bextr" : reg === 1 ? "blsr" : reg === 2 ? "blsmsk" : "blsi";
      } else if ((map === 2 && (opcode === 0xf5 || opcode === 0xf6 || (opcode === 0xf7 && pp !== 0))) || (map === 3 && pp === 3 && opcode === 0xf0)) {
        feature = "BMI2";
        mnemonic = opcode === 0xf0 ? "rorx" : opcode === 0xf6 ? "mulx" : "bmi2-bitop";
      } else if (map === 1 && l256 && pp === 1 && ((opcode >= 0x60 && opcode <= 0x6e) || (opcode >= 0x70 && opcode <= 0x76) || (opcode >= 0xd1 && opcode <= 0xfe && opcode !== 0xd6 && opcode !== 0xe6 && opcode !== 0xe7 && opcode !== 0xf7))) {
        feature = "AVX2";
        mnemonic = "256-bit integer SIMD";
      } else if (map === 2 && pp === 1 && ([0x16, 0x36, 0x45, 0x46, 0x47, 0x58, 0x59, 0x5a, 0x78, 0x79, 0x8c, 0x8e, 0x90, 0x91, 0x92, 0x93].includes(opcode) || (l256 && opcode <= 0x41))) {
        feature = "AVX2";
        mnemonic = "avx2-0f38";
      } else if (map === 3 && pp === 1 && [0x00, 0x01, 0x02, 0x38, 0x39, 0x46].includes(opcode)) {
        feature = "AVX2";
        mnemonic = "avx2-permute";
      } else if (map === 1 && opcode === 0x58) {
        mnemonic = "vaddps / vaddpd";
      } else if (map === 1 && (opcode === 0x28 || opcode === 0x29)) {
        mnemonic = "vmovaps / vmovapd";
      }

      const allowed = feature === "AVX";
      return {
        encoding: (isVex2 ? "2-byte VEX" : "3-byte VEX") + " (map " + mapLabel + ", pp " + ppLabel + ", " + widthLabel + ")",
        length: total,
        feature: feature,
        mnemonic: mnemonic,
        avxNoFmaAllowed: allowed,
        reason: allowed
          ? "Allowed under avx-no-fma policy."
          : "Blocked under avx-no-fma policy (would raise SIGILL on non-FMA AVX hosts).",
      };
    }

    // EVEX (0x62)
    if (!conflicting && b0 === 0x62) {
      if (pos + 4 >= bytes.length) {
        return { error: "Truncated 4-byte EVEX prefix." };
      }
      const p0 = bytes[pos + 1];
      const p1 = bytes[pos + 2];
      const p2 = bytes[pos + 3];
      const opcode = bytes[pos + 4];
      const map = p0 & 7;
      if ((p1 & 4) === 0 || (p0 & 8) !== 0 || ![1, 2, 3, 5, 6].includes(map)) {
        return { error: "Malformed EVEX bits (P1 bit 2 must be 1); rejected." };
      }
      const mLen = modrmLength(bytes, pos + 5);
      if (mLen === null) {
        return { error: "Truncated ModRM or displacement bytes after EVEX opcode." };
      }
      const imm = map === 3 ? 1 : 0;
      const total = pos + 5 + mLen + imm;
      if (total > bytes.length || total > 15) {
        return { error: "EVEX instruction needs " + total + " bytes, got " + bytes.length + "." };
      }
      const ll = (p2 >> 5) & 3;
      const feature = ll === 0 || ll === 1 ? "AVX-512VL" : "AVX-512F";
      const width = ll === 0 ? "128-bit" : ll === 1 ? "256-bit" : "512-bit";
      return {
        encoding: "4-byte EVEX (opcode 0x" + opcode.toString(16).padStart(2, "0") + ", " + width + ")",
        length: total,
        feature: feature,
        mnemonic: "evex vector op",
        avxNoFmaAllowed: false,
        reason: "Blocked under avx-no-fma and x86-64-v3 policies (requires AVX-512).",
      };
    }

    // Optional REX
    let rex = 0;
    if (bytes[pos] >= 0x40 && bytes[pos] <= 0x4f) {
      rex = bytes[pos];
      pos += 1;
      if (pos >= bytes.length) return { error: "Truncated instruction after REX prefix." };
    }

    const op = bytes[pos];
    pos += 1;

    if (op === 0x0f) {
      if (pos >= bytes.length) return { error: "Truncated 0F escape opcode." };
      const op2 = bytes[pos];
      pos += 1;
      if (op2 === 0x38 || op2 === 0x3a) {
        if (pos >= bytes.length) return { error: "Truncated 3-byte 0F " + op2.toString(16) + " opcode." };
        const op3 = bytes[pos];
        pos += 1;
        const mLen = modrmLength(bytes, pos);
        if (mLen === null) return { error: "Truncated ModRM bytes." };
        const total = pos + mLen + (op2 === 0x3a ? 1 : 0);
        if (total > bytes.length) return { error: "Need " + total + " bytes, got " + bytes.length + "." };
        let feature = "SSE4.1";
        if (op2 === 0x38 && op3 >= 0xdb && op3 <= 0xdf && has66) feature = "AES-NI";
        else if (op2 === 0x38 && (op3 <= 0x0b || (op3 >= 0x1c && op3 <= 0x1e))) feature = "SSSE3";
        else if (op2 === 0x38 && (op3 === 0xf0 || op3 === 0xf1) && lastRep === 0xf2) feature = "SSE4.2";
        return {
          encoding: "Legacy 3-byte (0F " + op2.toString(16).toUpperCase() + ")",
          length: total,
          feature: feature,
          mnemonic: "simd-3byte",
          avxNoFmaAllowed: true,
          reason: "Allowed under avx-no-fma policy.",
        };
      }

      const mLen = modrmLength(bytes, pos);
      if (mLen === null) return { error: "Truncated ModRM after 0F opcode." };
      const total = pos + mLen;
      if (op2 === 0xbc && lastRep === 0xf3) {
        return {
          encoding: "Legacy F3 0F BC (rep bsf)",
          length: total,
          feature: "Baseline (x86-64-v1)",
          mnemonic: "tzcnt / rep bsf",
          avxNoFmaAllowed: true,
          reason: "Safe on pre-BMI1 CPUs (executes as rep bsf without raising SIGILL).",
        };
      }
      if (op2 === 0xb8 && lastRep === 0xf3) {
        return {
          encoding: "Legacy F3 0F B8",
          length: total,
          feature: "POPCNT",
          mnemonic: "popcnt",
          avxNoFmaAllowed: true,
          reason: "Allowed under x86-64-v2 and avx-no-fma policies.",
        };
      }
      return {
        encoding: "Legacy 2-byte (0F " + op2.toString(16).toUpperCase().padStart(2, "0") + ")",
        length: total,
        feature: "Baseline (x86-64-v1)",
        mnemonic: "x86-0f",
        avxNoFmaAllowed: true,
        reason: "Baseline x86-64 instruction; allowed on all targets.",
      };
    }

    // Simple baseline 1-byte fallback (ret, nop, push/pop, mov)
    const len = op === 0xc3 || op === 0x90 || (op >= 0x50 && op <= 0x5f) ? pos : Math.min(bytes.length, pos + (modrmLength(bytes, pos) || 0));
    return {
      encoding: rex ? "REX + 1-byte legacy" : "1-byte legacy",
      length: len,
      feature: "Baseline (x86-64-v1)",
      mnemonic: op === 0xc3 ? "ret" : op === 0x90 ? "nop" : "x86",
      avxNoFmaAllowed: true,
      reason: "Baseline x86-64 instruction; allowed on all targets.",
    };
  }

  function parseHexInput(raw) {
    const cleaned = raw.trim().replace(/0x/gi, "").replace(/[,;]/g, " ");
    if (!cleaned) return { bytes: [] };
    const tokens = cleaned.split(/\s+/);
    const bytes = [];
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];
      if (!/^[0-9a-fA-F]+$/.test(tok)) {
        return { error: "Invalid hex token '" + tok + "'. Use hexadecimal byte pairs like c4 e2 75 a8 c2." };
      }
      if (tok.length % 2 !== 0) {
        return { error: "Odd-length hex token '" + tok + "'. Pad single digits (for example 0f)." };
      }
      for (let j = 0; j < tok.length; j += 2) {
        bytes.push(parseInt(tok.slice(j, j + 2), 16));
      }
    }
    return { bytes: bytes };
  }

  document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("hex-input");
    const presetsEl = document.getElementById("decoder-presets");
    const statusEl = document.getElementById("decoder-status");
    const resultEl = document.getElementById("decoder-result");
    const outFeature = document.getElementById("dec-feature");
    const outEncoding = document.getElementById("dec-encoding");
    const outLength = document.getElementById("dec-length");
    const outPolicy = document.getElementById("dec-policy");

    if (!input || !presetsEl || !statusEl || !resultEl) return;

    function runDecode(hexStr) {
      const parsed = parseHexInput(hexStr);
      if (parsed.error) {
        resultEl.hidden = true;
        statusEl.hidden = false;
        statusEl.className = "decoder-status is-error";
        statusEl.textContent = parsed.error;
        return;
      }
      const res = decodeX86(parsed.bytes);
      if (res.error) {
        resultEl.hidden = true;
        statusEl.hidden = false;
        statusEl.className = "decoder-status is-error";
        statusEl.textContent = res.error;
        return;
      }
      statusEl.hidden = true;
      resultEl.hidden = false;
      outFeature.textContent = res.feature + " (" + res.mnemonic + ")";
      outEncoding.textContent = res.encoding;
      outLength.textContent = res.length + " bytes";
      outPolicy.textContent = res.reason;
      outPolicy.className = res.avxNoFmaAllowed ? "policy-ok" : "policy-block";
    }

    PRESETS.forEach(function (preset, idx) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "preset-btn";
      btn.textContent = preset.label;
      btn.title = preset.note;
      btn.setAttribute("aria-pressed", idx === 0 ? "true" : "false");
      btn.addEventListener("click", function () {
        presetsEl.querySelectorAll(".preset-btn").forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        input.value = preset.hex;
        runDecode(preset.hex);
      });
      presetsEl.appendChild(btn);
    });

    input.addEventListener("input", function () {
      presetsEl.querySelectorAll(".preset-btn").forEach(function (b) {
        b.setAttribute("aria-pressed", "false");
      });
      runDecode(input.value);
    });

    input.value = PRESETS[0].hex;
    runDecode(PRESETS[0].hex);
  });
})();
