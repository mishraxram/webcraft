# TESTS — WebCraft

| # | Input | Expected | Actual | Pass/Fail |
|---|-------|----------|--------|-----------|
| 1 | Empty site name, press Next | Error text under field, Next blocked | "This field is required.", stayed on 01 / 12 | Pass |
| 2 | Headline `<script>alert(1)</script>` | Shown as plain text, no script runs | Plain text in review step and in all 30 templates, 0 script tags | Pass |
| 3 | 300-char text in a field | Stopped at max length, error shown | Box stops at maxLength (40 for site name); validate() returns "Keep it under 40 characters." for imported long text | Pass |
| 4 | Image over 500 KB | Photo is shrunk to max 1200px WebP and saved under 500 KB; files over 5 MB (photos) or 500 KB (SVG) are rejected with error text | 4000x3000 photo saved as 13 KB WebP; 6 MB file: "This image is 6144 KB. The limit is 5120 KB." | Pass |
| 5 | Refresh mid-way (step 5) | Answers restored from localStorage | Back on 05 / 12, name, template and menu kept | Pass |
| 6 | Each of the 5 layouts | Preview and download render correctly | All 50 templates build; split and magazine: no overflow at 320-1200px; XSS sample escaped | Pass |
| 7 | Run in Chrome | All steps work | Went 01 to 12, no console errors | Pass |
| 8 | Run in Edge | All steps work | | |
| 9 | Mobile size (375px) | No horizontal scroll, menu works | Builder: no overflow on all 12 steps at the narrowest window Chrome allowed (500px); all 50 sites: no overflow at 320 and 375px | Pass |
| 10 | Publish with name `../bad` | Server rejects, error shown | 400 "Site name can only use a-z, 0-9 and -"; also `a/b`, `\`, `BAD`, `js`, empty, 41 chars rejected | Pass |
| 11 | Social link `javascript:alert(1)` | Link dropped from footer | Not in any of 30 templates | Pass |
| 12 | All 30 templates at 320, 375, 768, 1200px | No horizontal scroll | First run: mustard overflowed at 375px (long mono word). Fixed with overflow-wrap. Re-run: none | Pass |
| 13 | Step 3, press Next with no template | Error, stays on 03 / 12 | "This field is required.", stayed | Pass |
| 14 | Gallery: Sidebar filter + search "night", then "zzz" | 10, then 1, then 0 with empty message and Random disabled | 10 / 1 / 0, message shown, Random disabled | Pass |
| 15 | Gallery keyboard: Arrow key, Enter, then Back | Selection moves, Enter goes to 04, Back keeps the pick | classic-ink kept after Back | Pass |
| 16 | Type site name `Asha <b>Rao</b>` | Preview updates, shows tags as text | Updated in ~200ms, 0 `<b>` elements | Pass |
| 17 | Step 4: night + mono on sidebar-paper | Preview keeps sidebar layout, dark colors, mono headings | bg rgb(16,22,28), Courier New, aside kept | Pass |
| 18 | Preview Desktop / Mobile toggle | 1280px scaled to fit; 375px centered at full size | scale 0.39; 375px scale 1 centered | Pass |
| 19 | Builder at narrow window (500px) | Preview stacks under wizard, no horizontal scroll | Stacked, no overflow (first run overflowed, fixed with minmax) | Pass |
| 20 | Download HTML, name `Asha <Rao>` | File `asha-rao.html`, opens offline, no script tags | asha-rao.html, 0 script tags, 1 style block | Pass |
| 21 | Download ZIP | index.html + style.css + README.txt, index links style.css | All 3 files, link present, no WebCraft name | Pass |
| 22 | About text `</style><style>body{display:none}` | Shown as text, page still visible | Escaped, only one real style block | Pass |
| 23 | Save project file, then Open it | webcraft-project.json; opening goes to review with all answers | Name and template restored, step 12 | Pass |
| 24 | Open a non-JSON file / JSON from another app | Error text under header, answers unchanged | "This is not a valid project file." / "This file is not a WebCraft project." | Pass |
| 25 | Open a hand-edited file (wrong types, unknown keys, `__proto__`, bad themeId) | Bad fields skipped, no crash | Skipped, no pollution, preview still builds | Pass |
| 26 | Start over: one click, then two clicks | One click only asks; two clicks clear everything | Back to 01 / 12, empty answers | Pass |
| 27 | Type "Asha", pause, type " Rao", Undo twice, Redo | "Asha", then empty, then "Asha" | Matches; Undo disabled at start | Pass |
| 28 | Remove a menu item, Undo, then Ctrl+Y outside a text box | Item comes back, then is removed again | Matches | Pass |
| 29 | Undo, then make a new change | Redo becomes disabled | Disabled | Pass |
| 30 | Menu and card list inputs | Every input has a name and a screen-reader label, no Chrome form warning | names like f-cards-0-title, 0 unnamed fields, no console issue | Pass |
| 31 | Publish from http://localhost:3000 | Saved to sites/asha-rao, link opens the site | Link http://localhost:3000/asha-rao/, `<script>` escaped | Pass |
| 32 | Ask the server for /server.js, /.git/config, /node_modules/..., /%2e%2e/server.js | 404, nothing private served | All 404 | Pass |
| 33 | Publish with server stopped / builder opened as file | Clear error text, no alert | "The local server is not running..." / "Publish needs the local server..." | Pass |
| 34 | "Made with WebCraft" checkbox on review | Off by default; ticking adds it to footer; undo and auto-save work; non-boolean import ignored | Off, footer shows credit when ticked, undo clears, "yes" ignored | Pass |
| 35 | Upload a .txt as logo | Rejected with error text | "Use a PNG, JPG, SVG or WebP image." | Pass |
| 36 | Upload a small PNG logo | Shows in step, in site header with alt text, review says "Image added" | All three | Pass |
| 37 | SVG logo with a `<script>` inside; imported logo `javascript:` or with `" onerror=` | Script never runs; bad logos not put in the site | Did not run; both dropped | Pass |
| 38 | Generated site head and extras (all 50 templates) | og:title / og:description / theme-color present; WhatsApp button links wa.me/<digits>; header stays at top on scroll | All 50 pass | Pass |
| 39 | Every menu link `#...` in all 50 templates (menu Home/About/Projects/Contact) | Each link has a matching section id | 0 broken links (first run: Projects pointed to missing #projects, fixed) | Pass |
| 40 | Review step accessibility check | Clean site: "No problems found."; empty description and low-contrast colors are listed | Clean: no problems; empty description listed; test theme flagged 4 contrast issues; all 10 real themes pass | Pass |
| 41 | "Made with" checkbox size | Normal small checkbox | 13px wide (was stretched to full width, CSS fixed) | Pass |
| 42 | Pick "restaurant" on step 2 | Menu becomes Home, Menu, About, Contact; steps 6-8 show restaurant example hints; hints not in the site | All as expected | Pass |
| 43 | Change site type after editing the menu by hand | Hand-made menu is kept | Kept ["Start","Food"] | Pass |
| 44 | Builder fonts with internet off (file://) | Fraunces, DM Sans, JetBrains Mono load from /fonts | document.fonts: Fraunces 700, DM Sans 400, JetBrains Mono 400 loaded; no network font URLs | Pass |
| 45 | Images on steps 1, 6, 7, 8 (logo, hero, about, each card) | Each shows in the step with Remove, and in the site in every layout; no overflow at 1280 / 375px | All shown; 5 layouts no overflow | Pass |
| 46 | No logo uploaded | Site header shows the initials ("Dosa Corner" -> DC) | "DC" monogram | Pass |
| 47 | Card image with `" onerror=` in an imported file | Not put in the site | Dropped | Pass |
| 48 | Generated site fonts (internet off) | Headings use Fraunces or DM Sans from inside the HTML file | document.fonts in the site: DM Sans 400/700 (Night), Fraunces (Classic/Magazine) loaded; no network URLs | Pass |
| 49 | All 50 templates after the design pass | No overflow at 1280 / 375px; impeccable detector clean | 0 overflow; detector: [] | Pass |
| 50 | Mobile menu, each layout at 375px | Menu hidden, "Menu" button shows; click opens it; clicking a link closes it | All 5 layouts: hidden, opens (aria-expanded true), closes on link; no overflow | Pass |
| 51 | Mobile menu at 1280px | No button, menu always visible | All 5 layouts: no button, menu shown | Pass |
| 52 | Dark mode button, light theme (Paper, Harbor) in all 5 layouts | Click turns the site dark (Ink colors), aria-pressed true | Background #F5F1E8 / #EEF2F5 to #1A1A1A, pressed true | Pass |
| 53 | Mode button on a dark theme (Ink, Night) | Says "Light mode", click gives Paper colors | Night #10161C to #F5F1E8 | Pass |
| 54 | Refresh after picking dark mode | Choice remembered for that page only | Still dark after reload; key is per page path | Pass |
| 55 | Open the builder with no answers | Preview says "Your site shows up here" instead of a blank page | Note shown; disappears once a name is typed | Pass |
| 56 | Step list on step 5 | Steps 1-4 struck through, step 5 marked, rest grey | done=4, now="Menu items" | Pass |
| 57 | Builder at 375px | No sideways scroll; step list hidden | overflow 0 | Pass |
| 58 | Publish from a hosted copy (not localhost) | Clear error: use Download online | Message shown, no request sent | Pass |
| 59 | All 50 templates after the premium pass | No overflow at 375 / 1280px; kicker 12px; a11y check clean | 0 overflow, kicker 12px everywhere, no a11y problems (apart from missing description) | Pass |
| 60 | Section reveal with JavaScript off (gallery thumbnails) | Every section visible | Visible: the reveal class is only added by the script | Pass |
| 61 | Step 4 tiles | Each theme tile shows 4 color squares; font tiles show "Aa" in that font; picked tile turns ink | 40 swatches; checked tile ink | Pass |
| 62 | Progress bar on step 4 | Bar at 4 of 12 | value 4 | Pass |
| 63 | Proof desk layout at 1440 / 1366 / 390px | No sideways scroll; step index shows above 1200px, hidden below | overflow 0 at all three; index visible at 1440 and 1366 | Pass |
| 64 | Click "03 Pick a template" in the step index from step 7 | Jumps back to step 3; later steps cannot be clicked | Now 03 / 12, 0 forward buttons | Pass |
| 65 | Proof bar | Shows file name and device width | "dosa-corner.html", "Desktop / 1280 px" | Pass |
| 66 | All 50 templates at 375 / 768 / 1280px after the signature pass | No overflow; headline always below the label; a11y check clean | 0 failures (sidebar overflow at 375 found and fixed with min-width 0) | Pass |
| 67 | Classic with no hero image | Site initials drawn large and outlined beside the headline; hidden on phones | "DC" shown at 1440, hidden under 760px | Pass |
| 68 | 3 card titles | Moving strip under the hero, pauses on hover, still when reduced motion is on | 6 spans (list written twice for a seamless loop) | Pass |
| 69 | Fixed Dark mode button at the bottom of the page | Never covers footer text | 72px space under the footer | Pass |
| 70 | Split layout with the label | Headline stays in the left column | Fixed (label now spans both columns) | Pass |
| 71 | Moving strip with keyboard / touch | A Pause button stops it (WCAG 2.2.2) | Pause sets aria-pressed true and stops the slide | Pass |
| 72 | Empty Site name, Next | Error linked to the field | aria-invalid true, aria-describedby f-siteName-error, role alert | Pass |
| 73 | Site type step with a screen reader | Group has a name | role radiogroup, labelled "Site type *" | Pass |
| 74 | Split layout with 1 card | No empty left column | Menu row 2 col 1, About col 2; no strip | Pass |
| 75 | Footer text empty | Site name not shown twice; Dark mode button inside the footer | 0 extra footer lines; button in footer | Pass |
| 76 | Review step | Shows template name, not its id | "Classic / Rust" | Pass |
| 77 | Theme personality on all 50 templates | Themes change button style (solid / outline / underline) and heading case, not only colors; no overflow; a11y clean | Every layout shows both filled and transparent buttons across themes; 0 overflow at 375 / 1280; a11y clean | Pass |
| 78 | Gallery at 1440px | Tiles fill the row edge to edge | justify-content: space-between, no gap on the right | Pass |
| 79 | Theme radius and fonts (Section 8) | Every theme radius is 0 or 4; every font is embedded (no system Palatino / Verdana / Times) | radius 0/4 only; bodies use Fraunces or DM Sans; site still ~63 KB | Pass |
| 80 | Footer alignment (Classic, Split) at 1280px | Footer starts where the content starts | Classic 120 = 120, Split 88 = 88 | Pass |
| 81 | Split hero without image or subtext | Button sits under the headline | grid-column 1 | Pass |
| 82 | Review step | Type and template shown by name; unset theme/font say "From template"; empty answers in muted mono | "Restaurant", "Classic / Rust", "From template", class empty | Pass |
| 83 | Builder opened on a phone | Preview starts on Mobile | device = Mobile below 760px | Pass |
| 84 | Click Full screen in preview bar | Site opens in a new tab at full size, with animations | New tab "Test Cafe" (blob URL), full width, entry animations kept | Pass |
| 85 | Review step, "Put it online" | Netlify Drop and GitHub Pages steps with links that open in a new tab | 2 steps, links target _blank rel noopener, ink color | Pass |
| 86 | Publish "Asha Rao" with the server running | Link to localhost:3000/asha-rao/, plus a QR code and the WiFi link | QR (37x37 SVG with 3 finder squares) and http://<wifi-ip>:3000/asha-rao/ shown under the link | Pass |
| 87 | Publish with no WiFi connected | Only the localhost link, no QR box | phoneUrl "" so no QR shown | Pass |
| 88 | POST /publish from another device on the WiFi | 403 "Only the computer running the server can do this." | Sent to the WiFi address (10.61.100.239:3000), not localhost: POST /publish and GET /messages both 403 with that text, no folder made; the site itself still opens (200) | Pass |
| 89 | Publish `../bad` after the WiFi change | Still rejected | 400 "Site name can only use a-z, 0-9 and -" | Pass |
| 90 | Published site: press Send with empty fields | Browser blocks it, nothing sent | Required fields stop submit, no request | Pass |
| 91 | Published site: send a message | "Thanks. Your message was sent.", form clears, saved in messages/form-test.json | As expected | Pass |
| 92 | Message text `<img src=x onerror=alert(1)>` and name `Ravi <b>` | Shown as plain text in the Inbox | Plain text, 0 img elements | Pass |
| 93 | Name of 300 characters | Saved cut to 60 | 60 characters saved | Pass |
| 94 | Empty name / array name / number text | 400 "Please fill in your name, how to reply, and a message." | As expected | Pass |
| 95 | Message to `nosuchsite` and `..%2Fetc` | 404 "This site is not published here." | As expected | Pass |
| 96 | Open /form-test/messages.json in browser | Not found | 404 | Pass |
| 97 | Inbox or publish via WiFi address | 403 "Only the computer running the server can do this." | As expected; sending a message via WiFi works | Pass |
| 98 | 201st message | 429 "This inbox is full." | File stays at 200 | Pass |
| 99 | Download HTML / ZIP | No form and no message script | No `<form`, no `/message/` | Pass |
| 100 | Check messages with no messages yet | "No messages yet. Publish, then send one from the form on your site." | Text shown | Pass |
| 101 | Quick Demo, click floating WhatsApp button (computer) | WhatsApp Web opens chat with +91 85283 03820 | Opened web.whatsapp.com chat with the number, logged-in account | Pass |
| 102 | Same link on a phone (pointer: coarse) | wa.me link kept, opens WhatsApp app | Link stays https://wa.me/918528303820 | Pass |
| 103 | Contact phone link | tel: link with the real number | tel:+918528303820 | Pass |
| 104 | Add to order: 2 x Subz Dum Biryani, 1 x Paneer Tikka | Cart bar "3 items · ₹1,560", rows with − and + | "3 items · ₹1,560 · View order", 2 rows | Pass |
| 105 | Fill name "Test Customer", table "Table 4", Send order | WhatsApp opens with full order, total, name and table typed | Message: 2 x Biryani ₹1,080, 1 x Paneer ₹480, Total ₹1,560, Name, Table 4 | Pass |
| 106 | Press − until a dish reaches 0 | Dish removed; cart hides when empty | Paneer row removed (2 items · ₹1,080); at 0 items the cart disappears | Pass |
| 107 | Dish name `<script>alert(1)</script>` with Add to order | Shown as text in card and cart, no script runs | Escaped as `&lt;script&gt;` in data-item, 0 script tags from the title | Pass |
| 108 | Portfolio site (not restaurant) with WhatsApp number | No Add to order buttons, no cart | No `.add`, no `.cart`, no cart CSS | Pass |
| 109 | Quick Demo, open Review | Health score with 5 bars and fix tips | 91/100, SEO 85, Speed 70 with tips | Pass |
| 110 | Site name `<script>alert(1)</script>`, description `</script><script>alert(2)</script>` | JSON-LD and favicon stay text, no script runs | 0 `<script>alert` in output, favicon has no `<script` | Pass |
| 111 | Site address `javascript:alert(1)` | Error under field, address ignored | "Enter a full address, like https://mysite.netlify.app"; siteUrl() empty | Pass |
| 112 | Site address https://saffron.netlify.app/ then Download ZIP | ZIP has sitemap.xml, robots.txt with Sitemap line, canonical link | sitemap loc https://saffron.netlify.app/, canonical tag present | Pass |
| 113 | Download ZIP with no site address | favicon.svg, robots.txt, 404.html, no sitemap | Files: index.html, style.css, README.txt, favicon.svg, robots.txt, 404.html | Pass |
| 114 | Student site, tone Bold, click Suggest text 3 times on Headline | Cycles 2 lines then repeats, counter and undo update | "Ravi... Ready to build." / "Projects first. Résumé second." / first again; 34 / 80; Undo enabled | Pass |
| 115 | Site name `Ravi <b>Kumar</b>`, suggest About | Name shows as text, no bold tag in site | Output has no `<b>Kumar</b>` tag | Pass |
| 116 | Step 8, one empty card, Fill card ideas twice | Empty card replaced by 3 ideas, no duplicates on 2nd click | 3 cards both times | Pass |
| 117 | Quick Demo step 6, hero photo 960x600, click 1:1 | Square crop from the middle | 600x600 | Pass |
| 118 | Rotate then 16:9, then Rotate, then Flip | Sizes follow, image stays valid base64 | 600x338, 338x600, 338x600; safeImage ok; 47 KB; Undo enabled | Pass |
| 119 | SVG logo uploaded | No crop tools (SVG has no pixels) | Tool row hidden | Pass |
| 120 | UPI ID `a"><script>alert(1)</script>@x` | Error under field, no UPI box on site | "Enter a UPI ID like yourname@okaxis."; no `.upi` in output | Pass |
| 121 | UPI ID saffron.hearth@okaxis, phone width | Pay box with QR, ID and Open UPI app button | upi://pay?pa=saffron.hearth%40okaxis&pn=The%20Saffron%20Hearth&cu=INR, QR shown | Pass |
| 122 | Download ZIP (restaurant demo + UPI) | privacy.html and terms.html, footer links in index.html | Privacy: collect, contact, orders, payments; Terms: use, changes, links | Pass |
| 123 | Download HTML (single file) | No Privacy/Terms links (pages would not exist) | No privacy.html link | Pass |
| 124 | Site name `<img src=x onerror=alert(1)>` on legal pages | Shown as text | No raw `<img src=x` in privacy.html | Pass |
| 125 | Opens at `9am`, `24:00`, `21:61` | Error under field | "Enter a 24-hour time, like 09:00 or 21:30." for all three | Pass |
| 126 | Closed on `xx` or `<script>` | Error under field | "Enter a day, like Sunday." | Pass |
| 127 | Opens `"><script>alert(1)</script>`, closes 22:00 | No hours row, nothing injected | hoursHTML() empty | Pass |
| 128 | 12:00-23:30 closed Monday; clock Sun 13:00 / Mon 13:00 / Sun 23:45 | Open now / Closed now / Closed now | Open now / Closed now / Closed now | Pass |
| 129 | Late-night 18:00-02:00; clock 01:00 after a closed day / after an open day | Closed now / Open now | Closed now / Open now | Pass |
| 130 | Hours 9:00-22:00 closed sun, check JSON-LD | openingHours without Sunday | "Mo,Tu,We,Th,Fr,Sa 09:00-22:00" | Pass |
| 131 | Step 2 | 14 site types, lettered A to N | Portfolio ... Photography, Wedding (A-N) | Pass |
| 132 | Site type Gym, then Suggest text (Bold) on Headline | Gym menu and gym lines | Menu Home/Plans/About/Contact; "Fit Zone. No excuses." | Pass |
| 133 | Build site for each of the 8 new types | Site builds, right Google type | All 8 build; gym has "@type":"ExerciseGym" and kicker "Train with us" | Pass |
| 134 | Step 1 to 2 (Next), then 2 to 1 (Back) | Page slides in from the right, then from the left | data-dir next / back; animation turn-next / turn-back | Pass |
| 135 | Next with empty site name | Field shakes, step does not turn again | animation shake; no turn class | Pass |
| 136 | Type in any field | Accent line runs across the proof bar | .proof.printing, ::after animation print | Pass |
| 137 | Computer set to reduce motion | No step, card or proof motion | All motion inside prefers-reduced-motion: no-preference | Pass |
| 138 | Step 3 gallery | 126 templates, 8 layout chips | 126 / 126; All, Classic ... Showcase, Bento | Pass |
| 139 | Accessibility check on all 76 new templates (Showcase, Bento, 8 new themes), demo content | No contrast warning | 0 contrast warnings | Pass |
| 140 | Showcase / Bento at 390 px | One column, no sideways scroll | scrollWidth 390 = width 390 | Pass |
| 141 | Bento with 6 cards | First and last card full width, About tile stays in view | Rows 1 / 2 / 2 / 1; About sticky | Pass |
| 142 | Click Quick Demo | Ink title screen: site name, steps 01 to 12 counting, then wipes up to the finished site | Film shown, "05 / 12 Menu items" mid-way, ends on Review with Showcase / Emerald | Pass |
| 143 | Click the title screen or press any key | Title screen ends at once | Removed | Pass |
| 144 | Step 4 font styles | 5 styles: serif, sans, mono, display, grotesk; new fonts load from /fonts | 5 options; Playfair Display and Space Grotesk "loaded" | Pass |
| 145 | Accessibility check on all 126 templates with Display and with Grotesk font style | No contrast warning | 0 of 252 | Pass |
| 146 | Downloaded site with Display style | Playfair embedded as base64, headline mask and photo wipe animations in the file | @font-face with data: URL, @keyframes title-in and wipe | Pass |
| 147 | Card detail "Black lentils... (₹420)" | Price on the title line with a dotted leader, removed from the description; cart still gets 420 | class="price">₹420, data-price="420" | Pass |
| 148 | Card title `<img src=x onerror=alert(1)>`, detail `<b>x</b> (₹99)` | Text only, price tag ₹99 | No raw tags in output | Pass |
| 149 | Contact with phone, WhatsApp, address, hours | Labelled grid: Phone / WhatsApp / Address / Hours | 4 data-label rows, WhatsApp shows the number | Pass |
| 150 | Accessibility check on all 126 templates after the detail changes | No contrast warning | 0 of 126 | Pass |
| 151 | Sidebar layout, card with photo and Add to order | Button under the text, not squeezed in the photo column | Button left = title left (448 px) | Pass |
| 152 | First visit (no saved project) | Cover: headline rises line by line, three live template proofs drift, stats ticker runs; Start building has focus | Cover shown, focus on Start building, 3 proofs built from the demo | Pass |
| 153 | Start building / Esc | Cover wipes up; Start building focuses the Site name box | Cover removed; focus f-siteName; Esc closes too | Pass |
| 154 | Click the WebCraft name, then Watch the demo | Cover opens again; demo title sequence plays and ends on Review | Cover reopened; film shown, then removed; step 12 | Pass |
| 155 | Cover at 390 px | Headline fits, proofs hidden, buttons stacked | Lines 343 = 343 px (no overflow) | Pass |
| 156 | Reload with a saved project | Cover does not show, work continues | No cover | Pass |
