const TEMPLATES = [];

LAYOUTS.forEach(layout => {
  THEMES.forEach(theme => {
    TEMPLATES.push({
      id: layout.id + "-" + theme.id,
      name: layout.name + " / " + theme.name,
      layoutId: layout.id,
      themeId: theme.id,
      build: state => layout.build(state, theme)
    });
  });
});

function siteTemplate(state) {
  return TEMPLATES.find(t => t.id === state.templateId) || TEMPLATES[0];
}

function siteTheme(state) {
  const template = siteTemplate(state);
  const colors = THEMES.find(t => t.id === state.themeId) || THEMES.find(t => t.id === template.themeId);
  return Object.assign({}, colors, FONT_STYLES[state.fontStyle]);
}

function buildSite(state) {
  const layout = LAYOUTS.find(l => l.id === siteTemplate(state).layoutId);
  return layout.build(state, siteTheme(state));
}

function displayName(value) {
  if (!value) return "From template";
  const found = [...TEMPLATES, ...THEMES].find(t => t.id === value);
  return found ? found.name : value[0].toUpperCase() + value.slice(1);
}
