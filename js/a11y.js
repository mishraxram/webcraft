function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

function checkSite(state) {
  const problems = [];
  const doc = new DOMParser().parseFromString(buildSite(state), "text/html");
  const c = siteTheme(state).colors;

  doc.querySelectorAll("img").forEach(img => {
    if (!img.getAttribute("alt")) problems.push("An image has no alt text, so screen readers cannot describe it.");
  });
  doc.querySelectorAll("a").forEach(link => {
    if (!link.textContent.trim()) problems.push("A link has no text, so people cannot tell where it goes.");
  });
  [["Text", c.text, c.bg], ["Grey text", c.muted, c.bg], ["Links", c.accent, c.bg], ["Button text", c.onAccent, c.accent]]
    .forEach(([name, fg, bg]) => {
      const ratio = contrast(fg, bg);
      if (ratio < 4.5) problems.push(name + " is hard to read: contrast " + ratio.toFixed(1) + ":1, needs 4.5:1. Try another color theme.");
    });
  if (!doc.querySelector("h1").textContent.trim()) problems.push("The page has no main heading. Add a headline in step 6.");
  if (!state.seo.description.trim()) problems.push("No page description. Add one in step 11 so search results show it.");
  return problems;
}

function renderChecks() {
  const problems = checkSite(state);
  const wrap = el("div", "checks");
  wrap.append(el("h2", "", "Accessibility check"));
  if (!problems.length) {
    wrap.append(el("p", "checks-ok", "No problems found."));
    return wrap;
  }
  const list = el("ul");
  problems.forEach(text => list.append(el("li", "", text)));
  wrap.append(el("p", "", problems.length + " to look at:"), list);
  return wrap;
}
