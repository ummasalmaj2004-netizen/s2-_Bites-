// ================= SUPABASE SETUP =================
const SUPABASE_URL = "https://azqkjbfctblxzvjeroam.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6cWtqYmZjdGJseHp2amVyb2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTQ0ODUsImV4cCI6MjA5Njc3MDQ4NX0.PG2dbsz6ujYtEf8nky3-bisabpOudp2QjAjkIM8jlF0";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================= CONFIG =================
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

// ================= CART FUNCTIONS =================
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

// ================= PAYMENT TOGGLE =================
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

// ================= SUBMIT ORDER =================
document.getElementById("orderForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const payment = document.querySelector('input[name="payment"]:checked').value;

  let subtotal = 0;
  let orderItems = [];

  for (let id in MENU) {
    if (cart[id] > 0) {
      const itemTotal = MENU[id] * cart[id];
      subtotal += itemTotal;

      orderItems.push({
        item: id,
        qty: cart[id],
        price: MENU[id]
      });
    }
  }

  const delivery = subtotal > 0 ? DELIVERY : 0;
  const total = subtotal + delivery;

  let receiptFileUrl = null;

  // ================= UPLOAD RECEIPT (BANK ONLY) =================
  if (payment === "bank") {
    const fileInput = document.getElementById("receipt");

    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileName = `${Date.now()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from("receipts")
        .upload(fileName, file);

      if (!error) {
        receiptFileUrl = supabase.storage
          .from("receipts")
          .getPublicUrl(fileName).data.publicUrl;
      }
    }
  }

  // ================= SAVE ORDER TO SUPABASE =================
  const { error } = await supabase.from("orders").insert([
    {
      customer_name: name,
      phone: phone,
      address: address,
      items: orderItems,
      payment_method: payment,
      subtotal: subtotal,
      delivery: delivery,
      total_price: total,
      receipt_url: receiptFileUrl
    }
  ]);

  if (error) {
    console.log(error);
    alert("❌ Order failed!");
    return;
  }

  // ================= UI UPDATE =================
  let summary = "<h3>Order Summary</h3>";

  orderItems.forEach(i => {
    summary += `<p>${i.item} × ${i.qty}</p>`;
  });

  summary += `
    <hr>
    <p><b>Subtotal:</b> RM ${subtotal.toFixed(2)}</p>
    <p><b>Delivery:</b> RM ${delivery.toFixed(2)}</p>
    <p><b>Total:</b> RM ${total.toFixed(2)}</p>
    <p><b>Name:</b> ${name}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Address:</b> ${address}</p>
    <p><b>Payment:</b> ${payment}</p>
  `;

  document.getElementById("receiptSummary").innerHTML = summary;

  document.querySelector(".main-grid").style.display = "none";
  document.getElementById("thankYou").classList.remove("hidden");
});

// ================= NEW ORDER =================
document.getElementById("newOrderBtn").addEventListener("click", function () {
  location.reload();
});
