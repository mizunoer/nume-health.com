/**
 * Populates dynamic nav elements from window.SITE_PAGES (see site-config.js):
 *   - #nav-pages-dropdown            : "More" dropdown in the main nav (public pages only)
 *   - #recommendations-page-select   : page picker on the internal recommendations form
 *
 * Include site-config.js BEFORE this script.
 */
(function () {
  function fillNavPageDropdown() {
    var menu = document.getElementById('nav-pages-dropdown');
    if (!menu || typeof window.SITE_PAGES === 'undefined') return;
    menu.innerHTML = '';
    /* Public-only, and skip the primary "Home" link since the main nav
       already has its own Home item. */
    window.SITE_PAGES.filter(function (p) { return p.public && !p.primary; })
      .forEach(function (p) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = p.url;
        a.textContent = p.label;
        li.appendChild(a);
        menu.appendChild(li);
      });
    /* If only one extra public page exists, hide the More wrapper. */
    if (!menu.children.length) {
      var wrapper = menu.closest('.menu-item-has-children');
      if (wrapper) wrapper.style.display = 'none';
    }
  }

  function fillRecommendationsPageSelect() {
    var select = document.getElementById('recommendations-page-select');
    if (!select || typeof window.SITE_PAGES === 'undefined') return;
    select.innerHTML = '<option value="">Select a page...</option>';
    window.SITE_PAGES.forEach(function (p) {
      var opt = document.createElement('option');
      opt.value = p.url;
      opt.textContent = p.label;
      select.appendChild(opt);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      fillNavPageDropdown();
      fillRecommendationsPageSelect();
    });
  } else {
    fillNavPageDropdown();
    fillRecommendationsPageSelect();
  }
})();
