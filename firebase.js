firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  }
});

// ==========================
// FIREBASE CONFIG
// ==========================
const firebaseConfig = {
  apiKey: "AIzaSyDwcUC1vEAOQX3F6qbsLMRquByc1tHh33c",
  authDomain: "square-bites.firebaseapp.com",
  projectId: "square-bites",
  storageBucket: "square-bites.firebasestorage.app",
  messagingSenderId: "714058252261",
  appId: "1:714058252261:web:9210d9b22f47fe3eb4790c"
};

// Initialize Firebase (COMPAT VERSION)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
