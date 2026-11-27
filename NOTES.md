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

## Phone share with QR code
- What: the server now listens on the WiFi (0.0.0.0) and /publish also returns the WiFi link; the review step draws it as a QR code (js/qr.js, using the local qrcode-generator copy in js/lib), so a phone on the same WiFi opens the published site by scanning.
- Why: the teacher can see the site on their own phone in the viva; publishing stays locked to this computer (onlyThisComputer in server.js), so other devices can only view.

## Working contact form and Inbox
- What: a published site gets a message form (name, email or phone, message); the Express server checks it and saves it to messages/<site>.json, and "Check messages" on the review step lists them, newest first.
- Why: it turns the static site into a real client-server app; messages live outside sites/ so no one can read them by URL, only this computer can open the inbox, and downloaded sites have no form because there is no server behind them.

## Presentation polish, crash hardening, and Quick Demo
- What: added 1-click Quick Demo and View Code inspector modal; live 4s auto-polling for incoming inbox messages; fixed a11y null crashes on h1 and seo.description; fixed downloadZIP style regex and safe anchor saving; non-destructive skipStep(); rail navigation unlock across visited steps; gallery grid alignment and palette swatches; 25MB server payload limit and smart Wi-Fi IP discovery.
- Why: guarantees zero crashes and high-speed demonstration for tomorrow's B.Tech mini project presentation and viva defense.

## Order on WhatsApp + real demo photos
Restaurant sites with a WhatsApp number get an "Order now" button on every menu card; it opens wa.me with "I want to order: <dish>" already typed.
Quick Demo now uses real photos from Wikimedia Commons (credits in CREDITS.md), shrunk and embedded as base64 so the demo still works offline.

## Cart and one WhatsApp order
Restaurant sites with a WhatsApp number get "Add to order" on every dish, a cart with quantities and the ₹ total, and one button that opens WhatsApp with the full order, name and table already typed (js/order.js).
Why: a real restaurant gets one clear order message instead of one message per dish, and it still needs no server or database.

## Premium editorial UI
- Builder restyled as a printed magazine: masthead toolbar with icon groups, "Contents" rail with ticks and %, lettered choice cards, crop-marked live proof, numbered gallery plates, proof-sheet review, big export blocks, character counters, Enter hint. CSS split into style.css + panels.css (each under 200 lines).
- Why: the flow already worked; this makes it look designed, not generated, while keeping Section 8 rules (paper/ink/one accent, 0 radius, no gradients or blur).

## Site health score + SEO pack
- Review step shows a 0-100 health score from five rule-based parts (SEO, Accessibility, Content, Speed, Links) with a fix list (js/health.js). Every site gets a favicon and JSON-LD; the ZIP adds favicon.svg, robots.txt, 404.html and sitemap.xml (js/seo.js).
- Why: the student sees exactly what to fix before publishing, and the site is ready for Google without any AI or server.

## Copy helper (no AI)
- Steps 6 and 7 get tone chips (Formal, Friendly, Bold) and "Suggest text", which fills the box with the next pre-written line for the site type, with the site name put in. Step 8 gets "Fill card ideas" (js/copybank.js).
- Why: a blank box is the hardest part for most users; fixed lines keep it offline, free and predictable, and everything still goes through escapeHTML.

## Image studio
- Every uploaded photo gets Crop 1:1 / 4:3 / 16:9 (center crop), Rotate and Flip buttons, done on a canvas in the browser; results stay under 500 KB and go through undo (js/imagetools.js). Upload already shrinks photos up to 5 MB to WebP.
- Why: users upload phone photos in the wrong shape; fixing them inside the builder means no other app is needed.

## Legal pages + UPI pay
- Step 9 takes an optional UPI ID (checked as name@bank). The site then shows a "Pay with UPI" box with a QR code and an "Open UPI app" button (upi://pay link). The ZIP adds privacy.html and terms.html written from the answers (orders, payments, contact), with footer links to them (js/legal.js).
- Why: Indian small businesses get paid by UPI, and a site that takes messages or orders should say what it does with that data. Both are offline templates, no payment server.

## Opening hours
- Step 9 takes optional opening and closing times (24-hour) and a closed day. The site shows "Open 12:00 to 23:30 (closed Monday)" with an "Open now / Closed now" badge from the visitor's own clock, late-night hours included, and Google gets openingHours in JSON-LD (js/hours.js).
- Why: the first thing a visitor asks a shop or restaurant is "are you open now?"; this answers it with no server.

## More site types
- Step 2 now has 14 types: the first 6 plus shop, clinic, gym, salon, coaching, nonprofit, photography and wedding. Each one is a single data object in js/categories.js (menu, sample text, card ideas, heading, Google type); a loop copies them into the existing tables.
- Why: more people can start from text that fits them, and adding a type needs no new code, the same idea as templates = layouts x themes.

## Motion
- css/motion.css holds all builder motion: steps slide in from the side you are going, choice cards and template plates arrive in order, the picked square stamps, wrong fields shake, and an accent line "prints" across the proof bar when the preview changes. Generated sites now stagger their cards and unveil photos as you scroll.
- Why: movement shows the user what just changed. Every move is under a second and turns off when the computer asks for reduced motion.

## Premium templates
- Two new layouts in js/layouts2.js: Showcase (huge headline, sticky section titles, numbered index rows) and Bento (sections as tiles on a 12-column grid, about 5 / cards 7). Eight new themes: Saffron, Emerald, Ivory, Cobalt, Espresso, Sage, Rose, Swiss. The gallery grows from 50 to 126 templates with no template written by hand.
- Why: more looks to pick from; each new theme's colors were checked for 4.5:1 contrast first. Templates are original, not copied from the internet (CLAUDE.md rule).

## Fonts, cinematic demo, cleanup
- Two more local fonts (Playfair Display, Space Grotesk, both OFL) give two new font styles in step 4 and new looks for five themes. Quick Demo now opens with a short title sequence (site name, steps counting 01 to 12, wipe away) and shows the Showcase / Emerald template; demo data moved to js/demo.js. Every site's headline now rises out of a mask and the hero photo wipes in.
- Why: the demo is the first thing examiners see, so it should look finished. Removed the unused test-layout.html and setup-project.js so the folder holds only files the project uses.

## Finishing details on every template
- All layouts now share DETAIL_CSS (js/parts.js): numbered section titles (01, 02...), prices like "(₹420)" moved onto the card title with a dotted leader like a printed menu, and a labelled contact grid. Showcase rows became menu lines with a square photo; Sidebar and Split keep the order button under the text.
- Why: the templates looked plain because every card and contact line was the same paragraph; small print-style details make all 126 look designed, and nothing new is typed by the user.

## Cover screen
- js/cover.js shows a magazine-style cover on first visit: the headline rises line by line, three real templates (built live from the demo project) drift like proofs on a desk, and a ticker shows the real counts (templates, steps, site types). Start building, Watch the demo, Esc, or click the WebCraft name to open it again.
- Why: the builder opened straight into a form, which looked plain; the cover shows what the tool makes before asking anything. It uses common product-page ideas (live product shots, staged reveal, ticker), drawn in our own editorial style, not copied from any site.

## Project report
- docs/REPORT.md is the college report: abstract, flow chart, data flow, module list, six screenshots (cover, gallery, a step, review, generated site on desktop and phone), security, test summary, limitations, future scope.
- Why: the Definition of Done asks for a report; screenshots were taken from the real builder with the demo project, and the WiFi publish test (row 88) was run for real instead of left for the viva.

## A demo for every site type
- Quick Demo now opens a small menu of all 14 site types. Each one loads a finished, realistic project (Indian business, real copy, its own layout and theme) with six real Commons photos. The 13 new demos live in js/demos/<type>.js and load only when picked, so the builder still opens fast.
- Why: an examiner can see the tool fit a clinic, a gym or a wedding in one click, not only a restaurant; photos are CC licensed, credited in CREDITS.md and embedded so it works offline.
