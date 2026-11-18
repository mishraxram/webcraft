function qrSVG(text) {
  const code = qrcode(0, "M");
  code.addData(text);
  code.make();

  const size = code.getModuleCount();
  const quiet = 4;
  let d = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (code.isDark(row, col)) d += "M" + (col + quiet) + " " + (row + quiet) + "h1v1h-1z";
    }
  }

  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  const full = size + quiet * 2;
  svg.setAttribute("viewBox", "0 0 " + full + " " + full);
  svg.setAttribute("class", "qr");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "QR code for " + text);

  const back = document.createElementNS(ns, "rect");
  back.setAttribute("width", full);
  back.setAttribute("height", full);
  back.setAttribute("fill", "#FFFFFF");

  const dots = document.createElementNS(ns, "path");
  dots.setAttribute("d", d);
  dots.setAttribute("fill", "#1A1A1A");

  svg.append(back, dots);
  return svg;
}
