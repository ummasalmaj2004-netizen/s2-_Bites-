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
        option.value === "Bank Transfer" &&
        option.checked
    ) {
        bankInfo.style.display = "block";
    } else if (option.checked) {
        bankInfo.style.display = "none";
    }
});
```

});

async function calculateOrder() {

```
let name =
document.getElementById("name").value.trim();

let phone =
document.getElementById("phone").value.trim();

let address =
document.getElementById("address").value.trim();

let jollof =
Number(document.getElementById("jollo
```
