let galleryLayout = "all";
let gallerySearch = "";

const THUMB_SAMPLE = {
  heroText: "A short line about what you do.",
  about: "A few sentences about you or your business.",
  cards: [
    { title: "First item", detail: "One line of detail." },
    { title: "Second item", detail: "One line of detail." },
    { title: "Third item", detail: "One line of detail." }
  ]
};

function thumbState() {
  const copy = Object.assign({}, state);
  Object.keys(THUMB_SAMPLE).forEach(key => {
    const empty = Array.isArray(copy[key]) ? !copy[key].length : !copy[key].trim();
    if (empty) copy[key] = THUMB_SAMPLE[key];
  });
  return copy;
}

function renderGallery(input, id) {
  const tools = el("div", "gallery-tools");
  const grid = el("div", "gallery-grid");
  const count = el("p", "gallery-count");
  const empty = el("p", "gallery-empty", "No template matches. Try another word or pick All.");
  const sample = thumbState();

  const tiles = TEMPLATES.map((template, i) => {
    const tile = el("label", "tile");
    const radio = el("input");
    radio.type = "radio";
    radio.name = id;
    if (i === 0) radio.id = id;
    radio.checked = getValue(input.field) === template.id;
    radio.onchange = () => setValue(input.field, template.id);

    const frame = el("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("sandbox", "");
    frame.setAttribute("scrolling", "no");
    frame.tabIndex = -1;
    frame.loading = "lazy";
    frame.srcdoc = template.build(sample);
    const thumb = el("span", "thumb");
    thumb.append(frame);

    tile.append(radio, thumb, el("span", "tile-name", template.name));
    tile.template = template;
    grid.append(tile);
    return tile;
  });

  const chips = [{ id: "all", name: "All" }, ...LAYOUTS].map(layout => {
    const chip = el("button", "chip", layout.name);
    chip.type = "button";
    chip.onclick = () => { galleryLayout = layout.id; applyFilters(); };
    chip.layoutId = layout.id;
    return chip;
  });

  const search = el("input");
  search.type = "search";
  search.name = "template-search";
  search.placeholder = "Search, e.g. night";
  search.setAttribute("aria-label", "Search templates");
  search.value = gallerySearch;
  search.oninput = () => { gallerySearch = search.value; applyFilters(); };

  const random = el("button", "", "Random");
  random.type = "button";
  random.onclick = () => {
    const visible = tiles.filter(tile => !tile.hidden);
    const tile = visible[Math.floor(Math.random() * visible.length)];
    const radio = tile.querySelector("input");
    radio.checked = true;
    radio.onchange();
    radio.focus();
    tile.scrollIntoView({ block: "nearest" });
  };

  function applyFilters() {
    const words = gallerySearch.trim().toLowerCase();
    let shown = 0;
    tiles.forEach(tile => {
      const t = tile.template;
      tile.hidden = !((galleryLayout === "all" || t.layoutId === galleryLayout) && t.name.toLowerCase().includes(words));
      if (!tile.hidden) shown++;
    });
    chips.forEach(chip => chip.setAttribute("aria-pressed", chip.layoutId === galleryLayout));
    count.textContent = String(shown).padStart(2, "0") + " / " + tiles.length;
    empty.hidden = shown > 0;
    random.disabled = shown === 0;
  }

  tools.append(...chips, search, random, count);
  applyFilters();
  const wrap = el("div", "gallery");
  wrap.append(tools, empty, grid);
  return wrap;
}
