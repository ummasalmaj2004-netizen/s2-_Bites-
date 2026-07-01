auth.onAuthStateChanged(user => {
  if (!user || user.email !== "admin@squarebites.com") {
    window.location.href = "index.html";
  }
});

db.collection("orders").onSnapshot(snapshot => {
  let html = "";

  snapshot.forEach(doc => {
    html += `
      <div class="card">
        <p>${doc.data().item}</p>
        <p>${doc.data().user}</p>
      </div>
    `;
  });

  document.getElementById("orders").innerHTML = html;
});
