// legal.js - UPI "Pay" block for the contact section, and simple Privacy / Terms pages for the ZIP.
// The legal pages are plain templates filled from the answers; the user should still check local laws.

// UPI ID looks like name@bank (letters, numbers, dot, dash, underscore before @)
const UPI_PATTERN = /^[a-z0-9._-]{2,64}@[a-z]{2,64}$/i;

function upiId(state) {
  const id = String(state.contact.upi || "").trim();
  return UPI_PATTERN.test(id) ? id : "";
}

const UPI_CSS = `
.upi { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s); margin-top: calc(var(--s) * 1.5);
  padding: var(--s); border: 1px solid var(--line); border-radius: var(--r); max-width: 520px; }
.upi .qr { width: 132px; height: 132px; flex: none; border-radius: var(--r); }
.upi p { margin: 0 0 calc(var(--s) / 2); }
.upi-id { font-family: monospace; overflow-wrap: anywhere; }`;

// Phones open a UPI app from the link; computers show the QR code to scan
function upiHTML(state) {
  const id = upiId(state);
  if (!id) return "";
  const link = "upi://pay?pa=" + encodeURIComponent(id) + "&pn=" + encodeURIComponent(state.siteName.trim() || "Shop") + "&cu=INR";
  const qr = qrSVG(link);
  qr.setAttribute("aria-label", "QR code to pay " + id + " with UPI");
  return `<div class="upi">${qr.outerHTML}<div><p><strong>Pay with UPI</strong></p>` +
    `<p class="upi-id">${escapeHTML(id)}</p><a class="btn" href="${escapeHTML(link)}">Open UPI app</a></div></div>`;
}

// One plain text page in the site's colors, used for Privacy and Terms
function plainPage(state, theme, title, paragraphs) {
  const c = theme.colors;
  const name = escapeHTML(state.siteName || "This site");
  const body = paragraphs.filter(Boolean).map(([head, text]) => `<h2>${head}</h2><p>${text}</p>`).join("\n");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} - ${name}</title><link rel="icon" href="favicon.svg">
<style>body { max-width: 65ch; margin: 0 auto; padding: 48px 24px; background: ${c.bg}; color: ${c.text}; font: 17px/1.6 Georgia, serif; }
h1 { font-size: 2.5rem; line-height: 1.1; } h2 { margin-top: 2em; font-size: 1.25rem; } a { color: ${c.accent}; }
.updated { color: ${c.muted}; font-family: monospace; }</style></head>
<body><p><a href="index.html">&larr; ${name}</a></p><h1>${title}</h1>
<p class="updated">Last updated ${new Date().toISOString().slice(0, 10)}</p>
${body}
</body></html>
`;
}

function contactLine(state) {
  const c = state.contact;
  const way = c.email.trim() ? `<a href="mailto:${escapeHTML(c.email)}">${escapeHTML(c.email)}</a>` : escapeHTML(c.phone || c.whatsapp || c.address);
  return way ? "Questions? Contact us at " + way + "." : "Questions? Use the contact details on the home page.";
}

function privacyHTML(state, theme) {
  const name = escapeHTML(state.siteName || "This site");
  const talks = state.contact.email || state.contact.whatsapp || state.contact.phone;
  return plainPage(state, theme, "Privacy Policy", [
    ["What we collect", name + " does not use cookies, ads or tracking. Just visiting the site sends us nothing."],
    talks ? ["When you contact us", "If you email, call or message us on WhatsApp, we receive your name, number or address and your message. We use them only to reply and never sell or share them."] : null,
    hasOrdering(state) ? ["Orders", "Orders sent on WhatsApp include the dishes you picked, your name and your table or address. We use them only to prepare your order."] : null,
    upiId(state) ? ["Payments", "UPI payments are handled by your UPI app and bank. We never see your UPI PIN or bank details."] : null,
    ["Contact", contactLine(state)]
  ]);
}

function termsHTML(state, theme) {
  const name = escapeHTML(state.siteName || "This site");
  const changes = { restaurant: "Menu items, prices and opening hours may change without notice.",
    business: "Prices and services may change. A quote is final only when we confirm it.",
    event: "The schedule, speakers and venue may change. We will post updates on this page." };
  return plainPage(state, theme, "Terms of Use", [
    ["Using this site", "By using " + name + " you agree to these terms. The text and photos belong to " + name + " unless stated otherwise."],
    changes[state.siteType] ? ["Changes", changes[state.siteType]] : null,
    ["Links", "Links to other sites are for your convenience. We are not responsible for their content."],
    ["Contact", contactLine(state)]
  ]);
}
