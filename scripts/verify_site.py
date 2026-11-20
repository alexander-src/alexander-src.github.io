#!/usr/bin/env python3
"""Static site verification gate for alexander-src.github.io.

Checks:
1. Every HTML file parses cleanly with <html lang>, <title>, viewport meta, and <main>.
2. Every local href/src resolves to a real file in the repository.
3. Every external target="_blank" link enforces rel="noopener".
4. Zero em dashes (R-02) in rendered HTML pages.
5. Required core files exist.
"""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent


class PageAuditor(HTMLParser):
    def __init__(self, path: Path) -> None:
        super().__init__()
        self.path = path
        self.has_title = False
        self.has_viewport = False
        self.has_lang = False
        self.has_main = False
        self.in_title = False
        self.title_text = ""
        self.errors: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {k.lower(): (v or "") for k, v in attrs}
        t = tag.lower()
        if t == "html" and attr_map.get("lang"):
            self.has_lang = True
        elif t == "title":
            self.in_title = True
        elif t == "main":
            self.has_main = True
        elif t == "meta" and attr_map.get("name", "").lower() == "viewport":
            self.has_viewport = True
            content = attr_map.get("content", "").lower()
            if "user-scalable=no" in content or "maximum-scale=1" in content:
                self.errors.append(
                    f"{self.path.relative_to(ROOT)}: viewport meta blocks zooming"
                )

        for key in ("href", "src"):
            val = attr_map.get(key)
            if val is not None:
                self._check_ref(t, key, val)

        if t == "a" and attr_map.get("target") == "_blank":
            rel_tokens = set(attr_map.get("rel", "").lower().split())
            if "noopener" not in rel_tokens:
                self.errors.append(
                    f"{self.path.relative_to(ROOT)}: target=_blank link '{attr_map.get('href')}' missing rel=noopener"
                )

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title":
            self.in_title = False
            if self.title_text.strip():
                self.has_title = True

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_text += data

    def _check_ref(self, tag: str, attr: str, raw: str) -> None:
        ref = raw.strip()
        if not ref or ref.startswith(("#", "http://", "https://", "mailto:", "javascript:")):
            return
        clean = ref.split("#", 1)[0].split("?", 1)[0]
        if not clean:
            return
        target = (ROOT / clean.lstrip("/")) if clean.startswith("/") else (self.path.parent / clean)
        if not target.resolve().exists():
            self.errors.append(
                f"{self.path.relative_to(ROOT)}: broken local {tag}[{attr}] -> '{raw}'"
            )


def main() -> int:
    required = [
        "DESIGN.md",
        "index.html",
        "cv.html",
        "404.html",
        ".nojekyll",
        "assets/profile.js",
        "assets/styles.css",
        "assets/main.js",
        "assets/favicon.svg",
        "assets/decoder-demo.js",
        "case-studies/isa-audit.html",
    ]
    errors: list[str] = []
    for rel in required:
        if not (ROOT / rel).exists():
            errors.append(f"missing required file: {rel}")

    # Enforce zero em dashes across HTML, Markdown, CSS, and JS files (R-02)
    for ext in ("*.html", "*.md", "*.css", "*.js"):
        for f in sorted(ROOT.rglob(ext)):
            raw = f.read_text(encoding="utf-8")
            if "\u2014" in raw or "&mdash;" in raw:
                errors.append(f"{f.relative_to(ROOT)}: contains forbidden em dash (R-02)")

    html_files = sorted(ROOT.rglob("*.html"))
    for page in html_files:
        raw = page.read_text(encoding="utf-8")
        auditor = PageAuditor(page)
        auditor.feed(raw)
        if not auditor.has_lang:
            errors.append(f"{page.relative_to(ROOT)}: missing <html lang=...>")
        if not auditor.has_title:
            errors.append(f"{page.relative_to(ROOT)}: missing non-empty <title>")
        if not auditor.has_viewport:
            errors.append(f"{page.relative_to(ROOT)}: missing <meta name=viewport>")
        if not auditor.has_main:
            errors.append(f"{page.relative_to(ROOT)}: missing <main> landmark")
        errors.extend(auditor.errors)

    if errors:
        print("Site verification FAILED:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        return 1

    print(f"Site verification PASSED ({len(html_files)} HTML pages, 0 broken links, 0 em dashes, 0 errors).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
