/* =========================================================
   S² BITES — auth.js
   Handles login + registration on index.html and routes
   the user to the correct page based on their email.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  const showLoginBtn = document.getElementById("show-login");
  const showRegisterBtn = document.getElementById("show-register");

  const loginMsg = document.getElementById("login-message");
  const registerMsg = document.getElementById("register-message");

  // ---- Toggle between login / register panels ----
  function showPanel(panel) {
    const isLogin = panel === "login";
    loginForm.style.display = isLogin ? "block" : "none";
    registerForm.style.display = isLogin ? "none" : "block";
    document.getElementById("auth-kicker").textContent = isLogin
      ? "Welcome back"
      : "Join the table";
    document.getElementById("auth-heading").textContent = isLogin
      ? "Sign in to order"
      : "Create your account";
    loginMsg.textContent = "";
    registerMsg.textContent = "";
  }

  showLoginBtn.addEventListener("click", () => showPanel("login"));
  showRegisterBtn.addEventListener("click", () => showPanel("register"));

  function setMessage(el, text, type) {
    el.textContent = text;
    el.className = "form-message" + (type ? " " + type : "");
  }

  function routeAfterLogin(user) {
    if (user.email && user.email.toLowerCase() === ADMIN_EMAIL) {
      window.location.href = "admin.html";
    } else {
      window.location.href = "home.html";
    }
  }

  // ---- If already logged in, skip straight to the right page ----
  auth.onAuthStateChanged((user) => {
    if (user) {
      routeAfterLogin(user);
    }
  });

  // ---- Login ----
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const btn = document.getElementById("login-btn");

    setMessage(loginMsg, "", "");
    btn.disabled = true;
    btn.textContent = "Signing in…";

    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      routeAfterLogin(cred.user);
    } catch (err) {
      setMessage(loginMsg, friendlyError(err), "error");
      btn.disabled = false;
      btn.textContent = "Sign In";
    }
  });

  // ---- Register ----
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const confirm = document.getElementById("register-confirm").value;
    const btn = document.getElementById("register-btn");

    setMessage(registerMsg, "", "");

    if (password !== confirm) {
      setMessage(registerMsg, "Passwords do not match.", "error");
      return;
    }
    if (password.length < 6) {
      setMessage(registerMsg, "Password must be at least 6 characters.", "error");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Creating account…";

    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      if (name) {
        await cred.user.updateProfile({ displayName: name });
      }
      await db.collection("users").doc(cred.user.uid).set({
        name: name,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      routeAfterLogin(cred.user);
    } catch (err) {
      setMessage(registerMsg, friendlyError(err), "error");
      btn.disabled = false;
      btn.textContent = "Create Account";
    }
  });

  function friendlyError(err) {
    const map = {
      "auth/user-not-found": "No account found with that email.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/email-already-in-use": "That email is already registered.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password is too weak — use at least 6 characters.",
      "auth/invalid-credential": "Incorrect email or password."
    };
    return map[err.code] || err.message || "Something went wrong. Please try again.";
  }
});
