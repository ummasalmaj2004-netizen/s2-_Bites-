// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwcUC1vEAOQX3F6qbsLMRquByc1tHh33c",
  authDomain: "square-bites.firebaseapp.com",
  projectId: "square-bites",
  storageBucket: "square-bites.firebasestorage.app",
  messagingSenderId: "714058252261",
  appId: "1:714058252261:web:9210d9b22f47fe3eb4790c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = firebase.firestore();


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
  document.getElementById('qty-' + id).value = cart[id];
  updateCart();
}

function setQty(id, val) {
  cart[id] = Math.max(0, parseInt(val) || 0);
  document.getElementById('qty-' + id).value = cart[id];
  updateCart();
}

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
    "RM " + subtotal.toFixed(2);

  document.getElementById("delivery").innerText =
    "RM " + delivery.toFixed(2);

  document.getElementById("total").innerText =
    "RM " + (subtotal + delivery).toFixed(2);
}

// PAYMENT TOGGLE
document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener("change", function () {
    const bankBox = document.getElementById("bankBox");
    if (this.value === "bank") {
      bankBox.classList.remove("hidden");
    } else {
      bankBox.classList.add("hidden");
    }
  });
});

// FORM SUBMIT
document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  let subtotal = 0;
  let summary = "<h3>Order Summary</h3>";

  for (let id in MENU) {
    if (cart[id] > 0) {
      subtotal += MENU[id] * cart[id];
      summary += `<p>${id} × ${cart[id]}</p>`;
    }
  }

  const delivery = subtotal > 0 ? DELIVERY : 0;
  const total = subtotal + delivery;

  summary += `
    <hr>
    <p><b>Subtotal:</b> RM ${subtotal.toFixed(2)}</p>
    <p><b>Delivery:</b> RM ${delivery.toFixed(2)}</p>
    <p><b>Total:</b> RM ${total.toFixed(2)}</p>
    <p><b>Name:</b> ${name}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Address:</b> ${address}</p>
  `;

  document.getElementById("receiptSummary").innerHTML = summary;

  document.querySelector(".main-grid").style.display = "none";
  document.getElementById("thankYou").classList.remove("hidden");
});

// NEW ORDER BUTTON
document.getElementById("newOrderBtn").addEventListener("click", function () {
  location.reload();
});
