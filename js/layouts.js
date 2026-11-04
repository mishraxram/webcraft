function classicLayout(state, theme) {
  const css = `
body { font-size: 1.0625rem; line-height: 1.6; }
header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: var(--s);
  padding: var(--s) calc(var(--s) * 2); border-bottom: 1px solid var(--line); }
header strong { font-size: 1.25rem; }
header nav a { margin-left: var(--s); color: var(--text); text-decoration: none; }
main { max-width: 68rem; margin: 0 auto; padding: 0 calc(var(--s) * 2); }
section { padding: calc(var(--s) * 3) 0; border-top: 1px solid var(--line); }
.hero { padding: calc(var(--s) * 6) 0 calc(var(--s) * 4); max-width: 44rem; border-top: 0; }
.hero:has(.hero-img) { max-width: none; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: calc(var(--s) * 3); align-items: center; }
.hero:has(.hero-img) > :not(.hero-img) { grid-column: 1; justify-self: start; }
.hero .hero-img { grid-column: 2; grid-row: 1 / span 3; margin: 0; aspect-ratio: 4 / 3; }
.hero:has(.hero-art) { max-width: none; display: grid; grid-template-columns: minmax(0, 1fr) auto;
  column-gap: calc(var(--s) * 3); align-items: center; }
.hero:has(.hero-art) > :not(.hero-art) { grid-column: 1; justify-self: start; }
.hero:has(.hero-art) .hero-art { display: block; grid-column: 2; grid-row: 1 / span 4; font-size: clamp(8rem, 20vw, 17rem); }
.hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); line-height: 1.05; }
.hero p { font-size: 1.25rem; color: var(--muted); margin: calc(var(--s) * 1.5) 0 calc(var(--s) * 2); }
h2 { font-size: 1.75rem; margin-bottom: calc(var(--s) * 1.5); }
.cards { list-style: none; padding: 0; display: grid; gap: calc(var(--s) * 1.5);
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); }
.cards li { padding-top: var(--s); border-top: 2px solid var(--text); }
.cards h3 { font-size: 1.25rem; margin-bottom: calc(var(--s) * 0.5); }
.contact { line-height: 2; }
footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s);
  width: min(100% - var(--s) * 4, 68rem - var(--s) * 4); margin: 0 auto; padding: calc(var(--s) * 2) 0;
  border-top: 1px solid var(--line); color: var(--muted); }
#contact h2 { font-family: var(--body); font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.16em; color: var(--muted); }
.social a { margin-left: var(--s); }
@media (max-width: 760px) {
  .hero:has(.hero-img) { grid-template-columns: minmax(0, 1fr); }
  .hero .hero-img { grid-column: 1; grid-row: auto; margin-top: calc(var(--s) * 2); }
  .hero:has(.hero-art) { grid-template-columns: minmax(0, 1fr); }
  .hero:has(.hero-art) .hero-art { display: none; }
}`;
  return page(state, theme, css, `<header><strong>${logoHTML(state)}${escapeHTML(state.siteName)}</strong><nav>${navHTML(state)}</nav></header>
<main>${heroHTML(state)}${aboutHTML(state)}${cardsHTML(state)}${contactHTML(state)}</main>${footerHTML(state)}`);
}

function sidebarLayout(state, theme) {
  const css = `
body { font-size: 1rem; line-height: 1.7; display: grid; grid-template-columns: 16rem 1fr; min-height: 100vh; }
aside { padding: calc(var(--s) * 2); border-right: 1px solid var(--line); }
aside strong { display: block; font-size: 1.5rem; line-height: 1.1; margin-bottom: calc(var(--s) * 2); }
aside nav a { display: block; padding: calc(var(--s) * 0.25) 0; color: var(--text); text-decoration: none; }
main { min-width: 0; padding: calc(var(--s) * 3); max-width: 60rem; }
section { margin-bottom: calc(var(--s) * 3); }
.hero h1 { font-size: 2.25rem; line-height: 1.15; }
.hero p { color: var(--muted); margin: var(--s) 0 calc(var(--s) * 1.5); }
h2 { font-family: var(--body); font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--muted); margin-bottom: var(--s); }
.cards { list-style: none; padding: 0; }
.cards li { display: grid; grid-template-columns: 12rem 1fr; gap: var(--s); padding: var(--s) 0;
  border-bottom: 1px solid var(--line); }
.cards h3 { font-size: 1rem; }
.cards li:has(.card-img) { grid-template-columns: 8rem 1fr; }
.cards .card-img { grid-row: span 2; aspect-ratio: 1; margin: 0; }
footer { grid-column: 1 / -1; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--s);
  padding: var(--s) calc(var(--s) * 2); border-top: 1px solid var(--line);
  font-size: 0.875rem; color: var(--muted); }
.social a { margin-right: var(--s); }
@media (max-width: 700px) {
  body { grid-template-columns: 1fr; }
  aside { border-right: 0; border-bottom: 1px solid var(--line); }
  .cards li { grid-template-columns: 1fr; }
}`;
  return page(state, theme, css, `<aside><strong>${logoHTML(state)}${escapeHTML(state.siteName)}</strong><nav>${navHTML(state)}</nav></aside>
<main>${heroHTML(state)}${aboutHTML(state)}${cardsHTML(state)}${contactHTML(state)}</main>${footerHTML(state)}`);
}

function minimalLayout(state, theme) {
  const css = `
body { font-size: 1.125rem; line-height: 1.75; }
.wrap { max-width: 38rem; margin: 0 auto; padding: calc(var(--s) * 4) calc(var(--s) * 2); }
header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s);
  font-size: 0.875rem; margin-bottom: calc(var(--s) * 6); }
header nav a { margin-left: var(--s); color: var(--muted); }
.hero h1 { font-size: 1.75rem; line-height: 1.3; font-weight: normal; }
.hero p { color: var(--muted); margin: var(--s) 0 calc(var(--s) * 2); }
.btn { background: none; color: var(--accent); padding: 0; border-radius: 0; border-bottom: 1px solid var(--accent); }
.btn:hover { background: none; color: var(--text); }
#contact .cta { font-size: 1.75rem; font-weight: normal; font-style: italic; }
section { margin-top: calc(var(--s) * 6); }
h2 { font-family: var(--body); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;
  color: var(--muted); margin-bottom: calc(var(--s) * 2); }
.cards { padding-left: 1.25rem; }
.cards li { margin-bottom: calc(var(--s) * 1.5); }
.cards h3 { font-size: 1.125rem; font-weight: normal; font-style: italic; }
footer { max-width: 38rem; margin: 0 auto; padding: calc(var(--s) * 2); font-size: 0.875rem; color: var(--muted); }
.social a { margin-right: var(--s); }`;
  return page(state, theme, css, `<div class="wrap"><header><strong>${logoHTML(state)}${escapeHTML(state.siteName)}</strong><nav>${navHTML(state)}</nav></header>
<main>${heroHTML(state)}${aboutHTML(state)}${cardsHTML(state)}${contactHTML(state)}</main></div>${footerHTML(state)}`);
}

function splitLayout(state, theme) {
  const css = `
body { font-size: 1rem; line-height: 1.6; }
header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s);
  padding: calc(var(--s) * 1.5) calc(var(--s) * 2); max-width: 72rem; margin: 0 auto; }
header strong { font-size: 1.125rem; }
header nav a { margin-left: var(--s); color: var(--text); }
main { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: calc(var(--s) * 3);
  max-width: 72rem; margin: 0 auto; padding: 0 calc(var(--s) * 2) calc(var(--s) * 3); }
.hero { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: calc(var(--s) * 3); align-items: end; padding: calc(var(--s) * 4) 0; border-bottom: 1px solid var(--line); }
.hero .kicker { grid-column: 1 / -1; }
.hero:has(+ .strip) { border-bottom: 0; }
.hero h1 { grid-row: span 2; font-size: clamp(2.25rem, 5vw, 3.25rem); line-height: 1.1; }
.hero p { color: var(--muted); }
.hero .btn { grid-column: 1; justify-self: start; }
.hero .hero-img { grid-column: 1 / -1; margin: 0; aspect-ratio: 21 / 9; }
.strip { grid-row: 2; }
.work { grid-column: 1; grid-row: 2 / span 2; }
main:has(.strip) .work { grid-row: 3 / span 2; }
#contact .cta { font-size: 1.75rem; }
#about, #contact { grid-column: 2; border: 1px solid var(--line); border-radius: min(var(--r), 12px); padding: calc(var(--s) * 1.5); }
h2 { display: inline-block; font-size: 1.25rem; margin-bottom: var(--s); border-bottom: 2px solid var(--accent); }
.cards { list-style: none; padding: 0; }
.cards li { padding: var(--s) 0; border-top: 1px solid var(--line); }
.cards li:has(.card-img) { display: grid; grid-template-columns: 6rem 1fr; column-gap: calc(var(--s) * 1.5); }
.cards li .card-img { grid-row: span 2; aspect-ratio: 1; margin: 0; }
.cards h3 { font-size: 1.0625rem; }
footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s);
  width: min(100% - var(--s) * 4, 72rem - var(--s) * 4); margin: 0 auto; padding: calc(var(--s) * 2) 0;
  border-top: 1px solid var(--line); font-size: 0.875rem; color: var(--muted); }
.social a { margin-left: var(--s); }
@media (max-width: 760px) {
  main, .hero { grid-template-columns: minmax(0, 1fr); }
  .hero h1 { grid-row: auto; }
  .work, #about, #contact { grid-column: 1; grid-row: auto; }
}`;
  return page(state, theme, css, `<header><strong>${logoHTML(state)}${escapeHTML(state.siteName)}</strong><nav>${navHTML(state)}</nav></header>
<main>${heroHTML(state)}${aboutHTML(state)}${cardsHTML(state)}${contactHTML(state)}</main>${footerHTML(state)}`);
}

function magazineLayout(state, theme) {
  const css = `
body { font-size: 1.0625rem; line-height: 1.65; }
header { max-width: 80rem; margin: 0 auto; padding: calc(var(--s) * 2) calc(var(--s) * 2) 0; }
.mast-row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: var(--s);
  border-top: 8px solid var(--text); border-bottom: 1px solid var(--line); padding: var(--s) 0; }
header strong { font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.15em; }
header nav a { margin-left: var(--s); color: var(--text); text-decoration: none; text-transform: uppercase;
  font-size: 0.8125rem; letter-spacing: 0.1em; }
main { max-width: 80rem; margin: 0 auto; padding: 0 calc(var(--s) * 2); }
.hero { padding: calc(var(--s) * 3) 0 calc(var(--s) * 4); border-bottom: 3px double var(--line); }
.hero h1 { font-size: clamp(2.75rem, 9vw, 6.5rem); line-height: 0.95; letter-spacing: -0.03em; text-transform: uppercase; max-width: 18ch; }
.hero p { font-family: var(--head); font-style: italic; font-size: 1.375rem; max-width: 36rem; margin: calc(var(--s) * 1.5) 0; }
section:not(.hero) { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 5fr);
  gap: calc(var(--s) * 2); padding: calc(var(--s) * 3) 0; border-bottom: 1px solid var(--line); }
section:not(.hero) h2 { align-self: start; font-size: 1.75rem; line-height: 1.1; padding-top: var(--s); border-top: 4px solid var(--accent); }
section:not(.hero) > :not(h2) { grid-column: 2; }
#about p { column-width: 20rem; column-gap: calc(var(--s) * 2); }
.cards { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); gap: calc(var(--s) * 2); }
.cards li { border-top: 3px solid var(--text); padding-top: var(--s); }
.cards h3 { font-size: 1.25rem; text-transform: uppercase; letter-spacing: 0.02em; }
footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s); max-width: 80rem; margin: 0 auto;
  padding: calc(var(--s) * 2); font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.1em; }
.social a { margin-left: var(--s); }
@media (max-width: 760px) {
  section:not(.hero) { grid-template-columns: minmax(0, 1fr); }
  section:not(.hero) > :not(h2) { grid-column: 1; }
}`;
  return page(state, theme, css, `<header><div class="mast-row"><strong>${logoHTML(state)}${escapeHTML(state.siteName)}</strong><nav>${navHTML(state)}</nav></div></header>
<main>${heroHTML(state)}${aboutHTML(state)}${cardsHTML(state)}${contactHTML(state)}</main>${footerHTML(state)}`);
}

const LAYOUTS = [
  { id: "classic", name: "Classic", build: classicLayout },
  { id: "sidebar", name: "Sidebar", build: sidebarLayout },
  { id: "minimal", name: "Minimal", build: minimalLayout },
  { id: "split", name: "Split", build: splitLayout },
  { id: "magazine", name: "Magazine", build: magazineLayout }
];
