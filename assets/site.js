/* Shared site chrome for every page: Lucide icon helper, the Sun/Moon theme toggle and the mobile menu.
   Theme choice is stored under the same localStorage key ("theme") the pages read before first paint. */
(function () {
  const root = document.documentElement;
  const SPRITE = new URL("icons.svg", document.currentScript.src).href;
  const icon = (name, cls) => `<svg class="i${cls ? " " + cls : ""}" aria-hidden="true" focusable="false"><use href="${SPRITE}#${name}"></use></svg>`;
  window.Site = { icon };

  /* theme toggle: shows the mode you switch to (sun in dark mode, moon in light mode) */
  const media = matchMedia("(prefers-color-scheme: dark)");
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : media.matches;
  function paint(btn) {
    const label = isDark() ? "Switch to light mode" : "Switch to dark mode";
    btn.innerHTML = icon(isDark() ? "sun" : "moon");
    btn.setAttribute("aria-label", label);
    btn.title = label;
  }
  function initTheme() {
    const btn = document.getElementById("theme");
    if (!btn) return;
    btn.classList.add("icon-btn");
    btn.classList.remove("theme");
    paint(btn);
    btn.addEventListener("click", () => {
      root.dataset.theme = isDark() ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
      paint(btn);
    });
    media.addEventListener("change", () => paint(btn));
  }

  /* mobile menu: same destinations as the desktop links, shown at 820px and below */
  function initMenu() {
    const nav = document.querySelector("nav.site-nav");
    const links = nav && nav.querySelector(".links, .nlinks");
    if (!links) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "icon-btn menu-btn";
    btn.setAttribute("aria-controls", "mnav");
    links.appendChild(btn);

    const panel = document.createElement("div");
    panel.className = "mnav";
    panel.id = "mnav";
    panel.hidden = true;
    const items = [...links.querySelectorAll("a")].map(a => {
      const hire = a.classList.contains("hire");
      const cur = a.getAttribute("aria-current") ? ' aria-current="page"' : "";
      return `<li><a href="${a.getAttribute("href")}"${hire ? ' class="hire"' : ""}${cur}>${a.textContent.trim()}${hire ? "" : icon("arrow-right", "sm")}</a></li>`;
    });
    panel.innerHTML = `<ul>${items.join("")}</ul>`;
    nav.appendChild(panel);

    const set = open => {
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      btn.innerHTML = icon(open ? "x" : "menu");
    };
    const close = (refocus) => { if (panel.hidden) return; set(false); if (refocus) btn.focus(); };
    set(false);

    btn.addEventListener("click", () => {
      const open = panel.hidden;
      set(open);
      if (open) panel.querySelector("a").focus();
    });
    panel.addEventListener("click", e => { if (e.target.closest("a")) close(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(true); });
    document.addEventListener("pointerdown", e => { if (!nav.contains(e.target)) close(false); });
    nav.addEventListener("focusout", e => { if (e.relatedTarget && !nav.contains(e.relatedTarget)) close(false); });
    matchMedia("(min-width: 821px)").addEventListener("change", e => { if (e.matches) close(false); });
  }

  initTheme();
  initMenu();
})();
