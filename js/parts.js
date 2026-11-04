function safeUrl(url) {
  return /^https?:\/\//i.test(url.trim()) ? escapeHTML(url.trim()) : "";
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const CARD_HEADINGS = { portfolio: "Projects", business: "Services", blog: "Posts",
  event: "Schedule", restaurant: "Menu", student: "Projects" };

const CTAS = { portfolio: "Have a project in mind?", business: "Let's work together.", blog: "Say hello.",
  event: "Questions about the event?", restaurant: "Book a table or order in.", student: "Open to internships and projects." };

const KICKERS = { portfolio: "Selected work", business: "Open for business", blog: "Journal", event: "Save the date",
  restaurant: "Kitchen and dining", student: "Student portfolio" };

function safeImage(src) {
  return typeof src === "string" && /^data:image\/(png|jpeg|svg\+xml|webp);base64,[A-Za-z0-9+/=]+$/.test(src) ? src : "";
}

function imgHTML(src, alt, className) {
  return safeImage(src) ? `<img class="${className}" src="${src}" alt="${escapeHTML(alt)}">` : "";
}

function navHTML(state) {
  return state.menuItems.filter(item => item.trim())
    .map(item => `<a href="#${slug(item)}">${escapeHTML(item)}</a>`).join("");
}

function heroHTML(state) {
  const hasContact = Object.values(state.contact).some(value => value.trim());
  const kicker = KICKERS[state.siteType] ? `<p class="kicker">${KICKERS[state.siteType]}</p>` : "";
  return `<section id="home" class="hero">${kicker}
<h1>${escapeHTML(state.heroTitle || state.siteName)}</h1>
${state.heroText ? `<p>${escapeHTML(state.heroText)}</p>` : ""}
${hasContact ? `<a class="btn" href="#contact">Get in touch ${ARROW_SVG}</a>` : ""}
${imgHTML(state.heroImage, state.heroTitle || state.siteName, "hero-img")}
${!safeImage(state.heroImage) && initialsOf(state) ? `<p class="hero-art" aria-hidden="true">${escapeHTML(initialsOf(state))}</p>` : ""}
</section>${stripHTML(state)}`;
}

function stripHTML(state) {
  const titles = state.cards.map(card => card.title.trim()).filter(Boolean);
  if (titles.length < 3) return "";
  const items = titles.map(title => `<span>${escapeHTML(title)}</span>`).join("");
  return `<div class="strip" aria-hidden="true"><div class="strip-track">${items}${items}</div></div>`;
}

function aboutHTML(state) {
  const photo = imgHTML(state.aboutImage, "About " + state.siteName, "about-img");
  if (!state.about.trim() && !photo) return "";
  return `<section id="about"><h2>About</h2>${photo}<p>${escapeHTML(state.about)}</p></section>`;
}

function cardsHTML(state) {
  const cards = state.cards.filter(card => card.title.trim() || card.detail.trim() || safeImage(card.image));
  if (!cards.length) return "";
  const items = cards.map(card =>
    `<li>${imgHTML(card.image, card.title, "card-img")}<h3>${escapeHTML(card.title)}</h3><p>${escapeHTML(card.detail)}</p></li>`).join("");
  const heading = CARD_HEADINGS[state.siteType] || "Work";
  return `<section id="${slug(heading)}" class="work"><h2>${heading}</h2><ol class="cards">${items}</ol></section>`;
}

function contactHTML(state) {
  const c = state.contact;
  const rows = [];
  if (c.email.trim()) rows.push(`<li class="email"><a href="mailto:${escapeHTML(c.email)}">${escapeHTML(c.email)}</a></li>`);
  if (c.phone.trim()) rows.push(`<li><a href="tel:${c.phone.replace(/[^0-9+]/g, "")}">${escapeHTML(c.phone)}</a></li>`);
  if (c.whatsapp.trim()) rows.push(`<li><a href="https://wa.me/${c.whatsapp.replace(/[^0-9]/g, "")}">WhatsApp</a></li>`);
  if (c.address.trim()) rows.push(`<li>${escapeHTML(c.address)}</li>`);
  if (!rows.length) return "";
  return `<section id="contact"><h2>Contact</h2><p class="cta">${CTAS[state.siteType] || "Get in touch."}</p><ul class="contact">${rows.join("")}</ul></section>`;
}

function initialsOf(state) {
  return state.siteName.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase();
}

function logoHTML(state) {
  if (safeImage(state.logo)) return imgHTML(state.logo, state.siteName + " logo", "logo");
  const initials = initialsOf(state);
  return initials ? `<span class="logo monogram" aria-hidden="true">${escapeHTML(initials)}</span>` : "";
}

function footerHTML(state) {
  const links = Object.keys(state.social).filter(key => safeUrl(state.social[key]))
    .map(key => `<a href="${safeUrl(state.social[key])}">${key}</a>`).join("");
  const madeWith = state.madeWith ? `<p>Made with ${escapeHTML(APP_NAME)}</p>` : "";
  const wordmark = `<p class="wordmark" aria-hidden="true">${escapeHTML(state.siteName)}</p>`;
  return `<footer>${wordmark}${state.footer.trim() ? `<p>${escapeHTML(state.footer)}</p>` : ""}${madeWith}${links ? `<nav class="social">${links}</nav>` : ""}<a class="to-top" href="#home">Back to top</a></footer>`;
}

const FONT_FILES = {
  "Fraunces": [["fraunces-400", 400], ["fraunces-700", 700]],
  "DM Sans": [["dm-sans-400", 400], ["dm-sans-700", 700]],
  "JetBrains Mono": [["jetbrains-mono-400", 400]]
};

function fontFaceCSS(theme) {
  return Object.keys(FONT_FILES).filter(family => (theme.headingFont + theme.bodyFont).includes(family))
    .flatMap(family => FONT_FILES[family].map(([file, weight]) =>
      `@font-face { font-family: "${family}"; src: url(data:font/woff2;base64,${FONT_DATA[file]}) format("woff2"); font-weight: ${weight}; font-display: swap; }`))
    .join("\n");
}

function whatsappHTML(state) {
  const number = state.contact.whatsapp.replace(/[^0-9]/g, "");
  return number ? `<a class="wa" href="https://wa.me/${number}">WhatsApp</a>` : "";
}

function colorVars(c) {
  return `--bg: ${c.bg}; --text: ${c.text}; --muted: ${c.muted}; --accent: ${c.accent}; --on-accent: ${c.onAccent}; --line: ${c.line};`;
}

function page(state, theme, css, body) {
  const c = theme.colors;
  const other = THEMES.find(t => t.id === (theme.dark ? "paper" : "ink")).colors;
  const title = escapeHTML(state.seo.title || state.siteName || "My site");
  const description = escapeHTML(state.seo.description);
  return `<!doctype html>
<html lang="en" class="btn-${theme.button}${theme.caps ? " caps" : ""}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta name="theme-color" content="${c.bg}">
<style>
${fontFaceCSS(theme)}
:root { ${colorVars(c)}
  --head: ${theme.headingFont}; --body: ${theme.bodyFont}; --r: ${theme.radius}px; --s: ${theme.spacing}px; }
html.other-mode { ${colorVars(other)} }
${SITE_CSS}
${css}
</style></head>
<body>${body.replace("</footer>", `<button class="mode-btn" type="button" aria-pressed="false">${theme.dark ? "Light mode" : "Dark mode"}</button></footer>`)}${whatsappHTML(state)}
${MENU_SCRIPT}${MODE_SCRIPT}${REVEAL_SCRIPT}</body></html>`;
}

