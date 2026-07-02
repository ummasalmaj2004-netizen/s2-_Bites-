/* =========================================================
   S² BITES — app.js
   Menu rendering, cart state, payment toggle, receipt upload
   and order submission for home.html.
   ========================================================= */

const MENU = [
  { id: "jollof-rice",   name: "Jollof Rice",            price: 12, img: "images/jallof-rice.png" },
  { id: "fried-rice",    name: "Fried Rice",              price: 12, img: "images/fried-rice.png" },
  { id: "pounded-yam",   name: "Pounded Yam & Egusi",     price: 15, img: "images/pounded-yam.jpg" },
  { id: "suya",          name: "Suya",                    price: 14, img: "images/suya.jpg" },
  { id: "puff-puff",     name: "Puff Puff",                price: 4,  img: "images/puff-puff.jpg" },
  { id: "chin-chin",     name: "Chin Chin",                price: 5,  img: "images/chin-chin.jpg" }
];

const DELIVERY_FEE = 3;

const cart = {}; // { id: qty }
let selectedPaymentMethod = "cash";
let receiptFile = null;
let currentUser = null;

/* ---------- Auth guard ---------- */
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  currentUser = user;
  document.getElementById("user-email-display").textContent = user.email;
});

document.getElementById("logout-btn").addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "index.html";
});

/* ---------- Render menu ---------- */
function renderMenu() {
  const grid = document.getElementById("menu-grid");
  grid.innerHTML = MENU.map((item) => `
    <div class="food-card" data-id="${item.id}">
      <div class="thumb">
        <img src="${item.img}" alt="${item.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22><rect width=%22300%22 height=%22200%22 fill=%22%23F3E4C9%22/></svg>'" />
      </div>
      <div class="body">
        <h3>${item.name}</h3>
        <div class="price mono">RM${item.price.toFixed(2)}</div>
        <div class="qty-row">
          <div class="qty-control">
            <button type="button" class="qty-minus" aria-label="Decrease quantity">−</button>
            <span class="qty-value">0</span>
            <button type="button" class="qty-plus" aria-label="Increase quantity">+</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".food-card").forEach((card) => {
    const id = card.dataset.id;
    const qtyEl = card.querySelector(".qty-value");
    card.querySelector(".qty-plus").addEventListener("click", () => {
      cart[id] = (cart[id] || 0) + 1;
      qtyEl.textContent = cart[id];
      renderOrder();
    });
    card.querySelector(".qty-minus").addEventListener("click", () => {
      if (!cart[id]) return;
      cart[id] = Math.max(0, cart[id] - 1);
      if (cart[id] === 0) delete cart[id];
      qtyEl.textContent = cart[id] || 0;
      renderOrder();
    });
  });
}

/* ---------- Render order / receipt sidebar ---------- */
function renderOrder() {
  const linesEl = document.getElementById("order-lines");
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    linesEl.innerHTML = `<div class="empty-line">No items yet — tap “+” on a dish to add it.</div>`;
  } else {
    linesEl.innerHTML = ids.map((id) => {
      const item = MENU.find((m) => m.id === id);
      const qty = cart[id];
      return `<div class="order-line">
        <span class="name">${item.name} × ${qty}</span>
        <span class="amt">RM${(item.price * qty).toFixed(2)}</span>
      </div>`;
    }).join("");
  }

  const subtotal = ids.reduce((sum, id) => {
    const item = MENU.find((m) => m.id === id);
    return sum + item.price * cart[id];
  }, 0);
  const delivery = ids.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  document.getElementById("subtotal-amt").textContent = `RM${subtotal.toFixed(2)}`;
  document.getElementById("delivery-amt").textContent = `RM${delivery.toFixed(2)}`;
  document.getElementById("total-amt").textContent = `RM${total.toFixed(2)}`;
}

/* ---------- Payment method toggle ---------- */
const payCash = document.getElementById("pay-cash");
const payBank = document.getElementById("pay-bank");
const bankBox = document.getElementById("bank-box");
const fileDrop = document.getElementById("file-drop");

function setPaymentMethod(method) {
  selectedPaymentMethod = method;
  payCash.classList.toggle("active", method === "cash");
  payBank.classList.toggle("active", method === "bank");
  bankBox.classList.toggle("show", method === "bank");
  fileDrop.classList.toggle("show", method === "bank");
  if (method === "cash") {
    receiptFile = null;
    document.getElementById("file-drop-label").textContent = "Upload payment receipt (image or PDF)";
    fileDrop.classList.remove("has-file");
  }
}
payCash.addEventListener("click", () => setPaymentMethod("cash"));
payBank.addEventListener("click", () => setPaymentMethod("bank"));

document.getElementById("receipt-input").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    receiptFile = file;
    document.getElementById("file-drop-label").textContent = `✓ ${file.name}`;
    fileDrop.classList.add("has-file");
  }
});

/* ---------- Ticket number (cosmetic) ---------- */
document.getElementById("ticket-number").textContent = Math.floor(1000 + Math.random() * 9000);

/* ---------- Submit order ---------- */
document.getElementById("order-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgEl = document.getElementById("order-message");
  msgEl.textContent = "";

  const ids = Object.keys(cart);
  if (ids.length === 0) {
    msgEl.textContent = "Please add at least one item to your order.";
    return;
  }
  if (selectedPaymentMethod === "bank" && !receiptFile) {
    msgEl.textContent = "Please upload your payment receipt for bank transfer.";
    return;
  }

  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const address = document.getElementById("cust-address").value.trim();

  const items = ids.map((id) => {
    const item = MENU.find((m) => m.id === id);
    return { name: item.name, price: item.price, quantity: cart[id], lineTotal: item.price * cart[id] };
  });
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const total = subtotal + DELIVERY_FEE;

  const submitBtn = document.getElementById("submit-order-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting…";

  try {
    let receiptUrl = null;

    if (selectedPaymentMethod === "bank" && receiptFile) {
      submitBtn.textContent = "Uploading receipt…";
      const path = `receipts/${currentUser.uid}/${Date.now()}_${receiptFile.name}`;
      const ref = storage.ref().child(path);
      await ref.put(receiptFile);
      receiptUrl = await ref.getDownloadURL();
    }

    submitBtn.textContent = "Saving order…";

    const orderRef = await db.collection("orders").add({
      customerName: name,
      phone: phone,
      address: address,
      items: items,
      subtotal: subtotal,
      deliveryFee: DELIVERY_FEE,
      totalPrice: total,
      paymentMethod: selectedPaymentMethod,
      receiptUrl: receiptUrl,
      status: "Pending",
      userEmail: currentUser.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    document.getElementById("order-ref").textContent = orderRef.id.slice(-8).toUpperCase();
    document.getElementById("thankyou-overlay").classList.add("show");

    // Reset form + cart
    Object.keys(cart).forEach((k) => delete cart[k]);
    document.getElementById("order-form").reset();
    setPaymentMethod("cash");
    renderMenu();
    renderOrder();
    document.getElementById("ticket-number").textContent = Math.floor(1000 + Math.random() * 9000);

  } catch (err) {
    msgEl.textContent = "Something went wrong submitting your order: " + err.message;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Order";
  }
});

document.getElementById("close-thankyou").addEventListener("click", () => {
  document.getElementById("thankyou-overlay").classList.remove("show");
});

/* ---------- Init ---------- */
renderMenu();
renderOrder();
