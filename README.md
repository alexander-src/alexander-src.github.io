# `alexander-src.github.io`

Interactive 3D WebGL2 research portfolio, technical case studies, and printable ATS CV for [`alexander-src`](https://github.com/alexander-src).

## Architecture
- **Custom 3D Engine (`assets/webgl-field.js`):** Zero-dependency WebGL2 / GLSL 300 es shader rendering 36,000 procedural particles across four morphable 3D manifolds with interactive cursor turbulence, orbital parallax, a working Pause/Play toggle, and automatic static-frame rendering under `prefers-reduced-motion`.
- **Design Direction (`DESIGN.md`):** Spatial dark-void research logbook with WCAG-verified text contrast (`>= 7.7:1`), interactive category filters, accessible technical dossier modal, and zero external JS/CSS frameworks.
- **Printable 1-Page CV (`cv.html`):** Crisp print-ready layout via `@media print` for clean PDF export.
- **CI Gate (`.github/workflows/pages.yml`):** Runs [`scripts/verify_site.py`](scripts/verify_site.py) on every push to check HTML landmarks, local links, security attributes, and zero em dashes across all source files before deploying to GitHub Pages.

## Local Preview and Verification

```bash
python3 scripts/verify_site.py
python3 -m http.server 8000
```
