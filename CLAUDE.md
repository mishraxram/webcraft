# CLAUDE.md — WebCraft (College Mini Project)

Read this file fully before every task. These rules are the boss. If a request breaks a rule, say so first.

---

## 1. WHAT THIS PROJECT IS

A website builder that runs in the browser. The user answers 12 steps (MCQ + text fields). The app fills pre-written code with those answers and creates a full working website. The user can preview, download, and publish it.

- **NO AI. NO API calls. NO internet needed.** Everything is pre-saved code.
- Works fully offline.
- Owner: a B.Tech student. Code must be simple enough to explain in viva.
- App name is WebCraft. Use APP_NAME from utils.js.
  - Tagline: APP_TAGLINE ("12 steps. One website. No AI."). Never hard-code the name in JS.
  - localStorage keys start with APP_KEY (example: `webcraft_state`).
  - Project JSON export file name: `webcraft-project.json`.
  - server.js console message: "WebCraft running on http://localhost:3000".
  - package.json name: "webcraft".

## 2. TECH RULES (strict)

- Use **plain HTML, CSS, JavaScript only**. (Not Java. Java does not run in a browser.)
- Do NOT use React, Vue, Angular, Next.js, Tailwind, jQuery, or any big framework.
- Do NOT load anything from the internet (no CDN, no Google Fonts, no external images). Fonts live in `/fonts` and load with `@font-face`.
- Only allowed npm packages: `express` (publish server). Optional: `jszip` and `qrcode-generator`, copied locally into `/js/lib/` (ZIP export, QR code).
- Write simple code with short comments. Beginner level. No clever tricks.
- One feature at a time. After each feature, tell me exactly how to test it.
- Do not edit files I did not mention. Do not rewrite working code.

## 3. FOLDER STRUCTURE

```
site-builder/
├── CLAUDE.md
├── index.html          (wizard page)
├── css/style.css       (builder UI styles)
├── fonts/              (local font files)
├── js/
│   ├── steps.js        (all 12 steps as data)
│   ├── themes.js       (10 themes as data)
│   ├── fontdata.js     (fonts as base64 for generated sites; made by make-fontdata.js)
│   ├── parts.js        (shared parts of every layout: menu, sections, footer, page wrapper)
│   ├── layouts.js      (5-7 layout functions)
│   ├── templates.js    (builds 50+ templates from layouts x themes)
│   ├── gallery.js      (step 3 template gallery: thumbnails, filter, search, random)
│   ├── upload.js       (step 11 logo upload: png/jpg/svg/webp, max 500 KB, base64)
│   ├── preview.js      (live preview iframe, desktop / tablet / mobile)
│   ├── a11y.js         (accessibility check on the review step: alt text, contrast, links, description)
│   ├── export.js       (Download HTML / ZIP, project JSON save / open, publish, start over)
│   ├── qr.js           (turns a link into an SVG QR code, uses lib/qrcode.js)
│   ├── history.js      (undo / redo snapshots, Ctrl+Z / Ctrl+Y)
│   ├── app.js          (wizard engine, state, undo/redo)
│   ├── utils.js        (escapeHTML, validation, save/load)
│   └── lib/            (jszip.min.js, qrcode.js, local copies)
├── make-fontdata.js    (run after changing /fonts: writes js/fontdata.js)
├── server.js           (Express publish server, optional)
├── sites/              (published sites saved here)
└── .claude/
    ├── settings.json   (auto-trigger hooks)
    └── hooks/check-rules.js
```

## 4. CORE DESIGN (data-driven)

- ONE `state` object holds every answer: siteName, siteType, templateId, themeId, fontStyle, menuItems[], heroTitle, heroText, about, cards[], contact{}, footer, social{}, seo{}.
- Each step is one object in the `steps` array: `{ id, title, help, type: "mcq" | "text" | "list" | "review", options, field, required, maxLength }`.
- One engine in `app.js` renders every step. Never hard-code a step page.
- A theme = object of colors + fonts + radius + spacing + shadow.
- A layout = function `(state, theme) => htmlString`.
- Templates = every layout x every theme, created by a loop. Never write 50 pages by hand.
- Live preview uses `<iframe srcdoc>`.

## 5. THE 12 STEPS

1. Site name
2. Site type (portfolio, business, blog, event, restaurant, student)
3. Template (gallery of 50+ with live thumbnails, filters, search, random button)
4. Theme override (colors) and font style
5. Menu item names (add/remove, max 6)
6. Hero headline and subtext
7. About section
8. Services / projects cards (up to 3-6, title + detail each)
9. Contact details (email, phone, WhatsApp, address)
10. Footer text and social links
11. SEO (page title, description) and logo/image upload
12. Review screen, then Download / Publish

Every step: Back, Next, Skip (if optional), progress shown as "03 / 12" in mono font, smart defaults per site type, live preview updates after each answer.

## 6. FEATURES (build order)

**Core (Days 1-5)**
- Wizard engine, state, validation, progress
- 5 layouts x 10 themes, gallery with filters
- Live preview with desktop / tablet / mobile toggle
- Download single HTML file, Download ZIP
- Auto-save to localStorage, Export / Import project JSON
- Undo / Redo (state history)

**Extra (Days 6-8)**
- Node publish: POST /publish saves to `/sites/name`, served at `localhost:3000/name`
- Phone share: the server listens on the WiFi too; after publish the builder shows a QR code of `http://<wifi-ip>:3000/name` so a phone on the same WiFi can open the site
- Accessibility check on the generated site (missing alt text, low contrast warning)
- Generated site extras: responsive menu, sticky header, dark mode toggle, FAQ accordion, WhatsApp / mailto button, SEO + OG tags
- Keyboard: Enter = Next, Esc = close gallery
- Image upload to base64 (max 500 KB)
- Review step: optional checkbox "Add 'Made with WebCraft' in my footer" (default OFF). Generated sites never carry the WebCraft name otherwise.

## 7. SECURITY AND VALIDATION (never skip)

- Every user text goes through `escapeHTML()` before it enters any HTML string.
- Never use `innerHTML` with raw user text.
- Max length on every field. Required fields block Next. Email and phone checked.
- Site name for publish: only a-z, 0-9, hyphen. Block `..`, `/`, `\` (stops path attacks in server.js).
- POST /publish only accepts requests from this computer (127.0.0.1 / ::1). Other WiFi devices can only view sites.
- Image: only png/jpg/svg/webp, max 500 KB.
- Show clear error text under the field. No `alert()`.

## 8. DESIGN RULES (UI must NOT look AI-generated)

**Direction: Editorial.**
- Colors: paper `#F5F1E8`, ink `#1A1A1A`, ONE accent `#D94F2B`.
- Fonts: headings serif (Fraunces or DM Serif Display), body DM Sans, labels mono (JetBrains Mono). Local files only.
- Borders: 1px solid ink. Radius: 0 or 4px only. Spacing scale: 4, 8, 16, 32, 64.
- Layout: left-aligned, uneven columns (7/5). Never three equal cards in a row everywhere.
- Icons: custom inline SVG, 1.5px stroke, same style.
- Details: mono step numbers, custom focus ring, custom selection color, subtle SVG paper grain.
- Every button / input / empty state needs hover, focus, disabled, and error state.
- Copy: plain and specific. Say "Pick a template", not "Unlock your journey".

**NEVER use:** gradients, purple, glass blur (`backdrop-filter`), emoji as icons, big soft shadows, "Unlock the power of...", centered-everything layouts.

**Generated sites follow design too:** each layout has its own type scale, spacing, and detail. Themes also change font pairing, button shape, and spacing, not only colors.

## 9. BUILD LOOP (every feature)

1. Define: "After this, the user can ___"
2. Small prompt, list the files allowed
3. Explain the code in simple words (I must understand it)
4. Test by hand
5. Break it: empty, `<script>`, very long text, refresh mid-way
6. Fix only the reported problem
7. `git add . && git commit -m "feature name"`
8. Add 2 lines to NOTES.md: what it does, why

## 10. TEST TABLE (keep updated in TESTS.md)

Columns: Input / Expected / Actual / Pass-Fail. Minimum 10 rows: empty name, `<script>` headline, 300-char text, big image, refresh, each layout, Chrome, Edge, mobile size, publish with bad name.

## 11. AUTO-TRIGGERS (hooks in `.claude/settings.json`)

These run by themselves. No install needed.

| When | What runs | Why |
|---|---|---|
| Session starts | Prints a reminder of the rules | Claude never forgets the rules |
| After any file Write / Edit | `check-rules.js` scans .html / .css / .js | Blocks gradients, glass blur, emoji, CDN links, external fetch, unsafe innerHTML |
| Before dangerous shell commands | Denied in permissions (`rm -rf`) | Protects project |

If the check fails, fix the file at once and do not argue with the check.

Optional plugin: run `/plugin` inside Claude Code and look for a front-end design plugin. Use it only if it respects Section 8.

## 12. HOSTING TRUTH (say this honestly in viva)

- Real public hosting needs a server and a domain. This project does: Download, ZIP, and local publish on `localhost:3000`.
- Guide the user to GitHub Pages or Netlify Drop as the next step. That needs internet.

## 13. DO NOT

- Do not add AI, login, database, or payments.
- Do not copy templates from the internet.
- Do not add a new layout before the first 5 fully work.
- Do not polish UI before the flow works.
- Do not leave `console.log` or dead code.
- Do not write more than about 200 lines in one file without asking.

## 14. DEFINITION OF DONE

- All 12 steps work, with validation
- 50+ templates in gallery, filters work
- Live preview, 3 device sizes
- Download, ZIP, JSON save/load, undo/redo
- Publish works on localhost
- Test table filled, no failing rows
- Works with internet OFF
- Report has: flow chart, screenshots, test table, limitations, future scope

## 15. VIVA CHEAT SHEET

- Why no AI? Predictable, offline, zero cost, full control.
- How does data move? Form -> `state` -> layout function -> HTML string -> iframe / file.
- How to add template 51? Add one theme object. No new code.
- How do you stop XSS? `escapeHTML()` on all user text.
- How is hosting done? Local Express server; explain real hosting needs domain + server.
- Limitations: no real domain, no database, no login. Future scope: cloud hosting, accounts, more templates.

## 16. FIRST TASK WHEN THIS FILE IS READ

Do Phase 1 only: check the folder structure from Section 3 exists, create `NOTES.md` and `TESTS.md`, then stop and ask me to confirm before building the wizard engine.
