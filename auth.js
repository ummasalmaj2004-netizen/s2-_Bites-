function register() {
  auth.createUserWithEmailAndPassword(
    email.value,
    password.value
  ).then(() => {
    alert("Registered!");
    window.location.href = "home.html";
  }).catch(err => alert(err.message));
}

function login() {
  auth.signInWithEmailAndPassword(
    email.value,
    password.value
  ).then(userCredential => {

    const user = userCredential.user;

    if (user.email === "admin@squarebites.com") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "home.html";
    }

  }).catch(err => alert(err.message));
}
