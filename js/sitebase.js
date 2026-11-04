const SITE_CSS = `
* { box-sizing: border-box; margin: 0; }
body { background: var(--bg); color: var(--text); font-family: var(--body); overflow-wrap: anywhere;
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
  padding-bottom: 72px; }
h1, h2, h3, header strong, aside strong { font-family: var(--head); }
h1, h2, h3 { text-wrap: balance; }
h1 { letter-spacing: -0.02em; }
p { max-width: 68ch; }
a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 0.2em; transition: color 0.2s; }
header nav a, aside nav a { text-decoration: underline 1px transparent; transition: color 0.2s, text-decoration-color 0.2s; }
header nav a:hover, aside nav a:hover { color: var(--accent); text-decoration-color: currentColor; }
::selection { background: var(--accent); color: var(--on-accent); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.hero .kicker { display: flex; align-items: center; gap: 0.75em; margin: 0 0 calc(var(--s) * 1.25); max-width: none; font-family: var(--body);
  font-size: 0.75rem; font-weight: bold; letter-spacing: 0.18em; text-transform: uppercase; font-style: normal; line-height: 1.4; color: var(--accent); }
.hero .kicker::before { content: ""; width: 2.5rem; height: 1px; background: currentColor; }

.btn { display: inline-flex; align-items: center; gap: 0.6em; background: var(--accent); color: var(--on-accent);
  text-decoration: none; font-weight: bold; padding: calc(var(--s) * 0.75) calc(var(--s) * 1.5); border-radius: var(--r);
  transition: background-color 0.2s, color 0.2s; }
.btn:hover { background: var(--text); color: var(--bg); }
.btn svg { transition: transform 0.2s ease-out; }
.btn:hover svg { transform: translateX(4px); }

:where(.btn-outline) .btn { background: transparent; color: var(--text); box-shadow: inset 0 0 0 1px currentColor; }
:where(.btn-outline) .btn:hover { background: var(--text); color: var(--bg); }
:where(.btn-underline) .btn { background: transparent; color: var(--text); padding: 4px 0; border-radius: 0;
  border-bottom: 2px solid var(--accent); }
:where(.btn-underline) .btn:hover { background: transparent; color: var(--accent); }
.caps h2 { font-family: var(--body); font-size: 0.875rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.16em; }

.contact { list-style: none; padding: 0; }
.contact .email a { font-family: var(--head); font-size: clamp(1.5rem, 4vw, 2.25rem); line-height: 1.2; color: var(--text);
  text-decoration: underline 1px var(--accent); text-underline-offset: 0.15em; }
.contact .email a:hover { color: var(--accent); }
.cards h3 { transition: color 0.2s; }
.cards li:hover h3 { color: var(--accent); }

.logo { height: 1.5em; width: auto; vertical-align: middle; margin-right: 0.5em; }
.monogram { display: inline-grid; place-items: center; width: 1.9em; height: 1.9em; background: var(--accent); color: var(--on-accent);
  font-family: var(--head); font-size: 0.85em; font-weight: bold; letter-spacing: 0; border-radius: min(var(--r), 8px); }
.hero-img, .about-img, .card-img { display: block; width: 100%; height: auto; object-fit: cover; border-radius: min(var(--r), 12px); }
.hero h1 + .btn { margin-top: calc(var(--s) * 2); }
.hero-img { aspect-ratio: 16 / 9; margin-top: calc(var(--s) * 2); }
.about-img { aspect-ratio: 4 / 3; max-width: 28rem; margin-bottom: var(--s); }
.card-img { aspect-ratio: 4 / 3; margin-bottom: var(--s); }
header { position: sticky; top: 0; z-index: 1; background: var(--bg); }
section { scroll-margin-top: 5rem; }
html { scroll-padding-top: 5rem; }
.to-top { color: inherit; }
.wa { position: fixed; right: 16px; bottom: 16px; z-index: 2; background: var(--accent); color: var(--on-accent);
  padding: 10px 16px; border-radius: min(var(--r), 24px); text-decoration: none; font-weight: bold; }

.hero .hero-art { display: none; margin: 0; max-width: none; font-family: var(--head); font-weight: bold; line-height: 0.8;
  letter-spacing: -0.05em; color: transparent; -webkit-text-stroke: 2px var(--accent); user-select: none; }

.strip { position: relative; overflow-x: clip;
  border-block: 1px solid var(--line); padding: calc(var(--s) * 0.75) 0;
  margin-bottom: calc(var(--s) * 2); grid-column: 1 / -1; }
.strip-track { display: flex; width: max-content; font-family: var(--head); font-size: clamp(1.25rem, 3vw, 2rem); white-space: nowrap; }
.strip-track span { padding-right: 1.5em; }
.strip-track span::after { content: "/"; padding-left: 1.5em; color: var(--accent); }
.strip:hover .strip-track, .strip.paused .strip-track { animation-play-state: paused; }
.strip-btn { position: absolute; right: 0; top: 0; transform: translateY(-50%);
  padding: 4px 10px; font: inherit; font-size: 0.75rem;
  cursor: pointer; background: var(--bg); color: var(--text); border: 1px solid var(--line); border-radius: min(var(--r), 8px); }

#contact .cta { max-width: 18ch; margin-bottom: calc(var(--s) * 1.5); font-family: var(--head); font-weight: bold;
  font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.05; letter-spacing: -0.02em; color: var(--text); }

footer { container-type: inline-size; }
footer .wordmark { flex-basis: 100%; width: 100%; max-width: none; margin-bottom: var(--s); font-family: var(--head); font-weight: bold;
  font-size: min(13cqi, 9rem); line-height: 0.9; letter-spacing: -0.04em; text-transform: none; color: var(--text); }

@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
  .hero > * { animation: rise 0.6s ease-out both; }
  .hero > :nth-child(2) { animation-delay: 0.08s; }
  .hero > :nth-child(3) { animation-delay: 0.16s; }
  .hero > :nth-child(n+4) { animation-delay: 0.24s; }
  .reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease-out, transform 0.5s ease-out; }
  .reveal.in { opacity: 1; transform: none; }
  .strip-track { animation: slide 40s linear infinite; }
}
@keyframes slide { to { transform: translateX(-50%); } }
@keyframes rise { from { opacity: 0; transform: translateY(12px); } }

.menu-btn { display: none; font: inherit; font-size: 0.875rem; background: none; color: var(--text); cursor: pointer;
  border: 1px solid var(--line); border-radius: min(var(--r), 8px); padding: 4px 12px; }
@media (max-width: 600px) {
  .menu-btn { display: inline-block; }
  .menu-btn + nav { display: none; flex-basis: 100%; }
  .menu-btn + nav.open { display: block; }
  .menu-btn + nav a { display: block; margin: 0; padding: 8px 0; }
}
.mode-btn { font: inherit; font-size: 0.875rem; cursor: pointer; background: var(--bg); color: var(--text);
  border: 1px solid var(--line); border-radius: min(var(--r), 24px); padding: 8px 14px; transition: background-color 0.2s, color 0.2s; }
.mode-btn:hover { background: var(--text); color: var(--bg); }
`;

const ARROW_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;

const MODE_SCRIPT = `<script>
const modeButton = document.querySelector(".mode-btn");
const setMode = on => { document.documentElement.classList.toggle("other-mode", on); modeButton.setAttribute("aria-pressed", on); };
try { setMode(localStorage.getItem("site-mode:" + location.pathname) === "other"); } catch (e) {}
modeButton.onclick = () => {
  const on = !document.documentElement.classList.contains("other-mode");
  setMode(on);
  try { localStorage.setItem("site-mode:" + location.pathname, on ? "other" : "normal"); } catch (e) {}
};
</script>`;

const MENU_SCRIPT = `<script>
const menu = document.querySelector("header nav, aside nav");
if (menu && menu.children.length) {
  const button = document.createElement("button");
  button.className = "menu-btn";
  button.textContent = "Menu";
  button.setAttribute("aria-expanded", "false");
  menu.id = "site-menu";
  button.setAttribute("aria-controls", "site-menu");
  menu.before(button);
  const setOpen = open => { menu.classList.toggle("open", open); button.setAttribute("aria-expanded", open); };
  button.onclick = () => setOpen(!menu.classList.contains("open"));
  menu.onclick = event => { if (event.target.closest("a")) setOpen(false); };
}
</script>`;

const REVEAL_SCRIPT = `<script>
if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const watcher = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("in"); watcher.unobserve(entry.target); }
  }), { threshold: 0.1 });
  document.querySelectorAll("main section:not(.hero)").forEach(section => {
    section.classList.add("reveal");
    watcher.observe(section);
  });
  const strip = document.querySelector(".strip");
  if (strip) {
    const pause = document.createElement("button");
    pause.className = "strip-btn";
    pause.type = "button";
    pause.textContent = "Pause";
    pause.setAttribute("aria-pressed", "false");
    pause.onclick = () => pause.setAttribute("aria-pressed", strip.classList.toggle("paused"));
    strip.append(pause);
  }
}
</script>`;
