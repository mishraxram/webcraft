const IMAGE_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
const MAX_IMAGE_KB = 500;
const MAX_PHOTO_MB = 5;
const MAX_SIDE = 1200;

function shrinkImage(dataUrl, maxSide, done) {
  const img = new Image();
  img.onload = () => {
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    done(canvas.toDataURL("image/webp", 0.82));
  };
  img.onerror = () => done("");
  img.src = dataUrl;
}

function readImage(file, maxSide, done) {
  if (!IMAGE_TYPES.includes(file.type)) return done("Use a PNG, JPG, SVG or WebP image.");
  const isSvg = file.type === "image/svg+xml";
  const limitKB = isSvg ? MAX_IMAGE_KB : MAX_PHOTO_MB * 1024;
  if (file.size > limitKB * 1024) return done("This image is " + Math.round(file.size / 1024) + " KB. The limit is " + limitKB + " KB.");
  const reader = new FileReader();
  reader.onerror = () => done("Could not read this file.");
  reader.onload = () => {
    if (isSvg) return done("", reader.result);
    shrinkImage(reader.result, maxSide, small => {
      if (!small) return done("Could not read this image.");
      if (small.length * 0.75 > MAX_IMAGE_KB * 1024) return done("This image is still over " + MAX_IMAGE_KB + " KB after shrinking. Try a smaller one.");
      done("", small);
    });
  };
  reader.readAsDataURL(file);
}

function imagePicker(id, label, getImage, setImage, maxSide) {
  const wrap = el("div", "upload");
  const error = el("p", "error");
  error.hidden = true;

  const file = el("input");
  file.type = "file";
  file.id = id;
  file.name = id;
  file.accept = IMAGE_TYPES.join(",");
  file.setAttribute("aria-label", label);
  file.onchange = () => {
    if (!file.files[0]) return;
    readImage(file.files[0], maxSide, (message, url) => {
      if (message) {
        error.textContent = message;
        error.hidden = false;
        file.value = "";
        return;
      }
      setImage(url);
      render();
    });
  };
  wrap.append(file);

  if (getImage()) {
    const preview = el("img", "upload-preview");
    preview.src = getImage();
    preview.alt = label + " preview";
    const remove = el("button", "", "Remove image");
    remove.type = "button";
    remove.onclick = () => { setImage(""); render(); };
    wrap.append(preview, remove);
  }
  wrap.append(error);
  return wrap;
}

function renderImageInput(input, id) {
  return imagePicker(id, input.label, () => getValue(input.field), url => setValue(input.field, url), input.maxSide || MAX_SIDE);
}
