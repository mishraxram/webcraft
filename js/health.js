// health.js - Site health score on the review step.
// Five parts (SEO, Accessibility, Content, Speed, Links), each 0-100, plus a short fix list.
// Plain rules, no AI: each rule adds points or gives one tip.

function scorePart(name, rules) {
  let score = 0;
  const tips = [];
  rules.forEach(([ok, points, tip]) => { if (ok) score += points; else tips.push(tip); });
  return { name: name, score: score, tips: tips };
}

function healthReport(state) {
  const len = text => String(text || "").trim().length;
  const html = buildSite(state);
  const kb = Math.round(new Blob([html]).size / 1024);
  const problems = checkSite(state);
  const badLinks = Object.keys(state.social).filter(key => state.social[key].trim() && !/^https:\/\//i.test(state.social[key].trim()));

  const seo = scorePart("SEO", [
    [len(state.seo.title) >= 10 && len(state.seo.title) <= 60, 25, "Write a page title of 10 to 60 characters (step 11)."],
    [len(state.seo.description) >= 50, 25, "Write a page description of at least 50 characters (step 11)."],
    [len(state.heroTitle) > 0, 20, "Add a headline (step 6)."],
    [siteUrl(state) !== "", 15, "Add your site address (step 11) to get a sitemap.xml in the ZIP."],
    [state.menuItems.filter(item => item.trim()).length >= 2, 15, "Add at least 2 menu items (step 5)."]
  ]);
  const a11y = { name: "Accessibility", score: Math.max(0, 100 - problems.length * 20), tips: problems };
  const content = scorePart("Content", [
    [len(state.heroText) > 0, 20, "Add subtext under the headline (step 6)."],
    [len(state.about) >= 120, 20, "Write at least 120 characters in About (step 7)."],
    [state.cards.filter(card => card.title.trim()).length >= 3, 20, "Add at least 3 cards (step 8)."],
    [Object.values(state.contact).some(v => v.trim()), 20, "Add one way to contact you (step 9)."],
    [Boolean(state.heroImage || state.aboutImage), 20, "Add a photo (step 6 or 7). Pages with photos keep visitors longer."]
  ]);
  const speed = { name: "Speed", score: kb <= 300 ? 100 : kb <= 600 ? 85 : kb <= 1000 ? 70 : kb <= 2000 ? 50 : 30,
    tips: kb > 600 ? ["The page is " + kb + " KB. Fewer or smaller photos load faster on phones."] : [] };
  const links = { name: "Links", score: Math.max(0, 100 - badLinks.length * 34),
    tips: badLinks.map(key => "The " + key + " link should start with https://") };

  const parts = [seo, a11y, content, speed, links];
  const total = Math.round(parts.reduce((sum, part) => sum + part.score, 0) / parts.length);
  return { total: total, kb: kb, parts: parts };
}

function renderHealth() {
  const report = healthReport(state);
  const wrap = el("section", "health");
  wrap.setAttribute("aria-label", "Site health");

  const head = el("div", "health-head");
  const num = el("p", "health-num", String(report.total));
  num.append(el("span", "", "/100"));
  const verdict = report.total >= 90 ? "Ready to publish." : report.total >= 70 ? "Good. A few fixes left." : "Needs work before you publish.";
  head.append(num, el("div", "health-verdict"));
  head.lastChild.append(el("h2", "", "Site health"), el("p", "", verdict + " Page size: " + report.kb + " KB."));

  const rows = el("ol", "health-rows");
  report.parts.forEach(part => {
    const row = el("li", part.score < 70 ? "low" : "");
    const bar = el("span", "health-bar");
    const fill = el("span");
    fill.style.width = part.score + "%";
    bar.append(fill);
    row.append(el("span", "health-name", part.name), bar, el("span", "health-score", String(part.score)));
    if (part.tips.length) {
      const tips = el("ul", "health-tips");
      part.tips.forEach(tip => tips.append(el("li", "", tip)));
      row.append(tips);
    }
    rows.append(row);
  });
  wrap.append(head, rows);
  return wrap;
}
