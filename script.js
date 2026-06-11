function calculateOrder() {

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;

    let jollof = Number(document.getElementById("jollof").value);
    let fried = Number(document.getElementById("fried").value);
    let yam = Number(document.getElementById("yam").value);
    let eba = Number(document.getElementById("eba").value);
    let suya = Number(document.getElementById("suya").value);
    let moi = Number(document.getElementById("moi").value);

    if(name === "" || phone === ""){
        alert("Please enter your name and phone number.");
        return;
    }

    let subtotal =
        (jollof * 12) +
        (fried * 13) +
        (yam * 18) +
        (eba * 15) +
        (suya * 10) +
        (moi * 5);

    if(subtotal === 0){
        alert("Please select at least one food item.");
        return;
    }

    let serviceCharge = subtotal * 0.05;
    let deliveryFee = 5;
    let total = subtotal + serviceCharge + deliveryFee;

    document.getElementById("summary").innerHTML = `
        <h2>Order Summary</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>

        <p>Subtotal: RM ${subtotal.toFixed(2)}</p>
        <p>Service Charge (5%): RM ${serviceCharge.toFixed(2)}</p>
        <p>Delivery Fee: RM ${deliveryFee.toFixed(2)}</p>

        <h3>Total: RM ${total.toFixed(2)}</h3>
    `;
}
