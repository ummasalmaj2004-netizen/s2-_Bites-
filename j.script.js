// ================= SUPABASE =================
const SUPABASE_URL = "https://azqkjbfctblxzvjeroam.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6cWtqYmZjdGJseHp2amVjeroamIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTQ0ODUsImV4cCI6MjA5Njc3MDQ4NX0.PG2dbsz6ujYtEf8nky3-bisabpOudp2QjAjkIM8jlF0";

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

// ================= CART FIXED =================
function changeQty(id, val) {
  cart[id] = Math.max(0, (cart[id] || 0) + val);

  const input = document.getElementById('qty-' + id);
  if (input) input.value = cart[id];

  updateCart();
}

function setQty(id, val) {
  cart[id] = Math.max(0, parseInt(val) || 0);

  const input = document.getElementById('qty-' + id);
  if (input) input.value = cart[id];

  updateCart();
}

// ================= CART UI =================
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

  const cartBox = document.getElementById("cart");
  const subtotalBox = document.getElementById("subtotal");
  const deliveryBox = document.getElementById("delivery");
  const totalBox = document.getElementById("total");

  if (cartBox) cartBox.innerHTML = html || '<div class="cart-empty">No items selected</div>';
  if (subtotalBox) subtotalBox.innerText = "RM " + subtotal.toFixed(2);
  if (deliveryBox) deliveryBox.innerText = "RM " + delivery.toFixed(2);
  if (totalBox) totalBox.innerText = "RM " + (subtotal + delivery).toFixed(2);
}

// ================= PAYMENT =================
document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener("change", function () {
    const bankBox = document.getElementById("bankBox");
    if (bankBox) {
      bankBox.style.display = this.value === "bank" ? "block" : "none";
    }
  });
});

// ================= ORDER SUBMIT =================
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

  // ================= RECEIPT UPLOAD =================
  if (payment === "bank") {
    const fileInput = document.getElementById("receipt");

    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("receipts")
        .upload(fileName, file);

      if (!error) {
        receiptFileUrl = supabase.storage
          .from("receipts")
          .getPublicUrl(fileName).data.publicUrl;
      }
    }
  }

  // ================= SAVE ORDER =================
  const { error } = await supabase.from("orders").insert([
    {
      customer_name: name,
      phone,
      address,
      items: orderItems,
      payment_method: payment,
      subtotal,
      delivery,
      total_price: total,
      receipt_url: receiptFileUrl
    }
  ]);

  if (error) {
    console.log(error);
    alert("Order failed!");
    return;
  }

  alert("Order placed successfully!");

  // reset UI
  location.reload();
});

// ================= INIT =================
window.onload = () => {
  updateCart();
};
