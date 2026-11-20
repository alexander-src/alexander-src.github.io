# DESIGN.md: alexander-src.github.io

## Design Read
Reading this as: personal software engineering portfolio for hiring managers and senior systems engineers, in a quiet single-column editorial reading layout, dial **ENERGY 1 / RHYTHM 2 / MOTION 1**.

## Visual Decisions and Reasons (R-31)
- **Layout (R-05, C-3):** Single centered 660px reading column so a busy recruiter or engineer reads who Alexander is, inspects his best project, and reaches his CV or GitHub in under 15 seconds with zero modals, zero hidden drawers, and zero layout friction.
- **Typography (R-06):** `IBM Plex Sans` (with clean system-ui fallback) for warm, clear technical prose; `Newsreader` serif exclusively on the page heading for a quiet human signature; `IBM Plex Mono` strictly inside actual code, hex byte inputs, and disassembly lines. No uppercase monospace UI headers, no slash separators (`/` or `//`), and no bracketed HUD labels.
- **Palette and Contrast (R-01, R-21, R-25, R-29):** Warm paper off-white default (`#FCFCFB`) with near-black ink (`#171717`, 17.46:1), graphite secondary text (`#525252`, 7.61:1), subtle neutral surface (`#F4F4F1`), and one restrained royal-ink accent (`#1D4ED8`, 6.53:1) for active focus and links. Full matte dark mode (`#111111` ground, `#EDEDED` ink, `#93C5FD` links) available via the header toggle.
- **Interactive Proof (C-2, C-5):** Instead of decorative 3D backgrounds, the homepage embeds a real, working x86-64 instruction byte decoder mirroring `isa-audit`'s Rust decoder (supporting legacy, REX, VEX2, VEX3, and EVEX bytes with live `avx-no-fma` policy evaluation and clear invalid/empty error states).
- **Motion (R-19, R-39):** Hover, active, and focus transitions only; zero loops, zero parallax, zero glassmorphism, zero shadows; all transitions stop under `prefers-reduced-motion: reduce`.
- **Copy Discipline (R-02, R-15, R-16, R-17, R-36):** Zero em dashes across all source and documentation files, plain sentence-case human writing, no marketing buzzwords, and only real measured figures.
