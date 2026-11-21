/**
 * Central profile configuration for alexander-src.github.io and cv.html.
 * Update displayName, location, email, linkedinUrl, and mergedPullRequests here.
 */
window.PORTFOLIO_PROFILE = {
  displayName: "Alexander",
  handle: "alexander-src",
  roleTitle: "Systems Software Engineer",
  location: "Open to remote and global roles",
  availability: "Available for software engineering and systems roles",
  email: "alex.laros@proton.me",
  githubUrl: "https://github.com/alexander-src",
  portfolioUrl: "https://alexander-src.github.io",
  linkedinUrl: "",

  /**
   * Add merged upstream open-source PRs here once they land under @alexander-src.
   * Each entry requires: repo, prNumber, title, url, impact.
   */
  mergedPullRequests: [
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 192,
      title: "Validate shader records and output stems in extract_shaders",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/192",
      impact: "Deferred cursor advancement to validated raw-DEFLATE bytes, enforced XBCH table and size bounds, guarded empty archives, and added case-insensitive output stem disambiguation with 5 synthetic regression tests."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 131,
      title: "Validate DXContainers and mapped PE section bounds in call_evidence",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/131",
      impact: "Unified DXContainer validation in tools/call_evidence.py via resource_inventory.parts() and added mapped PE section bounds checks with synthetic PE32+ regression tests."
    },
    {
      repo: "boykopovar/AnyPS5",
      prNumber: 24986,
      title: "perf(tools): reuse access patterns and fast-scan guest_pointer_audit",
      url: "https://github.com/boykopovar/AnyPS5/pull/24986",
      impact: "Cut guest_pointer_audit runtime from 3.79s to 0.54s (7.0x speedup) across 1,801 C++ files with SHA-256 byte-identical text and JSON output."
    },
    {
      repo: "boykopovar/AnyPS5",
      prNumber: 24623,
      title: "perf(tools): index sources once and scan lazily in env_reference",
      url: "https://github.com/boykopovar/AnyPS5/pull/24623",
      impact: "Cut env_reference --check runtime from 50.56s to 3.92s (~13x speedup) across 7,766 source files with byte-identical SHA-256 output."
    }
  ]
};
