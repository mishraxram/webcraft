// layouts2.js - Layouts 6 and 7 (Showcase, Bento). Same shape as layouts.js: (state, theme) => HTML.
// They are pushed into LAYOUTS, so templates.js makes one template per theme for each of them.

// Showcase: very big headline, sticky section titles on the left, numbered index rows for cards
function showcaseLayout(state, theme) {
  const css = `
body { font-size: 1.0625rem; line-height: 1.6; }
header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--s);
  padding: var(--s) calc(var(--s) * 2); border-bottom: 1px solid var(--line); }
header strong { font-size: 1.125rem; }
header nav a { margin-left: calc(var(--s) * 1.5); color: var(--text); text-decoration: none; font-size: 0.9375rem; }
main { max-width: 84rem; margin: 0 auto; padding: 0 calc(var(--s) * 2); }
.hero { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); column-gap: calc(var(--s) * 3); align-items: end;
  padding: calc(var(--s) * 5) 0 calc(var(--s) * 3); }
.hero > * { grid-column: 1 / -1; }
.hero h1 { font-size: clamp(3rem, 9vw, 8rem); line-height: 0.92; letter-spacing: -0.045em; max-width: 14ch; margin-bottom: calc(var(--s) * 2); }
.hero h1 + p { grid-column: 1; font-size: 1.25rem; color: var(--muted); }
.hero .btn { grid-column: 2; justify-self: end; }
.hero .hero-img { aspect-ratio: 21 / 9; margin-top: calc(var(--s) * 3); }
section:not(.hero) { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 0 calc(var(--s) * 2);
  padding: calc(var(--s) * 4) 0; border-top: 1px solid var(--line); }
section:not(.hero) > * { grid-column: 2; }
section:not(.hero) > h2 { grid-column: 1; grid-row: 1 / span 6; align-self: start; position: sticky; top: 5rem;
  font-size: clamp(1.75rem, 3vw, 2.5rem); line-height: 1.05; }
#about p { font-family: var(--head); font-size: clamp(1.25rem, 2.2vw, 1.75rem); line-height: 1.4; }
.cards { list-style: none; padding: 0; counter-reset: item; }
.cards li { counter-increment: item; display: grid; grid-template-columns: 4rem minmax(0, 1fr) minmax(0, 1.4fr); gap: 0 var(--s);
  align-items: baseline; padding: calc(var(--s) * 1.5) 0; border-bottom: 1px solid var(--line); }
.cards li::before { content: counter(item, decimal-leading-zero); font-size: 0.875rem; color: var(--accent); }
.cards li:hover { transform: translateX(6px); }
.cards h3 { grid-column: 2; font-size: clamp(1.25rem, 2.4vw, 1.75rem); }
.cards p { grid-column: 3; color: var(--muted); }
.cards .card-img { grid-column: 2 / -1; grid-row: 2; aspect-ratio: 21 / 9; margin: var(--s) 0 0; }
.cards .add { grid-column: 2 / -1; justify-self: start; }
#contact { border-top: 4px solid var(--accent); }
footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s);
  width: min(100% - var(--s) * 4, 84rem - var(--s) * 4); margin: 0 auto; padding: calc(var(--s) * 2) 0; color: var(--muted); }
.social a { margin-left: var(--s); }
@media (max-width: 760px) {
  .hero, section:not(.hero) { grid-template-columns: minmax(0, 1fr); }
  .hero h1 + p, .hero .btn, section:not(.hero) > *, section:not(.hero) > h2 { grid-column: 1; }
  .hero .btn { justify-self: start; margin-top: var(--s); }
  section:not(.hero) > h2 { grid-row: auto; position: static; margin-bottom: var(--s); }
  .cards li { grid-template-columns: 3rem minmax(0, 1fr); }
  .cards p, .cards .card-img, .cards .add { grid-column: 2; }
  .cards .card-img { grid-row: auto; }
}`;
  return page(state, theme, css, `<header><strong>${logoHTML(state)}${escapeHTML(state.siteName)}</strong><nav>${navHTML(state)}</nav></header>
<main>${heroHTML(state)}${aboutHTML(state)}${cardsHTML(state)}${contactHTML(state)}</main>${footerHTML(state)}`);
}

// Bento: every section is a tile on a 12-column grid; about and cards share a row (5 / 7)
function bentoLayout(state, theme) {
  const css = `
body { font-size: 1rem; line-height: 1.6; }
header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--s);
  max-width: 80rem; margin: 0 auto; padding: var(--s) calc(var(--s) * 2); }
header strong { font-size: 1.125rem; }
header nav a { margin-left: calc(var(--s) / 2); padding: 4px 12px; color: var(--text); text-decoration: none; font-size: 0.875rem;
  border: 1px solid var(--line); border-radius: min(var(--r), 999px); }
main { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: var(--s);
  max-width: 80rem; margin: 0 auto; padding: var(--s) calc(var(--s) * 2) calc(var(--s) * 3); }
main > section { grid-column: 1 / -1; padding: calc(var(--s) * 2); border: 1px solid var(--line); border-radius: min(var(--r), 16px);
  background: color-mix(in srgb, var(--text) 3%, var(--bg)); transition: border-color 0.3s; }
main > section:hover { border-color: var(--accent); }
.strip { margin-bottom: 0; }
.hero { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); column-gap: calc(var(--s) * 2); align-content: center;
  min-height: 26rem; padding: calc(var(--s) * 3); }
.hero > * { grid-column: 1; justify-self: start; }
.hero .hero-img, .hero .hero-art { grid-column: 2; grid-row: 1 / span 5; justify-self: stretch; align-self: stretch;
  margin: 0; height: 100%; aspect-ratio: auto; }
.hero .hero-art { display: grid; place-items: center; font-size: clamp(7rem, 16vw, 14rem); }
.hero h1 { font-size: clamp(2.25rem, 5vw, 4rem); line-height: 1.02; letter-spacing: -0.03em; margin-bottom: var(--s); }
.hero h1 + p { font-size: 1.125rem; color: var(--muted); margin-bottom: calc(var(--s) * 1.5); }
#about { grid-column: span 5; align-self: start; position: sticky; top: 5rem; }
.work { grid-column: span 7; }
main:not(:has(#about)) .work, main:not(:has(.work)) #about { grid-column: 1 / -1; }
h2 { font-family: var(--body); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.16em; color: var(--muted); margin-bottom: var(--s); }
#about p { font-family: var(--head); font-size: 1.375rem; line-height: 1.45; }
.cards { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--s); }
.cards li { padding: var(--s); border: 1px solid var(--line); border-radius: min(var(--r), 12px); background: var(--bg); }
.cards li:first-child, .cards li:last-child:nth-child(even) { grid-column: 1 / -1; }
.cards li:first-child h3 { font-size: 1.5rem; }
.cards h3 { font-size: 1.125rem; margin-bottom: 4px; }
.cards p { color: var(--muted); font-size: 0.9375rem; }
#contact { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); column-gap: calc(var(--s) * 2); }
#contact > * { grid-column: 1; }
#contact > .contact, #contact > .upi, #contact > form { grid-column: 2; }
footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s);
  width: min(100% - var(--s) * 4, 80rem - var(--s) * 4); margin: 0 auto; padding: calc(var(--s) * 2) 0; color: var(--muted); }
.social a { margin-left: var(--s); }
@media (max-width: 760px) {
  main, .hero, #contact, .cards { grid-template-columns: minmax(0, 1fr); }
  #about, .work, #contact > .contact, #contact > .upi, #contact > form { grid-column: 1 / -1; }
  #about { position: static; }
  .hero { min-height: 0; padding: calc(var(--s) * 2); }
  .hero .hero-img { grid-column: 1; grid-row: auto; height: auto; aspect-ratio: 16 / 9; margin-top: var(--s); }
  .hero .hero-art { display: none; }
}`;
  return page(state, theme, css, `<header><strong>${logoHTML(state)}${escapeHTML(state.siteName)}</strong><nav>${navHTML(state)}</nav></header>
<main>${heroHTML(state)}${aboutHTML(state)}${cardsHTML(state)}${contactHTML(state)}</main>${footerHTML(state)}`);
}

LAYOUTS.push(
  { id: "showcase", name: "Showcase", build: showcaseLayout },
  { id: "bento", name: "Bento", build: bentoLayout }
);
