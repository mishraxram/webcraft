function renderMessage(message) {
  const item = el("li");
  const when = new Date(message.time).toLocaleString();
  item.append(
    el("p", "inbox-from", message.name + " / " + message.reply),
    el("p", "inbox-text", message.text),
    el("p", "inbox-time", when)
  );
  return item;
}

let inboxPollTimer = null;

function isLocalHostName() {
  return /^(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)$/.test(location.hostname);
}

function fetchInboxMessages(list, status, auto) {
  if (!isLocalHostName()) {
    if (!auto) status.textContent = "The inbox needs the local server. Run npm start, then open http://localhost:3000.";
    return;
  }
  fetch("/messages/" + siteFileName())
    .then(response => {
      if (response.status === 403) {
        clearInterval(inboxPollTimer);
        if (!auto) status.textContent = "Only the computer running the server can view the inbox.";
        return null;
      }
      return response.json();
    })
    .then(answer => {
      if (!answer) return;
      if (answer.error || !Array.isArray(answer.messages)) {
        if (!auto) status.textContent = answer.error || "Could not read messages.";
        return;
      }
      const count = answer.messages.length;
      status.textContent = count ? count + (count === 1 ? " message" : " messages") + ", newest first." + (auto ? " (live synced)" : "") : "No messages yet. Publish, then send one from the form on your site.";
      list.replaceChildren();
      answer.messages.forEach(message => list.append(renderMessage(message)));
    })
    .catch(() => {
      if (!auto) status.textContent = "The local server is not running. Start it with npm start.";
    });
}

function renderInbox() {
  clearInterval(inboxPollTimer);
  const wrap = el("div", "inbox");
  const button = el("button", "", "Check messages");
  button.type = "button";
  const status = el("p", "help");
  const list = el("ol", "inbox-list");

  button.onclick = () => {
    button.disabled = true;
    status.textContent = "Loading...";
    fetchInboxMessages(list, status, false);
    setTimeout(() => { button.disabled = false; }, 500);
  };

  if (isLocalHostName()) {
    fetchInboxMessages(list, status, true);
    inboxPollTimer = setInterval(() => {
      if (document.body.contains(wrap)) {
        fetchInboxMessages(list, status, true);
      } else {
        clearInterval(inboxPollTimer);
      }
    }, 4000);
  }

  wrap.append(el("h2", "", "Inbox"), el("p", "help", "Published sites have a message form. Messages from visitors are saved on this computer and show here."), button, status, list);
  return wrap;
}
