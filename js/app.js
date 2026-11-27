const state = {
  siteName: "", siteType: "", templateId: "", themeId: "", fontStyle: "",
  menuItems: ["Home", "About", "Contact"],
  heroTitle: "", heroText: "", about: "",
  cards: [],
  contact: { email: "", phone: "", whatsapp: "", address: "", upi: "", opens: "", closes: "", closedDay: "" },
  footer: "",
  social: { instagram: "", linkedin: "", github: "" },
  seo: { title: "", description: "", url: "" },
  logo: "", heroImage: "", aboutImage: "",
  madeWith: false
};
const DEFAULT_STATE = JSON.stringify(state);

let current = 0;
let errors = {};

function inputsOf(step) {
  return step.fields || [step];
}

function render() {
  const step = STEPS[current];
  const box = document.getElementById("wizard");

  box.replaceChildren(
    renderProgress(),
    el("h1", "", step.title),
    el("p", "help", step.help)
  );

  if (step.type === "review") box.append(renderReview(), renderHealth(), renderExport());
  else inputsOf(step).forEach(input => box.append(renderInput(input)));

  const nav = el("div", "nav");
  const back = el("button", "", "Back");
  back.disabled = current === 0;
  back.onclick = goBack;
  nav.append(back);
  if (step.type !== "review" && !inputsOf(step).some(input => input.required)) {
    const skip = el("button", "", "Skip");
    skip.onclick = skipStep;
    nav.append(skip);
  }
  const next = el("button", "primary", "Next");
  const hint = el("span", "kbd-hint", "or press ");
  hint.append(el("kbd", "", "Enter"));
  if (current === STEPS.length - 1) next.hidden = hint.hidden = true;
  else next.onclick = goNext;
  nav.append(hint, next);
  box.append(nav);
  document.getElementById("rail").replaceChildren(renderRail());

  if (step.type === "review") {
    const h1 = box.querySelector("h1");
    if (h1) { h1.tabIndex = -1; h1.focus(); }
  } else {
    const first = box.querySelector("input:not([type='hidden']):not([type='file']), textarea") || box.querySelector("h1");
    if (first) {
      if (first.tagName === "H1") first.tabIndex = -1;
      first.focus();
    }
  }
  schedulePreview();
  saveState();
  scheduleRecord();
}

function renderInput(input) {
  const wrap = el("div", "field");
  const id = "f-" + input.field.replace(".", "-");
  const label = el("label", "", input.label + (input.required ? " *" : ""));
  label.id = id + "-label";
  if (input.type === "mcq") { wrap.setAttribute("role", "radiogroup"); wrap.setAttribute("aria-labelledby", label.id); }
  else label.htmlFor = id;
  wrap.append(label);

  if (input.image) {
    wrap.append(renderImageInput(input, id));
  } else if (input.gallery) {
    wrap.append(renderGallery(input, id));
  } else if (input.type === "mcq") {
    input.options.forEach((option, i) => {
      const radio = el("input");
      radio.type = "radio";
      radio.name = id;
      radio.id = i === 0 ? id : id + "-" + i;
      radio.checked = getValue(input.field) === option;
      radio.onchange = () => setValue(input.field, option);
      const optionLabel = el("label", "option");
      optionLabel.style.setProperty("--i", i);
      optionLabel.append(radio, optionExtra(input.field, option), " " + option);
      wrap.append(optionLabel);
    });
  } else if (input.type === "list") {
    wrap.append(renderList(input, id));
  } else {
    const box = el(input.multiline ? "textarea" : "input");
    box.id = id;
    box.value = getValue(input.field);
    box.maxLength = input.maxLength;
    box.placeholder = typeHint(input.field);
    box.oninput = () => setValue(input.field, box.value);
    wrap.append(box, charCounter(box));
    if (hasCopy(input.field)) wrap.append(copyHelper(input.field, box));
  }

  if (errors[input.field]) {
    wrap.classList.add("has-error");
    wrap.append(errorLine(wrap, id, errors[input.field]));
  }
  return wrap;
}

function renderList(input, id) {
  const items = getValue(input.field);
  const keys = input.itemFields || [null];
  const list = el("div", "list");
  items.forEach((item, i) => {
    const row = el("div", "list-row");
    keys.forEach((key, k) => {
      const box = el("input");
      if (i === 0 && k === 0) box.id = id;
      box.name = id + "-" + i + (key ? "-" + key : "");
      box.setAttribute("aria-label", input.label + " " + (i + 1) + (key ? " " + key : ""));
      box.value = key ? item[key] : item;
      box.placeholder = typeHint(input.field + "." + key) || key || input.label;
      box.maxLength = input.maxLength;
      box.oninput = () => { if (key) item[key] = box.value; else items[i] = box.value; };
      row.append(box);
    });
    const remove = el("button", "", "Remove");
    remove.onclick = () => { items.splice(i, 1); render(); };
    if (input.itemImage) row.append(imagePicker(id + "-img-" + i, "Image for card " + (i + 1), () => item.image || "", url => { item.image = url; }, MAX_SIDE));
    row.append(remove);
    list.append(row);
  });

  const add = el("button", "", "Add " + input.label.toLowerCase());
  add.disabled = items.length >= input.maxItems;
  add.onclick = () => { items.push(input.itemFields ? { title: "", detail: "", image: "" } : ""); render(); };
  list.append(add);
  if (input.field === "cards") list.append(cardIdeasButton());
  return list;
}

function renderReview() {
  const list = el("dl", "review");
  STEPS.filter(step => step.type !== "review").forEach(step => {
    inputsOf(step).forEach(input => {
      let value = getValue(input.field);
      if (input.image && value) value = "Image added";
      if (input.type === "mcq") value = displayName(value);
      const dd = el("dd", value && value.length ? "" : "empty", value && value.length ? value : "(empty)");
      if (Array.isArray(value) && value.length) {
        // Lists (menu, cards) show one numbered line each
        const rows = el("ul");
        value.forEach(v => { const li = el("li"); li.append(el("span", "", typeof v === "object" ? v.title + " - " + v.detail : v)); rows.append(li); });
        dd.replaceChildren(rows);
      }
      list.append(el("dt", "", input.label), dd);
    });
  });
  return list;
}

function goNext() {
  errors = {};
  inputsOf(STEPS[current]).forEach(input => {
    if (!input.field) return;
    const error = validate(input, getValue(input.field));
    if (error) errors[input.field] = error;
  });
  if (Object.keys(errors).length === 0 && STEPS[current].id === "type") applyTypeDefaults();
  if (Object.keys(errors).length === 0 && current < STEPS.length - 1) current++;
  render();
}

function goBack() {
  errors = {};
  if (current > 0) current--;
  render();
}

function skipStep() {
  errors = {};
  if (current < STEPS.length - 1) current++;
  render();
}

document.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  if (["TEXTAREA", "BUTTON"].includes(e.target.tagName)) return;
  if (e.target.type === "file" || e.target.type === "search") return;
  if (e.target.closest(".list") || e.target.closest(".gallery")) return;
  e.preventDefault();
  goNext();
});

document.getElementById("wizard").addEventListener("input", saveState);
document.getElementById("wizard").addEventListener("change", saveState);
document.getElementById("wizard").addEventListener("input", scheduleRecord);
document.getElementById("wizard").addEventListener("change", scheduleRecord);

loadState();
setupHistory();
setupPreview();
setupProjectTools();
render();
