/* =========================================================
   S² BITES — admin.js
   Restricted to ADMIN_EMAIL. Streams orders in real time,
   lets the admin change status or delete an order.
   ========================================================= */

let allOrders = [];
let activeFilter = "all";

/* ---------- Auth guard (admin only) ---------- */
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  if (user.email.toLowerCase() !== ADMIN_EMAIL) {
    // Logged in, but not the admin — send them to the normal ordering page.
    window.location.href = "home.html";
    return;
  }
  document.getElementById("admin-email-display").textContent = user.email;
  listenForOrders();
});

document.getElementById("logout-btn").addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "index.html";
});

/* ---------- Filters ---------- */
document.getElementById("filter-row").addEventListener("click", (e) => {
  const chip = e.target.closest(".filter-chip");
  if (!chip) return;
  document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  activeFilter = chip.dataset.filter;
  renderOrders();
});

/* ---------- Real-time orders listener ---------- */
function listenForOrders() {
  db.collection("orders")
    .orderBy("timestamp", "desc")
    .onSnapshot(
      (snapshot) => {
        allOrders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        renderStats();
        renderOrders();
      },
      (err) => {
        document.getElementById("orders-container").innerHTML =
          `<div class="empty-state">Could not load orders: ${err.message}</div>`;
      }
    );
}

function renderStats() {
  document.getElementById("stat-total").textContent = allOrders.length;
  document.getElementById("stat-pending").textContent = allOrders.filter((o) => o.status === "Pending").length;
  document.getElementById("stat-preparing").textContent = allOrders.filter((o) => o.status === "Preparing").length;
  document.getElementById("stat-delivered").textContent = allOrders.filter((o) => o.status === "Delivered").length;
}

function formatDate(ts) {
  if (!ts || !ts.toDate) return "Just now";
  return ts.toDate().toLocaleString("en-MY", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function statusClass(status) {
  return (status || "Pending").toLowerCase();
}

function renderOrders() {
  const container = document.getElementById("orders-container");
  const orders = activeFilter === "all"
    ? allOrders
    : allOrders.filter((o) => o.status === activeFilter);

  if (orders.length === 0) {
    container.innerHTML = `<div class="empty-state">No orders here yet.</div>`;
    return;
  }

  container.innerHTML = `<div class="orders-grid">${orders.map(renderOrderCard).join("")}</div>`;

  // Wire up buttons
  container.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === "delete") {
        if (confirm("Delete this order permanently?")) {
          db.collection("orders").doc(id).delete();
        }
      } else {
        db.collection("orders").doc(id).update({ status: action });
      }
    });
  });
}

function renderOrderCard(order) {
  const items = order.items || [];
  const itemsHtml = items.map(
    (i) => `<div class="li"><span>${i.name} × ${i.quantity}</span><span>RM${Number(i.lineTotal).toFixed(2)}</span></div>`
  ).join("");

  const receiptHtml = order.receiptUrl
    ? `<a href="${order.receiptUrl}" target="_blank" rel="noopener">
         <img class="receipt-thumb" src="${order.receiptUrl}" alt="Payment receipt" />
       </a>
       <a class="receipt-link" href="${order.receiptUrl}" target="_blank" rel="noopener">View full receipt →</a>`
    : `<div class="no-receipt">${order.paymentMethod === "bank" ? "No receipt uploaded" : "Cash on delivery — no receipt"}</div>`;

  const status = order.status || "Pending";

  return `
    <div class="ticket order-card">
      <div class="order-card-top">
        <div>
          <h3>${escapeHtml(order.customerName || "Unnamed customer")}</h3>
          <div class="meta">${formatDate(order.timestamp)} · ${escapeHtml(order.userEmail || "")}</div>
        </div>
        <div class="stamp ${statusClass(status)}">${status}</div>
      </div>

      <div class="order-detail-row"><span class="k">Phone</span><span>${escapeHtml(order.phone || "—")}</span></div>
      <div class="order-detail-row"><span class="k">Address</span><span>${escapeHtml(order.address || "—")}</span></div>
      <div class="order-detail-row"><span class="k">Payment</span><span>${order.paymentMethod === "bank" ? "Bank Transfer" : "Cash"}</span></div>

      <div class="order-items-list">${itemsHtml || '<div class="li">No items recorded</div>'}</div>

      <div class="order-total-line">
        <span>Total</span>
        <span>RM${Number(order.totalPrice || 0).toFixed(2)}</span>
      </div>

      ${receiptHtml}

      <div class="status-row">
        <div class="status-actions">
          <button data-action="Pending" data-id="${order.id}">Pending</button>
          <button data-action="Preparing" data-id="${order.id}">Preparing</button>
          <button data-action="Delivered" data-id="${order.id}">Delivered</button>
        </div>
        <button class="btn-sm btn-outline danger" data-action="delete" data-id="${order.id}" style="border-radius:999px;">Delete</button>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
