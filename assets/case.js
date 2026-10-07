/* Shared behaviour for case-study pages: footer year. Theme toggle and mobile menu: assets/site.js. */
(function () {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
