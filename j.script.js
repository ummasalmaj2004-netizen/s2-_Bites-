// ===== Menu Data =====
const MENU = [
  { id: 'jollof',     name: 'Jollof Rice',          price: 12.00, img: 'images/jallof-rice.png' },
  { id: 'fried',      name: 'Fried Rice',           price: 12.00, img: 'images/fried-rice.png' },
  { id: 'pounded',    name: 'Pounded Yam & Egusi',  price: 15.00, img: 'images/pounded-yam.jpg' },
  { id: 'suya',       name: 'Suya',                 price: 14.00, img: 'images/suya.jpg' },
  { id: 'puff',       name: 'Puff Puff',            price:  4.00, img: 'images/puff-puff.jpg' },
  { id: 'chin',       name: 'Chin Chin',            price:  5.00, img: 'images/chin-chin.jpg' },
];

const DELIVERY = 5.00;
const cart = {}; // { id: qty }

// ===== Helpers =====
const RM = n => 'RM ' + n.toFixed(2);
const $ = sel => document.querySelector(sel);

// ===== Render Menu =====
function renderMenu() {
  const wrap = $('#menu');
  wrap.innerHTML = MENU.map(item => `
    <div class="food-card">
      <img src="${item.img}" alt="${item.name}" onerror="this.style.display='none'" />
      <div class="food-card-body">
        <h4>${item.name}</h4>
        <div class="price">${RM(item.price)}</div>
        <div class="qty-control">
          <button type="button" onclick="changeQty('${item.id}', -1)">−</button>
          <input type="number" min="0" max="20" value="0" id="qty-${item.id}"
                 onchange="setQty('${item.id}', this.value)" />
          <button type="button" onclick="changeQty('${item.id}', 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function changeQty(id, delta) {
  const current = cart[id] || 0;
  setQty(id, current + delta);
}

function setQty(id, value) {
  let q = parseInt(value) || 0;
  if (q < 0) q = 0;
  if (q > 20) q = 20;
  cart[id] = q;
  const input = document.getElementById('qty-' + id);
  if (input) input.value = q;
  renderCart();
}

// ===== Cart & Totals =====
function renderCart() {
  const wrap = $('#cart');
  const items = MENU.filter(m => cart[m.id] > 0);
  if (items.length === 0) {
    wrap.innerHTML = '<p class="cart-empty">No items yet — pick something delicious!</p>';
  } else {
    wrap.innerHTML = items.map(m => `
      <div class="cart-item">
        <span>${m.name} × ${cart[m.id]}</span>
        <span>${RM(m.price * cart[m.id])}</span>
      </div>
    `).join('');
  }
  calculateTotals();
}

function calculateTotals() {
  const subtotal = MENU.reduce((s, m) => s + (cart[m.id] || 0) * m.price, 0);
  const hasItems = subtotal > 0;
  const delivery = hasItems ? DELIVERY : 0;
  $('#subtotal').textContent = RM(subtotal);
  $('#delivery').textContent = RM(delivery);
  $('#total').textContent = RM(subtotal + delivery);
  return { subtotal, delivery, total: subtotal + delivery };
}

// ===== Payment Toggle =====
document.querySelectorAll('input[name="payment"]').forEach(r => {
  r.addEventListener('change', e => {
    $('#bankBox').classList.toggle('hidden', e.target.value !== 'bank');
  });
});

// ===== Receipt Preview =====
$('#receipt').addEventListener('change', e => {
  const file = e.target.files[0];
  const preview = $('#receiptPreview');
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => {
      preview.src = ev.target.result;
      preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  } else {
    preview.classList.add('hidden');
  }
});

// ===== Validation =====
function clearErrors() {
  document.querySelectorAll('.error').forEach(e => e.textContent = '');
}
function showError(field, msg) {
  const el = document.querySelector(`.error[data-for="${field}"]`);
  if (el) el.textContent = msg;
}

function validate() {
  clearErrors();
  let ok = true;
  const name = $('#name').value.trim();
  const phone = $('#phone').value.trim();
  const address = $('#address').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked').value;
  const receipt = $('#receipt').files[0];
  const totals = calculateTotals();

  if (totals.subtotal === 0) { alert('Please add at least one item to your order.'); return false; }
  if (name.length < 2) { showError('name', 'Please enter your full name'); ok = false; }
  if (!/^[0-9\-+\s]{8,15}$/.test(phone)) { showError('phone', 'Enter a valid phone number'); ok = false; }
  if (address.length < 5) { showError('address', 'Please enter a delivery address'); ok = false; }
  if (payment === 'bank' && !receipt) { showError('receipt', 'Please upload your payment receipt'); ok = false; }
  return ok;
}

// ===== Submit =====
$('#orderForm').addEventListener('submit', e => {
  e.preventDefault();
  if (!validate()) return;

  const totals = calculateTotals();
  const payment = document.querySelector('input[name="payment"]:checked').value;
  const items = MENU.filter(m => cart[m.id] > 0)
    .map(m => `<div><span>${m.name} × ${cart[m.id]}</span><span>${RM(m.price * cart[m.id])}</span></div>`)
    .join('');

  $('#receiptSummary').innerHTML = `
    ${items}
    <div><span>Subtotal</span><span>${RM(totals.subtotal)}</span></div>
    <div><span>Delivery</span><span>${RM(totals.delivery)}</span></div>
    <div><strong>Total Paid</strong><strong>${RM(totals.total)}</strong></div>
    <div><span>Customer</span><span>${$('#name').value}</span></div>
    <div><span>Phone</span><span>${$('#phone').value}</span></div>
    <div><span>Payment</span><span>${payment === 'cash' ? 'Cash on Delivery' : 'Bank Transfer'}</span></div>
  `;
  $('#thankYou').classList.remove('hidden');
});

// ===== Reset =====
$('#newOrderBtn').addEventListener('click', () => {
  Object.keys(cart).forEach(k => delete cart[k]);
  $('#orderForm').reset();
  $('#bankBox').classList.add('hidden');
  $('#receiptPreview').classList.add('hidden');
  $('#thankYou').classList.add('hidden');
  renderMenu();
  renderCart();
});

// ===== Init =====
renderMenu();
renderCart();
