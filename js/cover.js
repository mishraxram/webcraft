// cover.js - Opening screen of the builder, like the cover of a magazine.
// Shows on first visit (no project yet) and when the WebCraft name is clicked.
// The three moving "plates" are real templates built from the demo project, not pictures.

const COVER_PLATES = ["bento-saffron", "showcase-emerald", "magazine-ivory"];

// A copy of the demo project with one template, for a plate preview
function plateState(templateId) {
  const copy = JSON.parse(DEFAULT_STATE);
  Object.keys(DEMO_PROJECT).forEach(key => {
    const value = DEMO_PROJECT[key];
    copy[key] = value && typeof value === "object" && !Array.isArray(value) ? Object.assign({}, copy[key], value) : value;
  });
  return Object.assign(copy, { templateId: templateId, themeId: "", fontStyle: "" });
}

function coverLine(text, i, accent) {
  const line = el("span", "cover-line");
  const inner = el(accent ? "em" : "span", "", text);
  inner.style.setProperty("--i", i);
  line.append(inner);
  return line;
}

function openCover() {
  if (document.querySelector(".cover")) return;
  const cover = el("div", "cover");
  cover.setAttribute("role", "dialog");
  cover.setAttribute("aria-modal", "true");
  cover.setAttribute("aria-labelledby", "cover-title");

  const top = el("p", "cover-top");
  top.append(el("span", "", APP_NAME), el("span", "", "Offline website builder / No. 01"));

  const title = el("h1");
  title.id = "cover-title";
  title.append(coverLine("Twelve answers.", 0), coverLine("One finished", 1), coverLine("website.", 2, true));

  const start = el("button", "cover-start", "Start building");
  const demo = el("button", "cover-demo", "Watch the demo");
  start.type = demo.type = "button";
  const actions = el("div", "cover-actions");
  actions.append(start, demo);

  const copy = el("div", "cover-copy");
  copy.append(el("p", "cover-kicker", APP_TAGLINE), title,
    el("p", "cover-lede", "Pick a template, answer twelve short questions, then download or publish. Works with the internet off."), actions);

  // Three real templates, fanned like proofs on a desk
  const plates = el("div", "cover-plates");
  plates.setAttribute("aria-hidden", "true");
  COVER_PLATES.forEach((id, i) => {
    const template = TEMPLATES.find(t => t.id === id);
    const plate = el("figure", "plate");
    plate.style.setProperty("--i", i);
    const frame = el("iframe");
    frame.setAttribute("sandbox", "");
    frame.setAttribute("scrolling", "no");
    frame.tabIndex = -1;
    plate.append(frame, el("figcaption", "", "No. " + String(i + 1).padStart(2, "0") + " / " + template.name));
    plates.append(plate);
    // Built after the first paint so the headline starts moving at once
    setTimeout(() => { frame.srcdoc = buildSite(plateState(id)); }, 120 + i * 60);
  });

  const main = el("div", "cover-main");
  main.append(copy, plates);

  // Ticker with real counts from the data files
  const facts = [TEMPLATES.length + " templates", STEPS.length + " steps", Object.keys(SITE_DEFAULTS).length + " site types",
    Object.keys(FONT_STYLES).length + " font styles", "Download / ZIP / Publish", "0 servers needed", "No AI"];
  const track = el("div", "cover-track");
  facts.concat(facts).forEach(fact => track.append(el("span", "", fact)));
  const ticker = el("div", "cover-ticker");
  ticker.setAttribute("aria-hidden", "true");
  ticker.append(track);

  cover.append(top, main, ticker);
  document.body.append(cover);
  start.focus();

  // Close: the cover wipes up and the builder is already behind it
  function close(then) {
    cover.classList.add("cover-out");
    setTimeout(() => { cover.remove(); if (then) then(); }, 650);
    document.removeEventListener("keydown", onKey);
  }
  function onKey(e) { if (e.key === "Escape") close(); }
  start.onclick = () => close(() => { const first = document.querySelector("#wizard input, #wizard textarea"); if (first) first.focus(); });
  demo.onclick = () => close(playDemo);
  document.addEventListener("keydown", onKey);
}

// The WebCraft name in the masthead opens the cover again
const brand = document.querySelector(".brand");
brand.tabIndex = 0;
brand.setAttribute("role", "button");
brand.setAttribute("aria-label", "Open the cover page");
brand.onclick = openCover;
brand.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCover(); } };

if (!state.siteName.trim()) openCover();
