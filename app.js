function placeOrder() {

  db.collection("orders").add({
    item: "Test Order",
    time: new Date(),
    user: auth.currentUser.email
  }).then(() => {
    alert("Order placed!");
  });

}
