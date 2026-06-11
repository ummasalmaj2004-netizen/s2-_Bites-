// ================= SUPABASE =================
const SUPABASE_URL = "https://azqkjbfctblxzvjeroam.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_y5XJvIjhtTMqBPkqGbvPYA_w-nmk1zG";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ================= PAYMENT TOGGLE =================
document.querySelectorAll('input[name="payment"]').forEach(radio => {
radio.addEventListener("change", function () {

let bankBox = document.getElementById("bankBox");

if (this.value === "Bank") {
bankBox.classList.remove("hidden");
} else {
bankBox.classList.add("hidden");
}
});
});

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
alert("Please fill customer details");
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
alert("Select at least one food item");
return;
}

let payment = document.querySelector('input[name="payment"]:checked').value;

let receiptMsg = "";

if (payment === "Bank") {
let receipt = document.getElementById("receipt").files[0];

if (!receipt) {
alert("Please upload receipt");
return;
}

receiptMsg = "Receipt: " + receipt.name;
}

document.getElementById("summary").innerHTML = `
<h3>Order Summary</h3>
<p>Name: ${name}</p>
<p>Phone: ${phone}</p>
<p>Total: RM ${total.toFixed(2)}</p>
<p>Payment: ${payment}</p>
<p>${receiptMsg}</p>
`;
}
