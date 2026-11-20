# `alexander-src.github.io`

Personal engineering portfolio, write-ups, and printable 1-page CV for [`alexander-src`](https://github.com/alexander-src).

## Overview
- **Focused single-column layout (`DESIGN.md`):** Designed to be scanned in under 15 seconds with zero frameworks, WCAG-verified light and dark themes, and zero hidden navigation modals.
- **Interactive x86-64 byte decoder (`assets/decoder-demo.js`):** Real browser implementation mirroring `isa-audit`'s Rust x86-64 prefix and ISA decoder (legacy, REX, VEX2, VEX3, EVEX, and `avx-no-fma` policy evaluation).
- **Printable 1-page CV (`cv.html`):** Crisp ATS-friendly print stylesheet via `@media print`.
- **Automated CI verification (`scripts/verify_site.py`):** Validates HTML landmarks, local links, security attributes, and zero em dashes across all source files before deploying to GitHub Pages.

## Local Preview

```bash
python3 scripts/verify_site.py
python3 -m http.server 8000
```
