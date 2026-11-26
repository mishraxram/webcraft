// Ordering for restaurant sites that have a WhatsApp number.
// Each dish gets "Add to order". A small cart collects dishes, quantities and the total,
// then one button opens WhatsApp with the full order already typed. No server needed.

function hasOrdering(state) {
  return state.siteType === "restaurant" && state.contact.whatsapp.replace(/[^0-9]/g, "") !== "";
}

// The price is read from the dish text, for example "(₹540)".
function addButtonHTML(state, card) {
  if (!hasOrdering(state) || !card.title.trim()) return "";
  const price = (card.detail.match(/₹\s*([\d,]+)/) || ["", ""])[1].replace(/,/g, "");
  return `<button class="add" type="button" data-item="${escapeHTML(card.title.trim())}" data-price="${price}">Add to order</button>`;
}

function cartHTML(state) {
  if (!hasOrdering(state)) return "";
  const number = state.contact.whatsapp.replace(/[^0-9]/g, "");
  return `<details class="cart" hidden data-shop="${escapeHTML(state.siteName)}" data-phone="${number}">
<summary class="cart-bar"></summary>
<div class="cart-body"><ul class="cart-list"></ul>
<label>Your name<input class="cart-name" maxlength="60" autocomplete="name"></label>
<label>Address or table number<input class="cart-place" maxlength="150"></label>
<a class="cart-send" target="_blank" rel="noopener">Send order on WhatsApp</a></div></details>`;
}

const ORDER_CSS = `
.add { margin-top: calc(var(--s) * 0.5); padding: 8px 14px; border: 1px solid var(--accent); border-radius: min(var(--r), 24px);
  background: none; color: var(--accent); font: inherit; font-weight: bold; cursor: pointer; }
.add:hover, .add:focus-visible { background: var(--accent); color: var(--on-accent); }
.cart { position: fixed; left: 16px; bottom: 16px; z-index: 3; width: min(22rem, calc(100vw - 32px));
  background: var(--bg); color: var(--text); border: 1px solid var(--text); border-radius: min(var(--r), 12px); }
.cart[hidden], .cart:not([hidden]) ~ .wa { display: none; }
.cart-bar { padding: 12px 16px; font-weight: bold; cursor: pointer; background: var(--accent); color: var(--on-accent);
  border-radius: min(var(--r), 11px); }
.cart-body { padding: var(--s); display: grid; gap: calc(var(--s) * 0.75); max-height: 60vh; overflow: auto; }
.cart-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
.cart-list li { display: grid; grid-template-columns: 2rem 1fr 2rem; align-items: center; gap: 8px; }
.cart-list button { width: 2rem; height: 2rem; border: 1px solid var(--text); border-radius: min(var(--r), 16px);
  background: none; color: inherit; font: inherit; cursor: pointer; }
.cart-list button:hover, .cart-list button:focus-visible { border-color: var(--accent); color: var(--accent); }
.cart label { display: grid; gap: 4px; font-size: 0.875rem; }
.cart input { font: inherit; padding: 8px; border: 1px solid var(--text); border-radius: min(var(--r), 8px);
  background: var(--bg); color: var(--text); }
.cart-send { display: block; padding: 12px; text-align: center; background: var(--accent); color: var(--on-accent);
  text-decoration: none; font-weight: bold; border-radius: min(var(--r), 24px); }
`;

const ORDER_SCRIPT = `<script>
const cart = document.querySelector(".cart");
if (cart) {
  const items = {};
  const list = cart.querySelector(".cart-list");
  const bar = cart.querySelector(".cart-bar");
  const send = cart.querySelector(".cart-send");
  const rupees = amount => "₹" + amount.toLocaleString("en-IN");

  const smallButton = (text, label, step, name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.setAttribute("aria-label", label + " " + name);
    button.onclick = () => change(name, step);
    return button;
  };

  const render = () => {
    let count = 0, total = 0;
    const lines = ["New order - " + cart.dataset.shop];
    list.replaceChildren();
    Object.keys(items).forEach(name => {
      const { qty, price } = items[name];
      count += qty;
      total += qty * price;
      lines.push(qty + " x " + name + (price ? " - " + rupees(qty * price) : ""));
      const row = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = qty + " × " + name + (price ? " · " + rupees(qty * price) : "");
      row.append(smallButton("−", "One less", -1, name), label, smallButton("+", "One more", 1, name));
      list.append(row);
    });
    if (total) lines.push("Total: " + rupees(total));
    const who = cart.querySelector(".cart-name").value.trim();
    const where = cart.querySelector(".cart-place").value.trim();
    if (who) lines.push("Name: " + who);
    if (where) lines.push("Address / table: " + where);
    bar.textContent = count + (count === 1 ? " item" : " items") + (total ? " · " + rupees(total) : "") + " · View order";
    cart.hidden = count === 0;
    const text = encodeURIComponent(lines.join("\\n"));
    send.href = matchMedia("(pointer: fine)").matches
      ? "https://web.whatsapp.com/send?phone=" + cart.dataset.phone + "&text=" + text
      : "https://wa.me/" + cart.dataset.phone + "?text=" + text;
  };

  const change = (name, step) => {
    items[name].qty += step;
    if (items[name].qty <= 0) delete items[name];
    render();
  };

  document.querySelectorAll(".add").forEach(button => {
    button.onclick = () => {
      const name = button.dataset.item;
      items[name] = items[name] || { qty: 0, price: Number(button.dataset.price) || 0 };
      change(name, 1);
      button.textContent = "Added";
      setTimeout(() => { button.textContent = "Add to order"; }, 1200);
    };
  });
  cart.oninput = render;
}
</script>`;
