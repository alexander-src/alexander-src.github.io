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
      // Storage blocked in private contexts.
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      const nextLabel = theme === "dark" ? "Light mode" : "Dark mode";
      btn.textContent = nextLabel;
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      btn.setAttribute("aria-label", "Switch to " + nextLabel.toLowerCase());
    }
  }

  const saved = readSavedTheme();
  const initialTheme = saved === "dark" || saved === "light" ? saved : "light";
  applyTheme(initialTheme);

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(root.getAttribute("data-theme") || "light");

    // 1. Working Light/Dark theme toggle (R-21, R-34)
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        saveTheme(next);
        applyTheme(next);
      });
    }

    // 2. Accessible labeled Mobile Menu toggle with Escape close (R-03, R-26, R-32)
    const menuBtn = document.getElementById("menu-toggle");
    const mobileDrawer = document.getElementById("mobile-drawer");
    if (menuBtn && mobileDrawer) {
      function setMenuOpen(open) {
        mobileDrawer.hidden = !open;
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        menuBtn.textContent = open ? "Close" : "Menu";
      }

      menuBtn.addEventListener("click", function () {
        setMenuOpen(mobileDrawer.hidden);
      });

      mobileDrawer.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          setMenuOpen(false);
        });
      });

      document.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape" && !mobileDrawer.hidden) {
          setMenuOpen(false);
          menuBtn.focus();
        }
      });
    }

    // 3. Hydrate single-source profile fields
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

    // Email actions with explicit success and fallback feedback states (R-27)
    const emailLink = document.getElementById("contact-email-link");
    const copyEmailBtn = document.getElementById("copy-email-btn");
    const copyFeedback = document.getElementById("copy-feedback");
    const cvEmailSlot = document.getElementById("cv-email-slot");

    if (p.email && p.email.trim() !== "") {
      const addr = p.email.trim();
      if (emailLink) {
        emailLink.href = "mailto:" + addr;
        emailLink.textContent = addr;
        emailLink.hidden = false;
      }
      if (copyEmailBtn) {
        copyEmailBtn.hidden = false;
        copyEmailBtn.addEventListener("click", function () {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(addr).then(
              function () {
                if (copyFeedback) copyFeedback.textContent = "Copied " + addr + " to clipboard.";
              },
              function () {
                if (copyFeedback) copyFeedback.textContent = "Clipboard blocked. Copy manually: " + addr;
              }
            );
          } else if (copyFeedback) {
            copyFeedback.textContent = "Clipboard unavailable. Copy manually: " + addr;
          }
        });
      }
      if (cvEmailSlot) {
        cvEmailSlot.innerHTML =
          ' &middot; <a href="mailto:' + encodeURI(addr) + '">' + escapeHtml(addr) + "</a>";
      }
    }

    const linkedinLink = document.getElementById("contact-linkedin-link");
    const cvLinkedinSlot = document.getElementById("cv-linkedin-slot");
    if (p.linkedinUrl && p.linkedinUrl.trim() !== "") {
      const li = p.linkedinUrl.trim();
      if (linkedinLink) {
        linkedinLink.href = li;
        linkedinLink.hidden = false;
      }
      if (cvLinkedinSlot) {
        cvLinkedinSlot.innerHTML =
          ' &middot; <a href="' +
          encodeURI(li) +
          '" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
      }
    }

    // Hydrate merged upstream PRs if configured (preserves honest empty state otherwise)
    const prList = document.getElementById("oss-pr-ledger");
    if (prList && Array.isArray(p.mergedPullRequests) && p.mergedPullRequests.length > 0) {
      prList.innerHTML = p.mergedPullRequests
        .map(function (pr) {
          return (
            '<div class="ledger-row">' +
            '<div class="ledger-tag">' +
            escapeHtml(pr.repo) +
            " " +
            escapeHtml(pr.prNumber || "") +
            "</div>" +
            '<div class="ledger-main">' +
            "<h3>" +
            escapeHtml(pr.title) +
            "</h3>" +
            "<p>" +
            escapeHtml(pr.impact || "") +
            "</p>" +
            "</div>" +
            '<div class="ledger-action"><a href="' +
            encodeURI(pr.url) +
            '" target="_blank" rel="noopener noreferrer">Inspect PR</a></div>' +
            "</div>"
          );
        })
        .join("");
    }

    // 4. Accessible ARIA Tabs with Left/Right keyboard navigation (R-26, R-32, R-39)
    document.querySelectorAll('[role="tablist"]').forEach(function (tablist) {
      const tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
      const container = tablist.closest(".inspector");
      if (!container || tabs.length === 0) return;

      function activateTab(selectedTab) {
        const panelId = selectedTab.getAttribute("aria-controls");
        tabs.forEach(function (t) {
          const isSelected = t === selectedTab;
          t.setAttribute("aria-selected", isSelected ? "true" : "false");
          t.setAttribute("tabindex", isSelected ? "0" : "-1");
        });
        container.querySelectorAll('[role="tabpanel"]').forEach(function (panel) {
          panel.hidden = panel.id !== panelId;
        });
      }

      tabs.forEach(function (tab, idx) {
        tab.addEventListener("click", function () {
          activateTab(tab);
        });
        tab.addEventListener("keydown", function (ev) {
          let nextIdx = null;
          if (ev.key === "ArrowRight") nextIdx = (idx + 1) % tabs.length;
          else if (ev.key === "ArrowLeft") nextIdx = (idx - 1 + tabs.length) % tabs.length;
          else if (ev.key === "Home") nextIdx = 0;
          else if (ev.key === "End") nextIdx = tabs.length - 1;
          if (nextIdx !== null) {
            ev.preventDefault();
            tabs[nextIdx].focus();
            activateTab(tabs[nextIdx]);
          }
        });
      });
    });
  });

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
