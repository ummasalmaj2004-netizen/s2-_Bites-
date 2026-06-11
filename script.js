// ================= SUPABASE =================
const SUPABASE_URL = "https://azqkjbfctblxzvjeroam.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_y5XJvIjhtTMqBPkqGbvPYA_w-nmk1zG";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ================= PAYMENT TOGGLE =================
// BANK TOGGLE (FIXED)
// BANK TOGGLE (put this at TOP or BOTTOM of script.js)
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.onchange = function () {
        document.getElementById("bankBox").style.display =
            this.value === "Bank" ? "block" : "none";
    };
});

// CALCULATE ORDER
function calculateOrder() {

let name = document.getElementById("name").value;
let phone = document.getElementById("phone").value;

let jollof = Number(document.getElementById("jollof").value);
let fried = Number(document.getElementById("fried").value);
let yam = Number(document.getElementById("yam").value);
let eba = Number(document.getElementById("eba").value);
let suya = Number(document.getElementById("suya").value);
let moi = Number(document.getElementById("moi").value);
let puff = Number(document.getElementById("puff").value);
let chin = Number(document.getElementById("chin").value);

if (!name || !phone) {
alert("Fill customer details");
return;
}

let total =
(jollof * 12) +
(fried * 13) +
(yam * 18) +
(eba * 15) +
(suya * 10) +
(moi * 5) +
(puff * 4) +
(chin * 6);

if (total <= 0) {
alert("Select food items");
return;
}

let payment = document.querySelector('input[name="payment"]:checked').value;

document.getElementById("summary").innerHTML = `
<h3>Order Summary</h3>
<p>Name: ${name}</p>
<p>Phone: ${phone}</p>
<p>Payment: ${payment}</p>
<p>Total: RM ${total.toFixed(2)}</p>
`;
}

// SUBMIT ORDER
function submitOrder() {

let payment = document.querySelector('input[name="payment"]:checked').value;

if (payment === "Bank") {
let receipt = document.getElementById("receipt").files[0];

if (!receipt) {
alert("Please upload receipt");
return;
}
}

document.getElementById("thankYou").innerHTML =
"🎉 Thank You! Your order has been placed successfully.";

// RESET
document.getElementById("name").value = "";
document.getElementById("phone").value = "";
document.getElementById("address").value = "";

document.querySelectorAll('input[type="number"]').forEach(i => i.value = 0);

document.getElementById("receipt").value = "";
}
