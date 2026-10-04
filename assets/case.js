/* Shared behaviour for case-study pages: footer year and the theme toggle (same storage key as the rest of the site). */
(function () {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  const root = document.documentElement, btn = document.getElementById("theme");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });
})();
