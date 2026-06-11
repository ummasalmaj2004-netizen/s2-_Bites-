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
document.getElementById("bankBox").classList.toggle("hidden", this.value !== "Bank");
});
});

// ================= CALCULATE =================
function calculateOrder() {

let total =
(Number(jollof.value) * 12) +
(Number(fried.value) * 13) +
(Number(yam.value) * 18) +
(Number(eba.value) * 15) +
(Number(suya.value) * 10) +
(Number(moi.value) * 5) +
(Number(puff.value) * 4) +
(Number(chin.value) * 6);

document.getElementById("summary").innerHTML = `
<h3>Order Summary</h3>
<p>Total: RM ${total.toFixed(2)}</p>
`;
}

// ================= UPLOAD FILE =================
async function uploadReceipt(file) {

const fileName = Date.now() + "-" + file.name;

const { data, error } = await supabaseClient.storage
.from("receipts")
.upload(fileName, file);

if (error) {
console.log(error);
return null;
}

return data.path;
}

// ================= SUBMIT ORDER =================
async function submitOrder() {

let name = document.getElementById("name").value;
let phone = document.getElementById("phone").value;
let address = document.getElementById("address").value;
let payment = document.querySelector('input[name="payment"]:checked').value;
let receiptFile = document.getElementById("receipt").files[0];

if (!name || !phone || !address) {
alert("Fill all details");
return;
}

let receiptPath = null;

if (payment === "Bank") {
if (!receiptFile) {
alert("Upload receipt");
return;
}

receiptPath = await uploadReceipt(receiptFile);
}

const { error } = await supabaseClient.from("orders").insert([
{
customer_name: name,
phone: phone,
address: address,
payment_method: payment,
receipt: receiptPath
}
]);

if (error) {
alert("Error saving order");
console.log(error);
return;
}

document.getElementById("thankYou").classList.remove("hidden");
}
