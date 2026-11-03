# NOTES — WebCraft

## Wizard engine
- What: one engine in app.js draws all 12 steps from the steps array in steps.js.
- Why: data-driven, so adding a step means adding one object, not new code.
- XSS defence: user text goes in with textContent, never innerHTML.
- Next is blocked unless validate() passes for every field on the step.

## Themes, layouts, templates
- What: 10 themes (data) x 3 layouts (functions) = 30 templates, built by one loop in templates.js.
- Why: adding one theme adds 3 templates with no new code; every user value goes through escapeHTML, links must be http(s).

## WebCraft name
- What: APP_NAME, APP_TAGLINE, APP_KEY live only in utils.js; index.html fills title, header, footer from them.
- Why: rename in one place; generated sites do not carry the WebCraft name by default.

## Template gallery (step 3)
- What: gallery.js shows all templates as live, scaled-down, sandboxed iframe thumbnails with a layout filter, search and a Random button.
- Why: the user sees the real site before picking; filters only hide tiles, so thumbnails are built once per step view.

## Live preview
- What: preview.js shows buildSite(state) in an iframe beside the wizard, refreshed 200ms after typing stops, at Desktop / Tablet / Mobile width scaled to fit.
- Why: the user sees every answer on the real site at once; buildSite() also applies step 4 color/font choices and will be reused by Download.

## Download
- What: export.js saves buildSite(state) as one .html file, or a ZIP (index.html + style.css + README.txt) made with the local jszip copy in js/lib/.
- Why: works offline with no server; file name comes from the site name; the ZIP has hosting steps but no WebCraft branding.

## Auto-save and project file
- What: every change is saved to localStorage (webcraft_state); Save/Open project file writes and reads webcraft-project.json; Start over clears it after two clicks.
- Why: a refresh never loses work; applySaved() only copies known fields with the right type, so a hand-edited file cannot break the app.

## Undo / Redo
- What: history.js keeps up to 50 JSON snapshots of state, taken 400ms after a change; Undo/Redo buttons and Ctrl+Z / Ctrl+Y move between them.
- Why: snapshots are simple to explain and restore through applySaved(), the same safe path as project import.

## Split and Magazine layouts (50 templates)
- What: two more layouts (split: uneven 7/5 columns; magazine: masthead, huge uppercase headline, numbered sections); shared parts moved to parts.js.
- Why: 5 layouts x 10 themes = 50 templates as CLAUDE.md asks; parts.js keeps each file under 200 lines.

## Publish (local server)
- What: npm start runs server.js (Express, 127.0.0.1:3000); POST /publish saves sites/<name>/index.html, served at localhost:3000/<name>/.
- Why: shows real hosting on one computer; names allow only a-z 0-9 -, and only the builder's css/js/fonts are served, never server.js or .git.

## "Made with WebCraft" credit
- What: a checkbox on the review step (state.madeWith, default false) adds "Made with" + APP_NAME to the generated footer.
- Why: the user's site carries no app branding unless they choose it (CLAUDE.md Section 6).

## Logo upload
- What: step 11 has a file picker (upload.js) for PNG/JPG/SVG/WebP up to 500 KB, stored as a base64 data URL in state.logo and shown in every layout's header.
- Why: works offline and stays inside the single HTML file; parts.js only uses the logo if it matches a strict image data URL pattern.

## Generated site extras
- What: every site now has og: tags and theme-color, a sticky header, a floating WhatsApp button (when a number is given), smooth scroll (off for reduced motion), and the cards section id follows its heading.
- Why: better sharing and SEO, contact in one tap, and menu links like "Projects" now land on the right section.

## Accessibility check
- What: a11y.js reads the finished site with DOMParser on the review step and lists images without alt text, links without text, low contrast (WCAG 4.5:1), a missing headline and a missing description.
- Why: the user sees problems before downloading; contrast uses the same formula browsers and WCAG use.

## Smart defaults per site type
- What: SITE_DEFAULTS in steps.js gives each site type a starting menu (used only if the menu was not edited) and grey example hints for steps 6-8.
- Why: the user sees what good answers look like for their kind of site, and menu names match the section headings.

## Editorial builder design
- What: local Fraunces / DM Sans / JetBrains Mono (woff2 in /fonts with their OFL licenses), paper/ink/accent tokens, custom focus ring and selection color, SVG paper grain, mono labels and step numbers, hover/pressed/disabled button states.
- Why: CLAUDE.md Section 8; small text uses a darker accent (#B8401F) so it passes 4.5:1 contrast.

## Images everywhere + monogram logo
- What: image pickers for the logo (step 1), hero (step 6), about photo (step 7) and every card (step 8); photos are shrunk in the browser to max 1200px WebP; no logo means an initials monogram.
- Why: sites look real with photos, many images still fit in localStorage, and every site has a logo; parts.js only accepts strict image data URLs.

## Design pass on generated sites (impeccable plugin)
- What: headings use real embedded fonts (Fraunces / DM Sans as base64 via fontdata.js), themed selection, focus ring and link underlines, no meaningless 01/02 numbers, classic cards as ruled columns; WebCraft gets an SVG mark and favicon.
- Why: system-font headings and boxed cards made every site look generic; the fonts travel inside the one HTML file, so sites still work offline.

## Polish before GitHub
- What: the Choose file button matches the other buttons; Remove card is a small text link in the card corner; README.md explains the project.
- Why: the browser's grey file button broke the paper look, and a big Remove button sat next to Add card and was easy to hit by mistake.

## Responsive menu
- What: on screens under 600px every generated site hides its menu behind a "Menu" button (aria-expanded, closes after a link is picked); the live preview frame now runs scripts (sandbox="allow-scripts", no same-origin) so it works there too.
- Why: six menu links do not fit a phone header; the script is fixed text with no user input, and without JavaScript the menu just stays open.

## Dark mode button
- What: every generated site has a small fixed button (bottom left) that swaps a light theme to Ink colors, or a dark theme (dark: true in themes.js) to Paper colors, and remembers the choice per page in localStorage.
- Why: all layout colors are CSS variables, so one extra class on <html> swaps the whole palette; Ink and Paper already pass the contrast check.

## Builder polish
- What: all 12 steps listed under the form like a contents page (done ones struck through), a note in the empty preview, smaller mono header buttons, and Publish explains itself when the builder runs online.
- Why: the first screen was a form beside a blank white box; now the user sees the whole path and where they are, and Next stays the strongest button.

## Premium pass (generated sites)
- What: shared site CSS and scripts moved to sitebase.js; every hero gets a small label by site type ("Kitchen and dining"), the button reads "Get in touch" with an SVG arrow, the email is shown large, sections fade in once on scroll, links and buttons have 0.2s hover transitions, and the footer has Back to top.
- Why: these small editorial details are what make a page feel designed; motion is skipped for reduced-motion visitors and in the live preview, which reloads on every key.

## Premium pass (builder)
- What: multiple choice steps are tiles (themes show their colors, fonts show "Aa"), a thin progress bar sits beside "04 / 12", bigger inputs, "Next ->", a ruled review table, and a hard offset shadow on the preview.
- Why: the user sees the result of a choice before picking it; the hard shadow fits the print look and is not a soft blur shadow.

## Proof desk redesign (builder)
- What: three columns (step index, form, proof); a big outlined step number; answers typed in large serif on a ruled line; file tools as quiet mono links under a thick ink masthead; the preview has an ink bar with the file name and device width.
- Why: the old screen was a plain form next to a box, the same as most builders; now it reads like filling in a printed form and checking a proof, and finished steps can be reopened from the index.

## Signature details (generated sites)
- What: big outlined initials in the Classic hero when there is no photo, a slowly moving strip of card titles under every hero, a large closing line in Contact by site type ("Book a table or order in."), and the site name as a giant wordmark across the footer (sized with container units so it never overflows). The builder slides each new step in.
- Why: every site now has something to remember it by, using only the user's own name and card titles, so nothing needs an image or the internet.

## Fixes from the three-agent review
- What: design, accessibility and code reviewers ran in parallel; fixed: strip Pause button, linked error text, radio groups with a name, focus on the review step, placeholder contrast, button gap under the headline, Dark mode button moved into the footer, strip only with 3+ cards, Split grid hole, no repeated name in the footer, blank contact rows ignored, theme/template names on the review.
- Why: these were the problems the reviewers verified; the WCAG A ones (moving content, group names, error links) matter most in a viva.

## Theme personality
- What: each theme now has button ("solid", "outline" or "underline") and caps (spaced capital section headings) in themes.js; page() puts them as classes on <html> and sitebase.js styles them.
- Why: before, two templates of the same layout differed only in color, so the 50 thumbnails looked alike; it is still data only, so a new theme is still one object.

## Second review round
- What: all theme radii are 0 or 4 and every body font is an embedded one; footers line up with the content; Split's button sits under the headline; Classic's Contact heading is a small label above the big line; sidebar footer spaced out; Pause sits on the strip's top line; review shows names, "From template" and muted empty rows; phones start the preview on Mobile.
- Why: the design reviewer re-scored the UI (builder 8, templates 7) and listed these as the remaining gaps.

## Full screen preview and hosting guide
- What: a "Full screen" button above the preview opens the finished site in a new browser tab (a blob URL, with animations); the review step has a "Put it online" list with Netlify Drop and GitHub Pages steps.
- Why: the small scaled preview was hard to use, and users need a clear free path from the ZIP to a public link (Section 12: real hosting needs internet).
