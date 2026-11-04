const FRAUNCES = '"Fraunces", Georgia, serif';
const DMSANS = '"DM Sans", Arial, sans-serif';
const MONO = '"JetBrains Mono", "Courier New", monospace';

const FONT_STYLES = {
  serif: { headingFont: FRAUNCES, bodyFont: FRAUNCES },
  sans: { headingFont: DMSANS, bodyFont: DMSANS },
  mono: { headingFont: MONO, bodyFont: DMSANS }
};

const THEMES = [
  { id: "paper", name: "Paper", headingFont: FRAUNCES, bodyFont: DMSANS, radius: 0, spacing: 16, button: "solid", caps: false,
    colors: { bg: "#F5F1E8", text: "#1A1A1A", muted: "#5C574F", accent: "#B8401F", onAccent: "#FFFFFF", line: "#1A1A1A" } },

  { id: "ink", name: "Ink", dark: true, headingFont: DMSANS, bodyFont: DMSANS, radius: 0, spacing: 16, button: "outline", caps: true,
    colors: { bg: "#1A1A1A", text: "#F5F1E8", muted: "#B5AFA4", accent: "#F0A35E", onAccent: "#1A1A1A", line: "#3A3A3A" } },

  { id: "rust", name: "Rust", headingFont: FRAUNCES, bodyFont: FRAUNCES, radius: 4, spacing: 16, button: "solid", caps: false,
    colors: { bg: "#FBF7F2", text: "#2B1D16", muted: "#6B5A4E", accent: "#A63D17", onAccent: "#FFFFFF", line: "#D9CCC0" } },

  { id: "forest", name: "Forest", headingFont: FRAUNCES, bodyFont: DMSANS, radius: 4, spacing: 12, button: "underline", caps: false,
    colors: { bg: "#F1F4EE", text: "#1E2B22", muted: "#55635A", accent: "#2F6B45", onAccent: "#FFFFFF", line: "#C9D3C6" } },

  { id: "harbor", name: "Harbor", headingFont: DMSANS, bodyFont: DMSANS, radius: 4, spacing: 16, button: "solid", caps: true,
    colors: { bg: "#EEF2F5", text: "#14212B", muted: "#4E5D69", accent: "#1F5C8A", onAccent: "#FFFFFF", line: "#C5D0D8" } },

  { id: "clay", name: "Clay", headingFont: FRAUNCES, bodyFont: FRAUNCES, radius: 4, spacing: 16, button: "outline", caps: false,
    colors: { bg: "#F3E9DF", text: "#3A2A20", muted: "#6E5A4C", accent: "#8C4422", onAccent: "#FFFFFF", line: "#D8C6B5" } },

  { id: "slate", name: "Slate", headingFont: DMSANS, bodyFont: DMSANS, radius: 0, spacing: 8, button: "solid", caps: true,
    colors: { bg: "#E9EAEC", text: "#1C1F24", muted: "#50565E", accent: "#B0341C", onAccent: "#FFFFFF", line: "#1C1F24" } },

  { id: "newsprint", name: "Newsprint", headingFont: FRAUNCES, bodyFont: FRAUNCES, radius: 0, spacing: 12, button: "underline", caps: true,
    colors: { bg: "#FFFFFF", text: "#111111", muted: "#555555", accent: "#0B5CAD", onAccent: "#FFFFFF", line: "#111111" } },

  { id: "mustard", name: "Mustard", headingFont: DMSANS, bodyFont: FRAUNCES, radius: 4, spacing: 16, button: "outline", caps: false,
    colors: { bg: "#FFF8E7", text: "#222222", muted: "#5E5646", accent: "#7A5200", onAccent: "#FFFFFF", line: "#E5D9B8" } },

  { id: "night", name: "Night", dark: true, headingFont: DMSANS, bodyFont: DMSANS, radius: 4, spacing: 16, button: "outline", caps: true,
    colors: { bg: "#10161C", text: "#DDE3E8", muted: "#93A1AD", accent: "#4FB3A9", onAccent: "#10161C", line: "#2A343D" } }
];

function optionExtra(field, option) {
  const box = el("span", "option-extra");
  box.setAttribute("aria-hidden", "true");
  const theme = THEMES.find(t => t.id === option);
  if (field === "themeId" && theme) {
    ["bg", "text", "accent", "line"].forEach(key => {
      const square = el("span", "swatch");
      square.style.background = theme.colors[key];
      box.append(square);
    });
  } else if (field === "fontStyle" && FONT_STYLES[option]) {
    box.textContent = "Aa";
    box.style.fontFamily = FONT_STYLES[option].headingFont;
  }
  return box;
}
