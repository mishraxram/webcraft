const APP_NAME = "WebCraft";
const APP_TAGLINE = "12 steps. One website. No AI.";
const APP_KEY = "webcraft";

function getValue(path) {
  return path.split(".").reduce((obj, key) => obj[key], state);
}
function setValue(path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  keys.reduce((obj, key) => obj[key], state)[last] = value;
}

const SAVE_KEY = APP_KEY + "_state";

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ state: state, step: current }));
  } catch (e) {
    const error = document.getElementById("project-error");
    error.textContent = "Auto-save is full, so a refresh would lose your newest changes. Use Save project file.";
    error.hidden = false;
  }
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (saved && applySaved(saved.state)) current = Math.min(Math.max(0, saved.step | 0), STEPS.length - 1);
  } catch (e) {
  }
}

function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { }
}

function applySaved(saved) {
  if (!saved || typeof saved !== "object") return false;
  Object.keys(state).forEach(key => {
    const value = saved[key];
    if (key === "menuItems" && Array.isArray(value)) {
      state.menuItems = value.filter(item => typeof item === "string").slice(0, 6);
    } else if (key === "cards" && Array.isArray(value)) {
      state.cards = value.filter(card => card && typeof card.title === "string" && typeof card.detail === "string")
        .map(card => ({ title: card.title, detail: card.detail, image: typeof card.image === "string" ? card.image : "" })).slice(0, 6);
    } else if (typeof state[key] === "object" && !Array.isArray(state[key]) && value && typeof value === "object") {
      Object.keys(state[key]).forEach(k => { if (typeof value[k] === "string") state[key][k] = value[k]; });
    } else if (typeof state[key] === typeof value && typeof value !== "object") {
      state[key] = value;
    }
  });
  return true;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function validate(step, value) {
  if (Array.isArray(value)) {
    const texts = value.flatMap(item => typeof item === "object" ? [item.title, item.detail] : [item]);
    if (step.required && !texts.some(t => t.trim())) return "Add at least one item.";
    if (step.maxItems && value.length > step.maxItems) return "You can add up to " + step.maxItems + " items.";
    for (const t of texts) {
      const error = validate({ maxLength: step.maxLength }, t);
      if (error) return error;
    }
    return "";
  }

  const text = String(value || "").trim();
  if (!text) return step.required ? "This field is required." : "";
  if (step.maxLength && text.length > step.maxLength) return "Keep it under " + step.maxLength + " characters.";
  if (step.check === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return "Enter a valid email, like name@example.com.";
  if (step.check === "phone" && !/^\+?[0-9 -]{7,15}$/.test(text)) return "Enter a valid phone number: digits, spaces or -, 7 to 15 long.";
  return "";
}

function errorLine(wrap, id, message) {
  const line = el("p", "error", message);
  line.id = id + "-error";
  line.setAttribute("role", "alert");
  const box = wrap.querySelector("#" + id);
  if (box) {
    box.setAttribute("aria-invalid", "true");
    box.setAttribute("aria-describedby", line.id);
  }
  return line;
}
