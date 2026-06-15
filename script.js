let finalSummary = "";
let finalTotal = 0;

function calculateTotal() {

    const foods = document.querySelectorAll(".food");

    let subtotal = 0;
    let summary = "";

    let selected = false;

    foods.forEach((food, index) => {

        if(food.checked){

            selected = true;

            const qtyInput = document.getElementById(`qty${index+1}`);

            let qty = parseInt(qtyInput.value);

            if(isNaN(qty) || qty <= 0){
                alert("Please enter valid quantity.");
                return;
            }

            const name = food.dataset.name;
            const price = parseFloat(food.dataset.price);

            const itemTotal = qty * price;

            subtotal += itemTotal;

            summary += `${name} x ${qty} = RM${itemTotal.toFixed(2)}<br>`;
        }
    });

    if(!selected){
        alert("Please select at least one food item.");
        return;
    }

    const sst = subtotal * 0.06;
    const total = subtotal + sst;

    summary += "<hr>";
    summary += `Subtotal = RM${subtotal.toFixed(2)}<br>`;
    summary += `SST (6%) = RM${sst.toFixed(2)}<br>`;
    summary += `<strong>Total = RM${total.toFixed(2)}</strong>`;

    document.getElementById("summary").innerHTML = summary;

    finalSummary = summary;
    finalTotal = total;

    localStorage.setItem("orderSummary", summary);
}

function submitOrder(){

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    if(name === "" || phone === "" || address === ""){
        alert("Please complete all customer information.");
        return;
    }

    if(isNaN(phone)){
        alert("Phone number must be numeric.");
        return;
    }

    const paymentMethod =
        document.querySelector('input[name="payment"]:checked');

    if(paymentMethod === null){
        alert("Please select payment method.");
        return;
    }

    if(finalTotal === 0){
        alert("Please calculate your order first.");
        return;
    }

    alert("Thank you, your order has been placed!");

    const receipt = `
        <div class="receipt-box">
            <h3>Order Receipt</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Payment:</strong> ${paymentMethod.value}</p>
            <hr>
            ${finalSummary}
        </div>
    `;

    document.getElementById("receipt").innerHTML = receipt;
}

function resetForm(){

    document.querySelectorAll("input").forEach(input=>{

        if(input.type === "checkbox" || input.type === "radio"){
            input.checked = false;
        }else{
            input.value = "";
        }
    });

    document.getElementById("address").value = "";

    document.getElementById("summary").innerHTML = "";
    document.getElementById("receipt").innerHTML = "";

    finalSummary = "";
    finalTotal = 0;

    localStorage.clear();
}

window.onload = function(){

    const savedOrder = localStorage.getItem("orderSummary");

    if(savedOrder){
        document.getElementById("summary").innerHTML = savedOrder;
    }
};
