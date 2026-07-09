/**
 * sister-sites-shared — Landing page renderer (canonical)
 * ------------------------------------------------------------------
 * Reads `window.SITE_CONFIG` (set by each site's `landing-config.js`)
 * and writes values into matching `data-bind="path.to.value"` elements.
 *
 * Supports:
 *   - text bindings:        <span data-bind="product.monthlyPrice">$XXX</span>
 *   - attribute bindings:   <a data-bind-attr="href:disclosures.privacyPolicyUrl">...</a>
 *   - list bindings:        <ul data-bind-list="product.included" data-bind-list-tpl="<li>{value}</li>"></ul>
 *   - show/hide:            <div data-bind-show="product.firstMonthPrice">...</div>
 *   - tracking events:      <a data-track="cta_click">...</a>
 *
 * Tracking is privacy-safe: ONLY the event name is forwarded.
 * No PHI, no clinic identity. If `gtag` or `fbq` are present they receive
 * the generic event; otherwise it logs to `console.debug`.
 *
 * Per-site adapters
 * -----------------
 * If a site has historical config under a brand-prefixed name
 * (e.g. NUME_CONFIG, MRX_CONFIG), the site's `landing-config.js`
 * should alias the brand name AND `SITE_CONFIG` to the same object:
 *
 *   window.SITE_CONFIG = window.NUME_CONFIG = { ... };
 *
 * That keeps DevTools-friendly debugging via the brand prefix
 * and lets every site share this exact renderer file.
 */
(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};

  function get(path) {
    if (!path) return undefined;
    return path.split(".").reduce(function (acc, k) {
      return acc == null ? acc : acc[k];
    }, cfg);
  }

  function isPlaceholder(v) {
    return typeof v === "string" && v.indexOf("[CLIENT TO CONFIRM]") !== -1;
  }

  function render(value, host) {
    if (value == null || value === "") {
      // Leave the existing default content (page already has fallback copy).
      return;
    }
    if (Array.isArray(value)) {
      host.textContent = value.join(", ");
    } else if (isPlaceholder(value)) {
      host.textContent = value;
      host.classList.add("lp-placeholder");
      host.title = "This value is awaiting client confirmation in landing-config.js";
    } else {
      host.textContent = value;
    }
  }

  function bindText(root) {
    root.querySelectorAll("[data-bind]").forEach(function (el) {
      var path = el.getAttribute("data-bind");
      var v = get(path);
      render(v, el);
    });
  }

  function bindAttr(root) {
    root.querySelectorAll("[data-bind-attr]").forEach(function (el) {
      var spec = el.getAttribute("data-bind-attr");
      // Format: "attr1:path1; attr2:path2"
      spec.split(";").forEach(function (pair) {
        var p = pair.trim();
        if (!p) return;
        var i = p.indexOf(":");
        if (i < 0) return;
        var attr = p.slice(0, i).trim();
        var path = p.slice(i + 1).trim();
        var v = get(path);
        if (v != null && !isPlaceholder(v)) el.setAttribute(attr, v);
      });
    });
  }

  function bindList(root) {
    root.querySelectorAll("[data-bind-list]").forEach(function (el) {
      var path = el.getAttribute("data-bind-list");
      var tpl = el.getAttribute("data-bind-list-tpl") || "<li>{value}</li>";
      var v = get(path);
      if (!Array.isArray(v) || v.length === 0) return;
      // Skip placeholder-only lists ([CLIENT TO CONFIRM] entries).
      var clean = v.filter(function (x) { return !isPlaceholder(x); });
      if (!clean.length) return;
      el.innerHTML = clean.map(function (item) {
        if (item && typeof item === "object") {
          // Replace {key} for each property
          return tpl.replace(/\{(\w+)\}/g, function (_, k) {
            return item[k] == null ? "" : String(item[k]);
          });
        }
        return tpl.replace(/\{value\}/g, String(item));
      }).join("");
    });
  }

  function bindShow(root) {
    root.querySelectorAll("[data-bind-show]").forEach(function (el) {
      var path = el.getAttribute("data-bind-show");
      var v = get(path);
      var truthy = !(v == null || v === "" || isPlaceholder(v) || (Array.isArray(v) && v.length === 0));
      if (!truthy) el.style.display = "none";
    });
  }

  /* ---------- Privacy-safe tracking ---------- */
  function track(eventName) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName);
    }
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName);
    }
    if (typeof console !== "undefined" && console.debug) {
      console.debug("[site.track]", eventName);
    }
  }
  window.siteTrack = track;

  function bindTracking(root) {
    root.addEventListener("click", function (e) {
      var t = e.target.closest("[data-track]");
      if (!t) return;
      track(t.getAttribute("data-track"));
    });
  }

  function init() {
    var root = document;
    bindText(root);
    bindAttr(root);
    bindList(root);
    bindShow(root);
    bindTracking(root);
    track("page_view");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
