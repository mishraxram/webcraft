const ZIP_README = `This folder is your website.

Open index.html in a browser to see it.

To put it online for free:
- Netlify Drop: open app.netlify.com/drop and drag this folder in.
- GitHub Pages: upload these files to a GitHub repository, then turn on Pages in Settings.
`;

function siteFileName() {
  return slug(state.siteName) || "website";
}

function saveFile(blob, fileName) {
  const link = el("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.remove();
  }, 1000);
}

function downloadHTML() {
  saveFile(new Blob([buildSite(state)], { type: "text/html" }), siteFileName() + ".html");
}

function downloadZIP() {
  const html = buildSite(state);
  const match = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const css = match ? match[1].trim() : "";
  const page = match
    ? html.replace(/<style[^>]*>[\s\S]*?<\/style>/i, '<link rel="stylesheet" href="style.css">')
    : html;

  const zip = new JSZip();
  zip.file("index.html", page);
  zip.file("style.css", css + "\n");
  zip.file("README.txt", ZIP_README);
  return zip.generateAsync({ type: "blob" }).then(blob => saveFile(blob, siteFileName() + ".zip"));
}

function publishSite() {
  return fetch("/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: siteFileName(), html: buildSite(Object.assign({}, state, { inbox: true })) })
  }).then(response => response.json());
}

function exportProject() {
  const data = { app: APP_KEY, version: 1, state: state };
  saveFile(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), APP_KEY + "-project.json");
}

function importProject(file, done) {
  if (!file) return done("");
  if (file.size > 1000000) return done("This file is too big to be a project (max 1 MB).");
  file.text().then(text => {
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return done("This is not a valid project file.");
    }
    if (!data || data.app !== APP_KEY || !data.state) return done("This file is not a " + APP_NAME + " project.");
    applySaved(JSON.parse(DEFAULT_STATE));
    applySaved(data.state);
    done("");
  });
}

const DEMO_PROJECT = {
  siteName: "Aura Studio",
  siteType: "portfolio",
  templateId: "split-paper",
  themeId: "paper",
  fontStyle: "serif",
  menuItems: ["Home", "Projects", "About", "Contact"],
  heroTitle: "Thoughtful architectural design & minimal spaces",
  heroText: "Based in Pune. Crafting timeless residential environments, bespoke interiors, and sustainable buildings.",
  about: "We are an independent architecture and design studio founded in 2024. We believe in simplicity, natural textures, and light-filled spaces. Every project balances functional clarity with sustainable materials.",
  cards: [
    { title: "Kanso Residence", detail: "Minimalist urban apartment renovation with natural teak and textured lime plaster." },
    { title: "Artisan Coffee Roasters", detail: "Brand identity, packaging design, and interior space planning for craft roastery." },
    { title: "The Courtyard House", detail: "Sustainable suburban villa with central passive cooling and rainwater harvesting." }
  ],
  contact: {
    email: "hello@aurastudio.in",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    address: "Bhandarkar Road, Pune, Maharashtra 411004"
  },
  footer: "Aura Studio • 2026",
  social: {
    instagram: "https://instagram.com/aurastudio",
    linkedin: "https://linkedin.com/company/aura-studio",
    github: "https://github.com/mishraxram"
  },
  seo: {
    title: "Aura Studio — Architecture & Interior Design",
    description: "Independent architecture studio in Pune crafting timeless spaces, minimal residences, and thoughtful environments."
  },
  logo: "",
  heroImage: "",
  aboutImage: "",
  madeWith: false
};

function setupProjectTools() {
  const error = document.getElementById("project-error");
  const fileInput = document.getElementById("import-file");
  const demoBtn = document.getElementById("demo-btn");
  if (demoBtn) {
    demoBtn.onclick = () => {
      applySaved(JSON.parse(DEFAULT_STATE));
      applySaved(DEMO_PROJECT);
      current = STEPS.length - 1;
      errors = {};
      render();
      saveState();
      scheduleRecord();
    };
  }
  document.getElementById("export-btn").onclick = exportProject;
  document.getElementById("import-btn").onclick = () => fileInput.click();
  fileInput.onchange = () => {
    importProject(fileInput.files[0], message => {
      error.textContent = message;
      error.hidden = !message;
      fileInput.value = "";
      if (!message) {
        current = STEPS.length - 1;
        errors = {};
        render();
      }
    });
  };

  const reset = document.getElementById("reset-btn");
  let armed = false;
  reset.onclick = () => {
    if (armed) {
      clearSave();
      location.reload();
      return;
    }
    armed = true;
    reset.textContent = "Click again to clear all answers";
    setTimeout(() => { armed = false; reset.textContent = "Start over"; }, 3000);
  };
}

const HOST_STEPS = [
  ["Netlify Drop (easiest): click Download ZIP, unzip it, then drag the folder onto ", "https://app.netlify.com/drop", ". You get a public link in a few seconds."],
  ["GitHub Pages: make a repository, upload index.html and style.css, then turn on Pages in Settings. Guide: ", "https://pages.github.com", ""]
];

function renderHostSteps() {
  const list = el("ol", "host-steps");
  HOST_STEPS.forEach(([before, url, after]) => {
    const link = el("a", "", url.replace("https://", ""));
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    const item = el("li", "", before);
    item.append(link, after);
    list.append(item);
  });
  return list;
}

function renderPhoneShare(url) {
  const box = el("figure", "phone-share");
  const caption = el("figcaption", "", "Scan with a phone on the same WiFi: ");
  caption.append(el("span", "mono", url));
  box.append(qrSVG(url), caption);
  return box;
}

function renderExport() {
  const wrap = el("div", "export");
  const error = el("p", "error");
  error.hidden = true;
  const showError = text => { error.textContent = text; error.hidden = false; };

  const htmlButton = el("button", "primary", "Download HTML");
  htmlButton.type = "button";
  htmlButton.onclick = downloadHTML;

  const zipButton = el("button", "", "Download ZIP");
  zipButton.type = "button";
  zipButton.onclick = () => {
    if (typeof JSZip === "undefined") return showError("ZIP library is missing (js/lib/jszip.min.js). Use Download HTML.");
    error.hidden = true;
    zipButton.disabled = true;
    zipButton.textContent = "Making ZIP...";
    downloadZIP()
      .catch(() => showError("Could not make the ZIP. Try Download HTML."))
      .finally(() => { zipButton.disabled = false; zipButton.textContent = "Download ZIP"; });
  };

  const publishButton = el("button", "", "Publish on this computer");
  publishButton.type = "button";
  const result = el("p", "publish-result");
  publishButton.onclick = () => {
    error.hidden = true;
    result.replaceChildren();
    wrap.querySelectorAll(".phone-share").forEach(old => old.remove());
    if (!/^(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)$/.test(location.hostname)) return showError("Publish needs the local server. Run npm start, then open http://localhost:3000. Online, use Download.");
    publishButton.disabled = true;
    publishSite()
      .then(answer => {
        if (answer.error) return showError(answer.error);
        const link = el("a", "", answer.url);
        link.href = answer.url;
        link.target = "_blank";
        result.append("Published: ", link);
        if (answer.phoneUrl) result.after(renderPhoneShare(answer.phoneUrl));
      })
      .catch(() => showError("The local server is not running. Start it with npm start."))
      .finally(() => { publishButton.disabled = false; });
  };

  const credit = el("label", "option");
  const creditBox = el("input");
  creditBox.type = "checkbox";
  creditBox.name = "made-with";
  creditBox.checked = state.madeWith;
  creditBox.onchange = () => { state.madeWith = creditBox.checked; };
  credit.append(creditBox, " Add 'Made with " + APP_NAME + "' in my footer");

  wrap.append(
    el("h2", "", "Download or publish"),
    credit,
    el("p", "help", "HTML: one file, open it anywhere. ZIP: index.html, style.css and steps to put it online. Publish: saves it to the local server at localhost:3000 and adds a message form to the site."),
    htmlButton, zipButton, publishButton, error, result,
    renderInbox(),
    el("h2", "host-title", "Put it online"),
    renderHostSteps()
  );
  return wrap;
}
