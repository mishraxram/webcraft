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

function renderInbox() {
  const wrap = el("div", "inbox");
  const button = el("button", "", "Check messages");
  button.type = "button";
  const status = el("p", "help");
  const list = el("ol", "inbox-list");

  button.onclick = () => {
    list.replaceChildren();
    if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
      status.textContent = "The inbox needs the local server. Run npm start, then open http://localhost:3000.";
      return;
    }
    button.disabled = true;
    status.textContent = "Loading...";
    fetch("/messages/" + siteFileName())
      .then(response => response.json())
      .then(answer => {
        if (answer.error) { status.textContent = answer.error; return; }
        const count = answer.messages.length;
        status.textContent = count ? count + (count === 1 ? " message" : " messages") + ", newest first." : "No messages yet. Publish, then send one from the form on your site.";
        answer.messages.forEach(message => list.append(renderMessage(message)));
      })
      .catch(() => { status.textContent = "The local server is not running. Start it with npm start."; })
      .finally(() => { button.disabled = false; });
  };

  wrap.append(el("h2", "", "Inbox"), el("p", "help", "Published sites have a message form. Messages from visitors are saved on this computer and show here."), button, status, list);
  return wrap;
}
