// Download the finished site: one HTML file, or a ZIP with separate files.
// Everything runs in the browser. A temporary <a download> link saves the file.

// Hosting help that goes inside the ZIP. No WebCraft name: the site belongs to the user.
const ZIP_README = `This folder is your website.

Open index.html in a browser to see it.

To put it online for free:
- Netlify Drop: open app.netlify.com/drop and drag this folder in.
- GitHub Pages: upload these files to a GitHub repository, then turn on Pages in Settings.
`;

// "Asha Rao" -> "asha-rao"; falls back to "website" if the name has no letters or digits
function siteFileName() {
  return slug(state.siteName) || "website";
}

function saveFile(blob, fileName) {
  const link = el("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);  // free memory after the save starts
}

function downloadHTML() {
  saveFile(new Blob([buildSite(state)], { type: "text/html" }), siteFileName() + ".html");
}

// ZIP: the page's <style> block moves into style.css, and index.html links to it.
// User text is escaped, so the only <style> tag in the page is ours.
function downloadZIP() {
  const html = buildSite(state);
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const page = html.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="style.css">');

  const zip = new JSZip();
  zip.file("index.html", page);
  zip.file("style.css", css.trim() + "\n");
  zip.file("README.txt", ZIP_README);
  return zip.generateAsync({ type: "blob" }).then(blob => saveFile(blob, siteFileName() + ".zip"));
}

// Publish: send the site to the local server (server.js), which saves it under sites/<name>/.
// Returns a promise of the server's answer: { url } or { error }.
function publishSite() {
  return fetch("/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: siteFileName(), html: buildSite(state) })
  }).then(response => response.json());
}

// ---- Project file: save all answers as JSON, open them again later ----

function exportProject() {
  const data = { app: APP_KEY, version: 1, state: state };
  saveFile(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), APP_KEY + "-project.json");
}

// Read a project file. done(message) gets "" on success, or the error text to show.
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
    applySaved(JSON.parse(DEFAULT_STATE));  // clear old answers first, so nothing mixes in
    applySaved(data.state);
    done("");
  });
}

// Header buttons: Save project file, Open project file, Start over
function setupProjectTools() {
  const error = document.getElementById("project-error");
  const fileInput = document.getElementById("import-file");
  document.getElementById("export-btn").onclick = exportProject;
  document.getElementById("import-btn").onclick = () => fileInput.click();
  fileInput.onchange = () => {
    importProject(fileInput.files[0], message => {
      error.textContent = message;
      error.hidden = !message;
      fileInput.value = "";  // so the same file can be picked again
      if (!message) {
        current = STEPS.length - 1;  // show the review step with everything loaded
        errors = {};
        render();
      }
    });
  };

  // Start over needs two clicks, so one slip does not delete everything
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

// Steps to put the site online for free. These need internet, so they are links only.
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

// Download buttons for the review step, with an error line under them
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

  // Publish works only when the builder is opened from the server, not as a file
  const publishButton = el("button", "", "Publish on this computer");
  publishButton.type = "button";
  const result = el("p", "publish-result");
  publishButton.onclick = () => {
    error.hidden = true;
    result.replaceChildren();
    // opened as a file, or from an online host like GitHub Pages: there is no publish server behind it
    if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return showError("Publish needs the local server. Run npm start, then open http://localhost:3000. Online, use Download.");
    publishButton.disabled = true;
    publishSite()
      .then(answer => {
        if (answer.error) return showError(answer.error);
        const link = el("a", "", answer.url);
        link.href = answer.url;
        link.target = "_blank";
        result.append("Published: ", link);
      })
      .catch(() => showError("The local server is not running. Start it with npm start."))
      .finally(() => { publishButton.disabled = false; });
  };

  // Optional credit in the generated footer, off by default
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
    el("p", "help", "HTML: one file, open it anywhere. ZIP: index.html, style.css and steps to put it online. Publish: saves it to the local server at localhost:3000."),
    htmlButton, zipButton, publishButton, error, result,
    el("h2", "host-title", "Put it online"),
    renderHostSteps()
  );
  return wrap;
}
