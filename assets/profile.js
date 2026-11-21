/**
 * Central profile configuration for alexander-src.github.io and cv.html.
 * Update displayName, location, email, linkedinUrl, and mergedPullRequests here.
 */
window.PORTFOLIO_PROFILE = {
  displayName: "Alexander",
  handle: "alexander-src",
  roleTitle: "Systems and AI-Native Software Engineer",
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
      repo: "boykopovar/AnyPS5",
      prNumber: 24623,
      title: "perf(tools): index sources once and scan lazily in env_reference",
      url: "https://github.com/boykopovar/AnyPS5/pull/24623",
      impact: "Cut env_reference --check runtime from 50.56s to 3.92s (~13x speedup) across 7,766 source files with byte-identical SHA-256 output."
    }
  ]
};
