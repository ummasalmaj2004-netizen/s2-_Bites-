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

// Increase or decrease quantity
function changeQty(id, val) {
  cart[id] = Math.max(0, (cart[id] || 0) + val);

  document.getElementById('qty-' + id).value = cart[id];

  updateCart();
}

// Set quantity directly from input box
function setQty(id, val) {
  cart[id] = Math.max(0, parseInt(val) || 0);

  document.getElementById('qty-' + id).value = cart[id];

  updateCart();
}

// Update shopping cart
function updateCart() {

  let subtotal = 0;

  let html = "";

  for (let id in MENU) {

    if (cart[id] > 0) {

      const total = MENU[id] * cart[id];

      subtotal += total;

      html += `
      <div class="cart-item">
        <span>${id}</span>
        <span>${cart[id]} × RM ${MENU[id]} = RM ${total.toFixed(2)}</span>
      </div>
      `;
    }
  }

  const delivery = subtotal > 0 ? DELIVERY : 0;

  document.getElementById("cart").innerHTML =
    html || '<div class="cart-empty">No items selected</div>';

  document.getElementById("subtotal").innerText =
    "RM " + subtotal.toFixed(2
