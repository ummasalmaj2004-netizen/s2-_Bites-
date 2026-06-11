const SUPABASE_URL = "https://azqkjbfctblxzvjeroam.supabase.co";

const SUPABASE_KEY = "YOUR_PUBLISHABLE_KEY_HERE";

const supabaseClient = supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

const paymentOptions =
document.querySelectorAll('input[name="payment"]');

paymentOptions.forEach(option => {
option.addEventListener("change", () => {

```
    const bankInfo =
    document.getElementById("bankInfo");

    if (
        op// PAYMENT TOGGLE
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener("change", function () {
        const bankBox = document.getElementById("bankBox");

        if (this.value === "Bank") {
            bankBox.classList.remove("hidden");
        } else {
            bankBox.classList.add("hidden");
        }
    });
});

// CALCULATE ORDER
function calculateOrder() {

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let fried = Number(document.getElementById("fried").value);
    let jollof = Number(document.getElementById("jollof").value);
    let suya = Number(document.getElementById("suya").value);
    let puff = Number(document.getElementById("puff").value);
    let chin = Number(document.getElementById("chin").value);
    if (name === "" || phone === "") {
        alert("Please fill customer details");
        return;
    }

    let total =
        (jollof * 12) +
        (suya * 10) +
        (puff * 4);

    if (total === 0) {
        alert("Select at least one food item");
        return;
    }

    let payment = document.querySelector('input[name="payment"]:checked').value;

    let receiptText = "";

    if (payment === "Bank") {
        let receipt = document.getElementById("receipt").files[0];

        if (!receipt) {
            alert("Please upload payment receipt");
            return;
        }

        receiptText = "Receipt uploaded: " + receipt.name;
    }

    document.getElementById("summary").innerHTML = `
        <h3>Order Summary</h3>
        <p>Name: ${name}</p>
        <p>Phone: ${phone}</p>
        <p>Total: RM ${total}</p>
        <p>Payment: ${payment}</p>
        <p>${receiptText}</p>
    `;
}
