// hours.js - Opening hours for the contact section (step 9).
// The site shows "Open 09:00 to 22:00" and a small badge that says "Open now" or "Closed now"
// using the visitor's own clock. No server is needed.

// 24-hour time like 09:00 or 21:30
const TIME_PATTERN = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// Google's short day names, same order as DAYS
const LD_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// "sun", "Sunday" or "SUNDAY" -> 0. Empty or unknown -> -1
function dayIndex(text) {
  const word = String(text || "").trim().toLowerCase();
  if (word.length < 3) return -1;
  return DAYS.findIndex(day => day.toLowerCase().startsWith(word));
}

// Both times must be valid, or no hours are shown at all
function hoursOf(state) {
  const opens = String(state.contact.opens || "").trim();
  const closes = String(state.contact.closes || "").trim();
  if (!TIME_PATTERN.test(opens) || !TIME_PATTERN.test(closes) || opens === closes) return null;
  return { opens: opens.padStart(5, "0"), closes: closes.padStart(5, "0"), closed: dayIndex(state.contact.closedDay) };
}

const HOURS_CSS = `
.hours-now { display: inline-block; margin-left: calc(var(--s) / 2); padding: 0 calc(var(--s) / 2);
  border: 1px solid currentColor; border-radius: var(--r); font-family: monospace; font-size: 0.85em; }
.hours-now.open { color: var(--accent); }`;

// Data attributes hold checked values only (times and a day number), so the script can trust them
function hoursHTML(state) {
  const h = hoursOf(state);
  if (!h) return "";
  const closedText = h.closed >= 0 ? ` (closed ${DAYS[h.closed]})` : " every day";
  return `<li class="hours" data-open="${h.opens}" data-close="${h.closes}" data-closed="${h.closed}">` +
    `Open ${h.opens} to ${h.closes}${closedText}<span class="hours-now" hidden></span></li>`;
}

// Runs in the visitor's browser. Late-night hours like 18:00 to 02:00 are handled too.
const HOURS_SCRIPT = `<script>
(function () {
  var row = document.querySelector(".hours");
  if (!row) return;
  function minutes(t) { var p = t.split(":"); return p[0] * 60 + p[1] * 1; }
  var now = new Date(), day = now.getDay(), t = now.getHours() * 60 + now.getMinutes();
  var a = minutes(row.dataset.open), b = minutes(row.dataset.close), closed = Number(row.dataset.closed);
  var open;
  if (a < b) open = t >= a && t < b && day !== closed;
  else if (t >= a) open = day !== closed;
  else open = t < b && (day + 6) % 7 !== closed;
  var badge = row.querySelector(".hours-now");
  badge.textContent = open ? "Open now" : "Closed now";
  badge.className = "hours-now" + (open ? " open" : "");
  badge.hidden = false;
})();
</script>`;

// For JSON-LD: "Mo,Tu,We,Th,Fr,Sa 09:00-22:00"
function ldHours(state) {
  const h = hoursOf(state);
  if (!h) return "";
  return LD_DAYS.filter((d, i) => i !== h.closed).join(",") + " " + h.opens + "-" + h.closes;
}
