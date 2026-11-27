const DEVICES = [
  { name: "Desktop", width: 1280 },
  { name: "Tablet", width: 768 },
  { name: "Mobile", width: 375 }
];
let device = innerWidth < 760 ? DEVICES[2] : DEVICES[0];
let previewTimer = null;
let lastPreview = "";

function schedulePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(updatePreview, 200);
}

function updatePreview() {
  document.getElementById("preview-stage").classList.toggle("empty", !state.siteName.trim());
  const html = buildSite(state);
  if (html === lastPreview) return;
  lastPreview = html;
  document.getElementById("proof-file").textContent = siteFileName() + ".html";
  // Restart the "printing" line on the proof bar (motion.css); reading offsetWidth lets it play again
  const proof = document.querySelector(".proof");
  proof.classList.remove("printing");
  void proof.offsetWidth;
  proof.classList.add("printing");
  document.getElementById("preview-frame").srcdoc = html.replace("</head>",
    "<style>.hero > *, .reveal, .reveal * { animation: none; } .reveal { opacity: 1; transform: none; transition: none; }</style></head>");
}

function fitPreview() {
  const stage = document.getElementById("preview-stage");
  const frame = document.getElementById("preview-frame");
  if (!stage.clientWidth) return;
  const scale = Math.min(1, stage.clientWidth / device.width);
  document.getElementById("proof-width").textContent = device.name + " / " + device.width + " px";
  frame.style.width = device.width + "px";
  frame.style.height = stage.clientHeight / scale + "px";
  frame.style.transform = "scale(" + scale + ")";
  frame.style.marginLeft = scale === 1 ? (stage.clientWidth - device.width) / 2 + "px" : "0";
}

function openFullScreen() {
  const box = el("div", "fullview");
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Full screen preview");

  const bar = el("div", "fullview-bar");
  bar.style.display = "flex";
  bar.style.justifyContent = "space-between";
  bar.style.alignItems = "center";
  bar.style.padding = "8px 16px";
  bar.style.background = "var(--ink)";
  bar.style.color = "var(--paper)";
  bar.style.fontFamily = "var(--mono)";
  bar.style.fontSize = "0.8125rem";

  const title = el("span", "", siteFileName() + ".html — Full Screen Preview");
  const close = el("button", "chip", "Close (Esc)");
  close.type = "button";
  close.style.background = "var(--paper)";
  close.style.color = "var(--ink)";

  bar.append(title, close);

  const frame = el("iframe");
  frame.title = "Full screen preview of your site";
  frame.setAttribute("sandbox", "allow-scripts allow-popups allow-popups-to-escape-sandbox");
  frame.srcdoc = buildSite(state);
  frame.style.width = "100%";
  frame.style.height = "calc(100vh - 42px)";
  frame.style.border = "0";

  const shut = () => {
    box.remove();
    document.body.classList.remove("no-scroll");
    document.getElementById("fullscreen-btn").focus();
  };
  close.onclick = shut;
  box.addEventListener("keydown", e => { if (e.key === "Escape") shut(); });
  frame.addEventListener("load", () => {
    try {
      frame.contentWindow.addEventListener("keydown", e => { if (e.key === "Escape") shut(); });
    } catch (e) {}
  });

  box.append(bar, frame);
  document.body.append(box);
  document.body.classList.add("no-scroll");
  close.focus();
}

function openCodeModal() {
  const modal = el("div", "code-modal");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Generated HTML Source");

  const card = el("div", "code-modal-card");
  const bar = el("div", "code-modal-bar");
  bar.append(el("span", "", siteFileName() + ".html — Clean Semantic HTML5 Source (<70 KB)"));

  const copyBtn = el("button", "", "Copy HTML");
  copyBtn.type = "button";
  const fallbackCopy = text => {
    const ta = el("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.append(ta);
    ta.select();
    try {
      document.execCommand("copy");
      copyBtn.textContent = "Copied to Clipboard!";
    } catch (e) {
      copyBtn.textContent = "Copy failed";
    }
    ta.remove();
    setTimeout(() => { copyBtn.textContent = "Copy HTML"; }, 2000);
  };
  copyBtn.onclick = () => {
    const code = buildSite(state);
    const feedback = () => {
      copyBtn.textContent = "Copied to Clipboard!";
      setTimeout(() => { copyBtn.textContent = "Copy HTML"; }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(feedback).catch(() => fallbackCopy(code));
    } else {
      fallbackCopy(code);
    }
  };

  const closeBtn = el("button", "", "Close (Esc)");
  closeBtn.type = "button";
  const shut = () => { modal.remove(); const b = document.getElementById("viewcode-btn"); if (b) b.focus(); };
  closeBtn.onclick = shut;

  const actions = el("div");
  actions.style.display = "flex";
  actions.style.gap = "8px";
  actions.append(copyBtn, closeBtn);
  bar.append(actions);

  const body = el("div", "code-modal-body");
  const pre = el("pre", "", buildSite(state));
  body.append(pre);

  card.append(bar, body);
  modal.append(card);
  modal.addEventListener("keydown", e => { if (e.key === "Escape") shut(); });
  modal.onclick = e => { if (e.target === modal) shut(); };
  document.body.append(modal);
  closeBtn.focus();
}

function setupPreview() {
  const bar = document.getElementById("preview-devices");
  DEVICES.forEach(d => {
    const button = el("button", "chip", d.name);
    button.type = "button";
    button.setAttribute("aria-pressed", d === device);
    button.onclick = () => {
      device = d;
      bar.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b === button));
      fitPreview();
    };
    bar.append(button);
  });
  document.getElementById("fullscreen-btn").onclick = openFullScreen;
  const viewCodeBtn = document.getElementById("viewcode-btn");
  if (viewCodeBtn) viewCodeBtn.onclick = openCodeModal;
  new ResizeObserver(fitPreview).observe(document.getElementById("preview-stage"));

  const wizard = document.getElementById("wizard");
  wizard.addEventListener("input", schedulePreview);
  wizard.addEventListener("change", schedulePreview);
}
