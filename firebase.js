/* =========================================================
   S² BITES — Firebase initialization
   Loaded after the Firebase compat SDK scripts on every page.
   ========================================================= */

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwcUC1vEAOQX3F6qbsLMRquByc1tHh33c",
  authDomain: "square-bites.firebaseapp.com",
  projectId: "square-bites",
  storageBucket: "square-bites.firebasestorage.app",
  messagingSenderId: "714058252261",
  appId: "1:714058252261:web:9210d9b22f47fe3eb4790c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

const ADMIN_EMAIL = "admin@squarebites.com";
