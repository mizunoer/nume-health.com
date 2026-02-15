/**
 * Populates the "Page" dropdown in the main nav and on the Recommendations form from SITE_PAGES.
 * Include site-config.js before this script.
 */
(function () {
  function fillNavPageDropdown() {
    var menu = document.getElementById('nav-pages-dropdown');
    if (!menu || typeof window.SITE_PAGES === 'undefined') return;
    menu.innerHTML = '';
    window.SITE_PAGES.forEach(function (p) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = p.url;
      a.textContent = p.label;
      li.appendChild(a);
      menu.appendChild(li);
    });
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
