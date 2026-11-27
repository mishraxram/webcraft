// seo.js - search engine extras for the generated site:
// favicon, JSON-LD (Google's structured data), canonical link, sitemap.xml, robots.txt and a 404 page.

// Google's name for each site type
const LD_TYPES = { restaurant: "Restaurant", business: "LocalBusiness", event: "Event",
  portfolio: "Person", student: "Person", blog: "Blog" };

// The user's own web address (step 11), only if it is a clean http(s) link
function siteUrl(state) {
  const url = String(state.seo.url || "").trim().replace(/\/+$/, "");
  return /^https?:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/[a-z0-9._~\/-]*)?$/i.test(url) ? url : "";
}

// Square icon with the site initials in the theme colors
function faviconSVG(state, theme) {
  const c = theme.colors;
  const initials = escapeHTML(initialsOf(state) || "W");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="${Math.min(theme.radius, 16)}" fill="${c.accent}"/>` +
    `<text x="32" y="42" font-family="Georgia, serif" font-size="28" font-weight="700" text-anchor="middle" fill="${c.onAccent}">${initials}</text></svg>`;
}

// Structured data so Google can show the name, phone and address in results
function jsonLd(state) {
  const data = { "@context": "https://schema.org", "@type": LD_TYPES[state.siteType] || "WebSite", name: state.siteName };
  const description = state.seo.description || state.heroText;
  if (description) data.description = description;
  if (siteUrl(state)) data.url = siteUrl(state);
  if (state.contact.email) data.email = state.contact.email;
  if (state.contact.phone) data.telephone = state.contact.phone;
  if (state.contact.address && data["@type"] !== "Person") data.address = state.contact.address;
  if (ldHours(state) && data["@type"] !== "Person") data.openingHours = ldHours(state);
  const links = Object.values(state.social).filter(link => /^https:\/\//i.test(link));
  if (links.length) data.sameAs = links;
  // "<" is written as < so no text can close the script tag early
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// Extra lines for <head>: icon, canonical link, structured data
function seoHeadHTML(state, theme) {
  const url = siteUrl(state);
  const icon = "data:image/svg+xml," + encodeURIComponent(faviconSVG(state, theme));
  return `<link rel="icon" href="${icon}">` +
    (url ? `\n<link rel="canonical" href="${escapeHTML(url)}/">\n<meta property="og:url" content="${escapeHTML(url)}/">` : "") +
    `\n<script type="application/ld+json">${jsonLd(state)}</script>`;
}

function robotsTXT(state) {
  return "User-agent: *\nAllow: /\n" + (siteUrl(state) ? "Sitemap: " + siteUrl(state) + "/sitemap.xml\n" : "");
}

// Sitemap needs a full web address, so it is only made when step 11 has one
function sitemapXML(state) {
  if (!siteUrl(state)) return "";
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url><loc>${escapeHTML(siteUrl(state))}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`;
}

// Small "page not found" page in the same colors as the site
function notFoundHTML(state, theme) {
  const c = theme.colors;
  const name = escapeHTML(state.siteName || "this site");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found - ${name}</title><link rel="icon" href="favicon.svg">
<style>body { margin: 0; min-height: 100vh; display: grid; place-content: center; padding: 32px; background: ${c.bg}; color: ${c.text}; font-family: Georgia, serif; }
p:first-child { font-family: monospace; color: ${c.muted}; } a { color: ${c.accent}; }</style></head>
<body><p>404</p><h1>This page does not exist.</h1><p><a href="index.html">Go to the ${name} home page</a></p></body></html>
`;
}
