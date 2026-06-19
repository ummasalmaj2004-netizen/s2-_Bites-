const DELIVERY = 5;
const cart = {};

const MENU = {
  jollof: 12,
  fried: 12,
  pounded: 15,
  suya: 14,
  puff: 4,
  chin: 5
};

function changeQty(id, val) {
  cart[id] = Math.max(0, (cart[id] || 0) + val);
  document.getElementById('qty-' + id).value = cart[id] || 0;
  updateCart();
}

function setQty(id, val) {
  cart[id] = Math.max(0, parseInt(val) || 0);
  updateCart();
}

function updateCart() {
  let subtotal = 0;
  let html = '';

  for (let id in MENU) {
    if (cart[id]) {
      const total = MENU[id] * cart[id];
      subtotal += total;
      html += `<div>${id} x ${cart[id]} = RM ${total.toFixed(2)}</div>`;
    }
  }

  let delivery = subtotal > 0 ? DELIVERY : 0;

  document.getElementById('cart').innerHTML =
    html || "No items selected";

  document.getElementById('subtotal').innerText = "RM " + subtotal.toFixed(2);
  document.getElementById('delivery').innerText = "RM " + delivery.toFixed(2);
  document.getElementById('total').innerText = "RM " + (subtotal + delivery).toFixed(2);
}

document.getElementById('orderForm').addEventListener('submit', e => {
  e.preventDefault();

  let summary = '';
  let subtotal = 0;

  for (let id in MENU) {
    if (cart[id]) {
      let total = MENU[id] * cart[id];
      subtotal += total;
      summary += `<div>${id} x ${cart[id]} = RM ${total.toFixed(2)}</div>`;
    }
  }

  document.getElementById('receiptSummary').innerHTML =
    summary + `<br>Total: RM ${(subtotal + DELIVERY).toFixed(2)}`;

  document.getElementById('thankYou').classList.remove('hidden');
});

document.getElementById('newOrderBtn').addEventListener('click', () => {
  location.reload();
});
