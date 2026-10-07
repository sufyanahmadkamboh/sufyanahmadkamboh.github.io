/* Shared helpers for the teaching labs: registry loading and the lab card. Used by index.html, labs.html and lab.html. */
(function () {
  const esc = t => String(t ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const LEVELS = ["Beginner", "Intermediate", "Advanced", "Senior"];
  const TYPES = {
    "single-tool depth": "One tool in depth",
    "2-3-tool integration": "Tools working together",
    "multi-technology": "Real-world system",
    "full-lifecycle": "Full lifecycle"
  };
  const typeLabel = t => TYPES[t] || t || "";
  /* "Beginner to Advanced" spans every level from the first to the last, so it matches each of them */
  const levelsOf = l => {
    const [a, b] = String(l || "").split(/\s+to\s+/i).map(x => x.trim());
    const i = LEVELS.indexOf(a), j = LEVELS.indexOf(b);
    return b && i >= 0 && j >= i ? LEVELS.slice(i, j + 1) : [a];
  };
  const hasLevel = (p, l) => levelsOf(p.difficulty).includes(l);
  const levelRank = l => { const i = LEVELS.indexOf(levelsOf(l)[0]); return i < 0 ? LEVELS.length : i; };
  const lvClass = l => "lv-" + String(l || "").replace(/[^\w-]/g, "");
  const tools = p => [p.primary, ...(p.secondary || [])].filter(Boolean);
  const pad = n => String(n).padStart(2, "0");
  const href = p => "lab.html?slug=" + encodeURIComponent(p.slug);

  async function load() {
    const reg = await (await fetch("projects.json", { cache: "no-cache" })).json();
    return (reg.projects || []).filter(p => p.status === "published");
  }

  function card(p) {
    const t = tools(p), shown = t.slice(0, 4), more = t.length - shown.length;
    const n = (p.slides || []).length;
    return `
      <a class="lcard ${lvClass(p.difficulty)}" href="${href(p)}" data-slug="${esc(p.slug)}" aria-label="Lab ${pad(p.number)}: ${esc(p.simple_name || p.name)}">
        <div class="lcard-media">
          <img src="${esc(p.cover || p.image)}" alt="" loading="lazy" decoding="async">
          <span class="lcard-lvl"><i></i>${esc(p.difficulty)}</span>
          ${n ? `<span class="lcard-slides">${Site.icon("play", "sm")}${n} slides</span>` : ""}
        </div>
        <div class="lcard-body">
          <div class="lcard-kicker"><span class="lcard-num">LAB ${pad(p.number)}</span>${esc(p.primary)}</div>
          <h3>${esc(p.simple_name || p.name)}</h3>
          <p>${esc(p.tagline || p.summary)}</p>
          <div class="lcard-tools">${shown.map((x, i) => `<span class="chip-s${i ? "" : " main"}">${esc(x)}</span>`).join("")}${more > 0 ? `<span class="chip-s">+${more}</span>` : ""}</div>
          <div class="lcard-foot">
            ${p.study ? `<span>${Site.icon("book-open", "sm")}Study guide</span>` : ""}${p.study_pdf ? `<span>${Site.icon("file-text", "sm")}PDF</span>` : ""}${p.video ? `<span>${Site.icon("youtube", "sm")}Video</span>` : ""}
            <span class="go">Open lab <span aria-hidden="true">&rarr;</span></span>
          </div>
        </div>
      </a>`;
  }

  window.Labs = { esc, load, card, tools, typeLabel, levelRank, levelsOf, hasLevel, lvClass, pad, href };
})();
