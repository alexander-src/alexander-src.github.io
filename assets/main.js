(function () {
  "use strict";

  const THEME_KEY = "alexander-src-theme";
  const root = document.documentElement;

  function readSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (_) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {
      // Ignore private browsing storage restrictions.
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      const isDark = theme === "dark";
      btn.textContent = isDark ? "Light" : "Dark";
      btn.setAttribute("aria-pressed", isDark ? "true" : "false");
      btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  const saved = readSavedTheme();
  applyTheme(saved === "dark" || saved === "light" ? saved : "light");

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(root.getAttribute("data-theme") || "light");

    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        saveTheme(next);
        applyTheme(next);
      });
    }

    const p = window.PORTFOLIO_PROFILE || {};
    document.querySelectorAll("[data-profile-name]").forEach(function (el) {
      if (p.displayName) el.textContent = p.displayName;
    });
    document.querySelectorAll("[data-profile-role]").forEach(function (el) {
      if (p.roleTitle) el.textContent = p.roleTitle;
    });
    document.querySelectorAll("[data-profile-location]").forEach(function (el) {
      if (p.location) el.textContent = p.location;
    });

    const cvEmailSlot = document.getElementById("cv-email-slot");
    if (cvEmailSlot && p.email) {
      cvEmailSlot.innerHTML =
        ' &middot; <a href="mailto:' + encodeURI(p.email) + '">' + escapeHtml(p.email) + "</a>";
    }
    const cvLinkedinSlot = document.getElementById("cv-linkedin-slot");
    if (cvLinkedinSlot && p.linkedinUrl) {
      cvLinkedinSlot.innerHTML =
        ' &middot; <a href="' +
        encodeURI(p.linkedinUrl) +
        '" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
    }

    const copyBtn = document.getElementById("copy-email-btn");
    const feedback = document.getElementById("copy-feedback");
    if (copyBtn && p.email) {
      copyBtn.addEventListener("click", function () {
        const addr = p.email.trim();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(addr).then(
            function () {
              if (feedback) feedback.textContent = "Copied " + addr + " to clipboard.";
            },
            function () {
              if (feedback) feedback.textContent = "Clipboard blocked. Copy manually: " + addr;
            }
          );
        } else if (feedback) {
          feedback.textContent = "Clipboard unavailable. Copy manually: " + addr;
        }
      });
    }
  });

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
