(function () {
  "use strict";

  const THEME_KEY = "alexander-src-doc-theme";
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

  document.addEventListener("DOMContentLoaded", function () {
    // 1. Optional theme toggle on long-form reading pages (case study)
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      function applyDocTheme(theme) {
        root.setAttribute("data-theme", theme);
        themeBtn.textContent = theme === "light" ? "DARK MODE" : "LIGHT MODE";
        themeBtn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
      }
      const initial = readSavedTheme() === "light" ? "light" : "dark";
      applyDocTheme(initial);
      themeBtn.addEventListener("click", function () {
        const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        saveTheme(next);
        applyDocTheme(next);
      });
    }

    // 2. Hydrate profile values from assets/profile.js
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

    // 3. Copy email with explicit live feedback and fallback state (R-27)
    const copyBtn = document.getElementById("copy-email-btn");
    const copyFeedback = document.getElementById("copy-feedback");
    if (copyBtn && p.email) {
      copyBtn.addEventListener("click", function () {
        const addr = p.email.trim();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(addr).then(
            function () {
              if (copyFeedback) copyFeedback.textContent = "COPIED: " + addr;
            },
            function () {
              if (copyFeedback) copyFeedback.textContent = "COPY MANUALLY: " + addr;
            }
          );
        } else if (copyFeedback) {
          copyFeedback.textContent = "COPY MANUALLY: " + addr;
        }
      });
    }

    // 4. Spatial Category Filters + 3D Sculpture Morphing
    const filterButtons = Array.prototype.slice.call(
      document.querySelectorAll(".chip[data-filter]")
    );
    const studyCards = Array.prototype.slice.call(
      document.querySelectorAll(".study-card[data-tags]")
    );
    const countDial = document.getElementById("study-count-dial");
    const emptyState = document.getElementById("study-empty-state");

    function set3DShape(shape) {
      if (window.ParticleField && typeof window.ParticleField.setShape === "function") {
        window.ParticleField.setShape(shape);
      }
    }

    function applyFilter(filterKey, shapeName) {
      let visible = 0;
      studyCards.forEach(function (card) {
        const tags = (card.getAttribute("data-tags") || "").split(/\s+/);
        const match = filterKey === "all" || tags.indexOf(filterKey) !== -1;
        card.hidden = !match;
        if (match) visible += 1;
      });
      if (countDial) {
        countDial.textContent = String(visible).padStart(2, "0");
      }
      if (emptyState) {
        emptyState.hidden = visible > 0;
      }
      if (shapeName) {
        set3DShape(shapeName);
      }
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        applyFilter(
          btn.getAttribute("data-filter") || "all",
          btn.getAttribute("data-shape") || "manifold"
        );
      });
    });

    // Hovering or focusing a study card morphs the live 3D manifold
    studyCards.forEach(function (card) {
      const shape = card.getAttribute("data-shape");
      if (!shape) return;
      card.addEventListener("mouseenter", function () {
        set3DShape(shape);
      });
      card.addEventListener("focus", function () {
        set3DShape(shape);
      });
    });

    // Right-rail [EXPLORING] interactive buttons morph 3D sculpture & sync state
    const exploreBtns = Array.prototype.slice.call(
      document.querySelectorAll(".log-action-btn[data-shape]")
    );
    exploreBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        exploreBtns.forEach(function (b) {
          b.removeAttribute("aria-current");
        });
        btn.setAttribute("aria-current", "true");
        set3DShape(btn.getAttribute("data-shape") || "manifold");
        const targetDossier = btn.getAttribute("data-open-dossier");
        if (targetDossier) {
          openDossier(targetDossier, btn);
        }
      });
    });

    // 5. Accessible Technical Dossier Modal (Escape, backdrop click, focus return)
    const backdrop = document.getElementById("dossier-backdrop");
    let lastTrigger = null;

    function openDossier(studyId, triggerEl) {
      if (!backdrop) return;
      const sections = backdrop.querySelectorAll("[data-dossier-panel]");
      let activePanel = null;
      sections.forEach(function (sec) {
        const match = sec.getAttribute("data-dossier-panel") === studyId;
        sec.hidden = !match;
        if (match) activePanel = sec;
      });
      if (!activePanel) return;
      lastTrigger = triggerEl || document.activeElement;
      backdrop.hidden = false;
      const closeTarget = activePanel.querySelector("[data-close-dossier]");
      if (closeTarget) closeTarget.focus();
    }

    function closeDossier() {
      if (!backdrop || backdrop.hidden) return;
      backdrop.hidden = true;
      if (lastTrigger && typeof lastTrigger.focus === "function") {
        lastTrigger.focus();
      }
    }

    document.querySelectorAll("[data-open-dossier]").forEach(function (el) {
      if (el.classList.contains("log-action-btn")) return;
      el.addEventListener("click", function () {
        openDossier(el.getAttribute("data-open-dossier"), el);
      });
    });

    document.querySelectorAll("[data-close-dossier]").forEach(function (btn) {
      btn.addEventListener("click", closeDossier);
    });
    if (backdrop) {
      backdrop.addEventListener("click", function (ev) {
        if (ev.target === backdrop) closeDossier();
      });
    }
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") closeDossier();
    });

    // 6. Accessible ARIA Output Tabs (Left/Right/Home/End keyboard navigation)
    document.querySelectorAll('[role="tablist"]').forEach(function (tablist) {
      const tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
      const box = tablist.closest(".inspector");
      if (!box || tabs.length === 0) return;

      function activate(tab) {
        const targetId = tab.getAttribute("aria-controls");
        tabs.forEach(function (t) {
          const active = t === tab;
          t.setAttribute("aria-selected", active ? "true" : "false");
          t.setAttribute("tabindex", active ? "0" : "-1");
        });
        box.querySelectorAll('[role="tabpanel"]').forEach(function (panel) {
          panel.hidden = panel.id !== targetId;
        });
      }

      tabs.forEach(function (tab, idx) {
        tab.addEventListener("click", function () {
          activate(tab);
        });
        tab.addEventListener("keydown", function (ev) {
          let next = null;
          if (ev.key === "ArrowRight") next = (idx + 1) % tabs.length;
          else if (ev.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
          else if (ev.key === "Home") next = 0;
          else if (ev.key === "End") next = tabs.length - 1;
          if (next !== null) {
            ev.preventDefault();
            tabs[next].focus();
            activate(tabs[next]);
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
