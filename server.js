const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");

const app = express();
const PORT = 3000;
const SITES_DIR = path.join(__dirname, "sites");
const MESSAGES_DIR = path.join(__dirname, "messages");
const INBOX_LIMIT = 200;

const RESERVED = ["css", "js", "fonts", "sites", "publish", "node_modules", "message", "messages"];

function isSafeName(name) {
  return typeof name === "string" && /^[a-z0-9-]{1,40}$/.test(name) && !RESERVED.includes(name);
}

function wifiAddress() {
  const interfaces = os.networkInterfaces();
  const candidates = [];
  for (const [name, addrs] of Object.entries(interfaces)) {
    if (/docker|veth|br-|tun|tap|virbr|tailscale/i.test(name)) continue;
    for (const a of addrs) {
      if (a.family === "IPv4" && !a.internal) {
        if (/^192\.168\./.test(a.address)) return a.address;
        candidates.push(a.address);
      }
    }
  }
  return candidates[0] || "";
}

function onlyThisComputer(req, res, next) {
  const ip = req.socket.remoteAddress;
  if (ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1") return next();
  res.status(403).json({ error: "Only the computer running the server can do this." });
}

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function readMessages(name) {
  const file = path.join(MESSAGES_DIR, name + ".json");
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, "utf8").trim();
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

app.use(express.json({ limit: "25mb" }));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/fonts", express.static(path.join(__dirname, "fonts")));

app.post("/publish", onlyThisComputer, (req, res) => {
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
  const wifi = wifiAddress();
  res.json({
    url: "http://localhost:" + PORT + "/" + name + "/",
    phoneUrl: wifi ? "http://" + wifi + ":" + PORT + "/" + name + "/" : ""
  });
});

app.post("/message/:name", (req, res) => {
  const name = req.params.name;
  if (!isSafeName(name) || !fs.existsSync(path.join(SITES_DIR, name, "index.html"))) {
    return res.status(404).json({ error: "This site is not published here." });
  }
  const body = req.body || {};
  const message = {
    name: clean(body.name, 60),
    reply: clean(body.reply, 100),
    text: clean(body.text, 1000),
    time: new Date().toISOString()
  };
  if (!message.name || !message.reply || !message.text) {
    return res.status(400).json({ error: "Please fill in your name, how to reply, and a message." });
  }
  try {
    const list = readMessages(name);
    if (list.length >= INBOX_LIMIT) return res.status(429).json({ error: "This inbox is full. Please use the email or phone above." });
    list.push(message);
    fs.mkdirSync(MESSAGES_DIR, { recursive: true });
    fs.writeFileSync(path.join(MESSAGES_DIR, name + ".json"), JSON.stringify(list, null, 2));
  } catch (e) {
    return res.status(500).json({ error: "Could not save the message. Please try again." });
  }
  res.json({ ok: true });
});

app.get("/messages/:name", onlyThisComputer, (req, res) => {
  const name = req.params.name;
  if (!isSafeName(name)) return res.status(400).json({ error: "Site name can only use a-z, 0-9 and -." });
  try {
    res.json({ messages: readMessages(name).reverse() });
  } catch (e) {
    res.status(500).json({ error: "The inbox file is damaged: messages/" + name + ".json" });
  }
});

app.use(express.static(SITES_DIR));

app.use((err, req, res, next) => {
  res.status(400).json({ error: "The request was not valid. A very big image can cause this." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("WebCraft running on http://localhost:" + PORT);
  if (wifiAddress()) console.log("Phones on the same WiFi can open http://" + wifiAddress() + ":" + PORT);
});
