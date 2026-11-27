// imagetools.js - small image studio under every uploaded photo:
// center crop to 1:1, 4:3 or 16:9, rotate 90 degrees, flip. Done with a <canvas>, in the browser.

const CROPS = [["1:1", 1], ["4:3", 4 / 3], ["16:9", 16 / 9]];

// Draws the image again with one change and returns the new data URL
function editImage(dataUrl, action, done) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const w = img.width, h = img.height;
    if (action === "rotate") {
      canvas.width = h; canvas.height = w;
      ctx.translate(h, 0);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, 0, 0);
    } else if (action === "flip") {
      canvas.width = w; canvas.height = h;
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);
    } else {
      // Crop: keep the middle part that fits the chosen ratio
      const ratio = action;
      const cw = w / h > ratio ? Math.round(h * ratio) : w;
      const ch = w / h > ratio ? h : Math.round(w / ratio);
      canvas.width = cw; canvas.height = ch;
      ctx.drawImage(img, (w - cw) / 2, (h - ch) / 2, cw, ch, 0, 0, cw, ch);
    }
    done(canvas.toDataURL("image/webp", 0.9));
  };
  img.onerror = () => done("");
  img.src = dataUrl;
}

// Tool row: Crop 1:1 / 4:3 / 16:9, Rotate, Flip. SVG logos are skipped (they have no pixels to crop).
function imageTools(getImage, setImage, showError) {
  const row = el("div", "image-tools");
  if (getImage().startsWith("data:image/svg")) return row;
  row.append(el("span", "copy-label", "Edit photo"));
  const apply = action => {
    editImage(getImage(), action, url => {
      if (!url) return showError("Could not edit this image.");
      if (url.length * 0.75 > MAX_IMAGE_KB * 1024) return showError("The edited image is over " + MAX_IMAGE_KB + " KB. Try a smaller photo.");
      setImage(url);
      render();
    });
  };
  const tool = (text, action) => {
    const button = el("button", "chip", text);
    button.type = "button";
    button.onclick = () => apply(action);
    row.append(button);
  };
  CROPS.forEach(([name, ratio]) => tool(name, ratio));
  tool("Rotate", "rotate");
  tool("Flip", "flip");
  return row;
}
