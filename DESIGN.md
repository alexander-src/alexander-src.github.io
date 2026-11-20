# DESIGN.md — `alexander-src.github.io`

## Design Read
Reading this as: personal engineering portfolio and technical dossier for hiring managers and senior systems engineers, in an archival hardware datasheet and technical monograph style, dial **ENERGY 2 / RHYTHM 3 / MOTION 1**.

## Visual Identity & Reasons (R-31)
- **Identity motif:** Hardware datasheet and archival field manual. Horizontal structural rules, indexed specification rows, and recessed code/output plates repeat across the landing page, case study, and printable CV so the site belongs to one systems engineer rather than a generic SaaS template.
- **Palette (R-01, R-29, R-25):** Warm unbleached drafting paper (`#F6F4EE`) as default light ground, pure white (`#FFFFFF`) only on the primary dossier plate, warm carbon ink (`#161513`), and **one deliberate accent**: deep rust-oxide (`#A83214` on light, `#E8744F` on dark) chosen specifically to nod to Rust systems work and copper PCB traces. Full warm-charcoal dark theme (`#141311` ground, `#F0EDE6` chalk ink) available via working header toggle (R-21, R-34). Every text pairing exceeds 5.6:1 contrast (verified with `contrast-check.py`).
- **Typography (R-06):** Editorial serif (`Iowan Old Style`, `Charter`, `Georgia`, `serif`) for `<h1>` and `<h2>` to establish a human technical-monograph voice distinct from uniform sans-serif templates; clean system sans-serif for fast body scanning with zero render-blocking font requests; monospace strictly reserved for real commands, ELF sections, and hex addresses.
- **Layout & Rhythm (R-05, R-14):** RHYTHM 3 (varied compositions). No repeated card grids, no stat-card row under the hero, no fake terminal window chrome, no 3-step AI cards. Sections alternate between an asymmetric masthead + facts table, a split dossier spread with live output inspector, rule-separated index rows, two-column editorial prose, and a specification/contact grid.
- **Spacing & Radius (R-11):** Consistent structural spacing scale (tightened at mobile register). Sharp-editorial corners (`2px` rules/code, `4px` buttons/plates) with zero pill-shaped capsules.
- **Motion & Effects (R-10, R-12, R-13, R-19):** MOTION 1 (hover, active, and focus state transitions only; zero scroll animations, zero loops, zero glassmorphism, zero glow, zero floating shadows; transitions disabled under `prefers-reduced-motion: reduce`).
- **Copy Discipline (R-02, R-15, R-16, R-17, R-36):** Zero em dashes (`—`), zero marketing buzzwords, zero fabricated metrics or claims, specific action labels on every link and button.
