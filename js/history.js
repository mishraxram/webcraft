const MAX_SNAPSHOTS = 50;
let snapshots = [];
let snapshotIndex = -1;
let recordTimer = null;

function recordChange() {
  clearTimeout(recordTimer);
  const snapshot = JSON.stringify(state);
  if (snapshot === snapshots[snapshotIndex]) return;
  snapshots = snapshots.slice(0, snapshotIndex + 1);
  snapshots.push(snapshot);
  if (snapshots.length > MAX_SNAPSHOTS) snapshots.shift();
  snapshotIndex = snapshots.length - 1;
  updateHistoryButtons();
}

function scheduleRecord() {
  clearTimeout(recordTimer);
  recordTimer = setTimeout(recordChange, 400);
}

function undo() {
  recordChange();
  if (snapshotIndex <= 0) return;
  snapshotIndex--;
  restoreSnapshot();
}

function redo() {
  if (snapshotIndex >= snapshots.length - 1) return;
  snapshotIndex++;
  restoreSnapshot();
}

function restoreSnapshot() {
  applySaved(JSON.parse(DEFAULT_STATE));
  applySaved(JSON.parse(snapshots[snapshotIndex]));
  errors = {};
  render();
  updateHistoryButtons();
}

function updateHistoryButtons() {
  document.getElementById("undo-btn").disabled = snapshotIndex <= 0;
  document.getElementById("redo-btn").disabled = snapshotIndex >= snapshots.length - 1;
}

function setupHistory() {
  document.getElementById("undo-btn").onclick = undo;
  document.getElementById("redo-btn").onclick = redo;
  recordChange();

  document.addEventListener("keydown", e => {
    if (!(e.ctrlKey || e.metaKey) || ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    const key = e.key.toLowerCase();
    if (key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
    if (key === "y" || (key === "z" && e.shiftKey)) { e.preventDefault(); redo(); }
  });
}
