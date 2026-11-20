# `alexander-src.github.io`

Engineering portfolio, technical case studies, and printable ATS CV for [`alexander-src`](https://github.com/alexander-src).

## Architecture
- **Design direction:** Documented in [`DESIGN.md`](DESIGN.md) (archival hardware datasheet aesthetic, WCAG-verified light and dark palettes, zero JS frameworks, zero render-blocking external fonts or scripts).
- **Single source of truth:** Update name, location, email, LinkedIn, and merged upstream PRs in [`assets/profile.js`](assets/profile.js).
- **Printable 1-page CV:** [`cv.html`](cv.html) formats automatically via `@media print` for clean PDF export.
- **CI-gated deployment:** [`.github/workflows/pages.yml`](.github/workflows/pages.yml) runs [`scripts/verify_site.py`](scripts/verify_site.py) before publishing to GitHub Pages.

## Local Preview and Verification

```bash
python3 scripts/verify_site.py
python3 -m http.server 8000
```
