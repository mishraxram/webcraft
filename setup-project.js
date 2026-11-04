const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const folders = ["css", "fonts", "js", "js/lib", "sites", ".claude", ".claude/hooks"];
folders.forEach((f) => fs.mkdirSync(f, { recursive: true }));

const files = [
  "index.html", "css/style.css",
  "js/steps.js", "js/themes.js", "js/layouts.js", "js/templates.js",
  "js/app.js", "js/utils.js", "server.js", "NOTES.md", "TESTS.md", ".gitignore"
];
files.forEach((f) => {
  if (!fs.existsSync(f)) fs.writeFileSync(f, f === ".gitignore" ? "node_modules\n" : "");
});

const hook = String.raw`
let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let f = "";
  try {
    const j = JSON.parse(raw);
    f = (j.tool_input && j.tool_input.file_path) || "";
  } catch (e) {
    process.exit(0);
  }
  if (!/\.(html|css|js)$/i.test(f)) process.exit(0);
  if (/check-rules\.js$/.test(f) || /setup-project\.js$/.test(f)) process.exit(0);
  const fs = require("fs");
  if (!fs.existsSync(f)) process.exit(0);
  const t = fs.readFileSync(f, "utf8");
  const problems = [];
  if (/gradient\(/i.test(t)) problems.push("Gradient found. Design rules: no gradients.");
  if (/backdrop-filter/i.test(t)) problems.push("Glass blur found. Not allowed.");
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(t)) problems.push("Emoji found. Use inline SVG icons.");
  if (/<script[^>]+src=["']https?:/i.test(t) || /<link[^>]+href=["']https?:/i.test(t)) problems.push("External CDN/link found. Project must work offline.");
  if (/fetch\(\s*["']https?:/i.test(t)) problems.push("External API call found. Not allowed.");
  if (/\.innerHTML\s*=/.test(t) && !/escapeHTML/.test(t)) problems.push("innerHTML used but escapeHTML is missing in this file.");
  if (problems.length) {
    console.error("RULE CHECK FAILED in " + f + ":\n- " + problems.join("\n- "));
    process.exit(2);
  }
});
`;
fs.writeFileSync(path.join(".claude", "hooks", "check-rules.js"), hook);

const settings = {
  hooks: {
    SessionStart: [
      {
        hooks: [
          {
            type: "command",
            command: "echo Reminder: read CLAUDE.md first. Plain HTML CSS JS only. No AI. Offline. One feature at a time."
          }
        ]
      }
    ],
    PostToolUse: [
      {
        matcher: "Write|Edit",
        hooks: [{ type: "command", command: "node .claude/hooks/check-rules.js" }]
      }
    ]
  },
  permissions: {
    deny: ["Bash(rm -rf:*)"]
  }
};
fs.writeFileSync(path.join(".claude", "settings.json"), JSON.stringify(settings, null, 2));

try {
  if (!fs.existsSync(".git")) execSync("git init", { stdio: "ignore" });
} catch (e) {
  console.log("Git not found. Install git later, it is optional.");
}

console.log("Done. Folders, files, and Claude Code hooks are ready.");
console.log("Next: run  claude  in this folder.");
