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
  document.getElementById("preview-frame").srcdoc = html.replace("</head>",
    "<style>.hero > *, .reveal { animation: none; opacity: 1; transform: none; transition: none; }</style></head>");
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
  const close = el("button", "chip", "Close (Esc)");
  close.type = "button";
  const frame = el("iframe");
  frame.title = "Full screen preview of your site";
  frame.setAttribute("sandbox", "allow-scripts");
  frame.srcdoc = buildSite(state);
  const shut = () => {
    box.remove();
    document.body.classList.remove("no-scroll");
    document.getElementById("fullscreen-btn").focus();
  };
  close.onclick = shut;
  box.addEventListener("keydown", e => { if (e.key === "Escape") shut(); });
  box.append(close, frame);
  document.body.append(box);
  document.body.classList.add("no-scroll");
  close.focus();
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
  new ResizeObserver(fitPreview).observe(document.getElementById("preview-stage"));

  const wizard = document.getElementById("wizard");
  wizard.addEventListener("input", schedulePreview);
  wizard.addEventListener("change", schedulePreview);
}
