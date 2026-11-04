const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const SITES_DIR = path.join(__dirname, "sites");

const RESERVED = ["css", "js", "fonts", "sites", "publish", "node_modules"];

function isSafeName(name) {
  return typeof name === "string" && /^[a-z0-9-]{1,40}$/.test(name) && !RESERVED.includes(name);
}

app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/fonts", express.static(path.join(__dirname, "fonts")));

app.post("/publish", (req, res) => {
  const name = req.body && req.body.name;
  const html = req.body && req.body.html;
  if (!isSafeName(name)) {
    return res.status(400).json({ error: "Site name can only use a-z, 0-9 and -, up to 40 characters." });
  }
  if (typeof html !== "string" || !html.startsWith("<!doctype html>")) {
    return res.status(400).json({ error: "The site HTML is missing." });
  }
  const folder = path.join(SITES_DIR, name);
  try {
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, "index.html"), html);
  } catch (e) {
    return res.status(500).json({ error: "Could not save the site on this computer." });
  }
  res.json({ url: "http://localhost:" + PORT + "/" + name + "/" });
});

app.use(express.static(SITES_DIR));

app.use((err, req, res, next) => {
  res.status(400).json({ error: "The request was not valid. A very big image can cause this." });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log("WebCraft running on http://localhost:" + PORT);
});
