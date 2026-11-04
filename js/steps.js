const STEPS = [
  { id: "name", title: "Site name and logo", help: "Shown in the header and browser tab. No logo? Your initials are used.",
    fields: [
      { type: "text", field: "siteName", label: "Site name", required: true, maxLength: 40 },
      { type: "text", field: "logo", label: "Logo (optional)", image: true, maxSide: 400 }
    ] },

  { id: "type", title: "Site type", help: "Pick what the site is for.",
    type: "mcq", field: "siteType", label: "Site type", required: true,
    options: ["portfolio", "business", "blog", "event", "restaurant", "student"] },

  { id: "template", title: "Pick a template", help: "Filter by layout or search by theme name. You can change colors in the next step.",
    type: "mcq", field: "templateId", label: "Template", required: true, gallery: true,
    options: TEMPLATES.map(template => template.id) },

  { id: "theme", title: "Colors and font", help: "Optional. Leave as is to keep the template look.",
    fields: [
      { type: "mcq", field: "themeId", label: "Color theme", options: THEMES.map(theme => theme.id) },
      { type: "mcq", field: "fontStyle", label: "Font style", options: ["serif", "sans", "mono"] }
    ] },

  { id: "menu", title: "Menu items", help: "Up to 6 links in the top menu.",
    type: "list", field: "menuItems", label: "Menu item", maxItems: 6, maxLength: 20 },

  { id: "hero", title: "Headline", help: "The first thing visitors read.",
    fields: [
      { type: "text", field: "heroTitle", label: "Headline", required: true, maxLength: 80 },
      { type: "text", field: "heroText", label: "Subtext", maxLength: 200 },
      { type: "text", field: "heroImage", label: "Main image (optional)", image: true }
    ] },

  { id: "about", title: "About", help: "A short paragraph about you or the business, and a photo if you like.",
    fields: [
      { type: "text", field: "about", label: "About text", multiline: true, maxLength: 600 },
      { type: "text", field: "aboutImage", label: "About photo (optional)", image: true }
    ] },

  { id: "cards", title: "Services or projects", help: "Up to 6 cards. Each has a title, a detail and an optional image.",
    type: "list", field: "cards", label: "Card", maxItems: 6, maxLength: 120, itemFields: ["title", "detail"], itemImage: true },

  { id: "contact", title: "Contact details", help: "Fill only what you want to show.",
    fields: [
      { type: "text", field: "contact.email", label: "Email", check: "email", maxLength: 80 },
      { type: "text", field: "contact.phone", label: "Phone", check: "phone", maxLength: 20 },
      { type: "text", field: "contact.whatsapp", label: "WhatsApp number", check: "phone", maxLength: 20 },
      { type: "text", field: "contact.address", label: "Address", maxLength: 150 }
    ] },

  { id: "footer", title: "Footer and social links", help: "Small text at the bottom and your profile links.",
    fields: [
      { type: "text", field: "footer", label: "Footer text", maxLength: 100 },
      { type: "text", field: "social.instagram", label: "Instagram link", maxLength: 100 },
      { type: "text", field: "social.linkedin", label: "LinkedIn link", maxLength: 100 },
      { type: "text", field: "social.github", label: "GitHub link", maxLength: 100 }
    ] },

  { id: "seo", title: "Search engine info", help: "Title and description show in Google results and the browser tab.",
    fields: [
      { type: "text", field: "seo.title", label: "Page title", maxLength: 60 },
      { type: "text", field: "seo.description", label: "Page description", multiline: true, maxLength: 160 }
    ] },

  { id: "review", title: "Review", help: "Check your answers, then download or publish your site.",
    type: "review" }
];

const SITE_DEFAULTS = {
  portfolio: { menu: ["Home", "Projects", "About", "Contact"], heroTitle: "I design and build websites people enjoy",
    heroText: "One line: what you do and for whom.", about: "Who you are, what you are good at, what work you want.",
    "cards.title": "Project name", "cards.detail": "One line: what it is and your part in it" },
  business: { menu: ["Home", "Services", "About", "Contact"], heroTitle: "Fresh bread every morning in Pune",
    heroText: "Open 7am to 9pm. Order on WhatsApp.", about: "When you started, what you sell, why people come back.",
    "cards.title": "Service name", "cards.detail": "One line: what the customer gets" },
  blog: { menu: ["Home", "Posts", "About", "Contact"], heroTitle: "Notes on code and college life",
    heroText: "A new post every week.", about: "Who writes here and what about.",
    "cards.title": "Post title", "cards.detail": "One line summary of the post" },
  event: { menu: ["Home", "Schedule", "About", "Contact"], heroTitle: "TechFest 2026, 14-15 March",
    heroText: "Two days of talks, workshops and a hackathon.", about: "What happens, who it is for, how to join.",
    "cards.title": "Session name and time", "cards.detail": "One line: who speaks and what about" },
  restaurant: { menu: ["Home", "Menu", "About", "Contact"], heroTitle: "South Indian food, made fresh",
    heroText: "Open daily 11am to 11pm.", about: "Your story, your kitchen, what to try first.",
    "cards.title": "Dish name and price", "cards.detail": "One line: what is in it" },
  student: { menu: ["Home", "Projects", "About", "Contact"], heroTitle: "B.Tech CSE student, building for the web",
    heroText: "Looking for an internship in web development.", about: "Your college, your skills, what you are learning now.",
    "cards.title": "Project name", "cards.detail": "One line: what you built and with what" }
};

function typeHint(field) {
  return (SITE_DEFAULTS[state.siteType] || {})[field] || "";
}

function applyTypeDefaults() {
  const defaults = SITE_DEFAULTS[state.siteType];
  const menuNow = JSON.stringify(state.menuItems);
  const untouched = menuNow === JSON.stringify(["Home", "About", "Contact"]) ||
    Object.values(SITE_DEFAULTS).some(d => JSON.stringify(d.menu) === menuNow);
  if (defaults && untouched) state.menuItems = defaults.menu.slice();
}

function renderRail() {
  const list = el("ol", "rail");
  STEPS.forEach((step, i) => {
    const item = el("li", i < current ? "done" : i === current ? "now" : "");
    if (i < current) {
      const jump = el("button", "", step.title);
      jump.type = "button";
      jump.onclick = () => { errors = {}; current = i; render(); };
      item.append(jump);
    } else {
      item.textContent = step.title;
    }
    if (i === current) item.setAttribute("aria-current", "step");
    list.append(item);
  });
  return list;
}

function renderProgress() {
  const pad = n => String(n).padStart(2, "0");
  const box = document.getElementById("wizard");
  box.classList.toggle("turn", box.dataset.step !== String(current));
  box.dataset.step = current;
  const line = el("div", "progress");
  const big = el("span", "big-num", pad(current + 1));
  big.setAttribute("aria-hidden", "true");
  const bar = el("progress");
  bar.max = STEPS.length;
  bar.value = current + 1;
  bar.setAttribute("aria-label", "Step " + (current + 1) + " of " + STEPS.length);
  line.append(big, el("span", "count", pad(current + 1) + " / " + pad(STEPS.length)), bar);
  return line;
}
