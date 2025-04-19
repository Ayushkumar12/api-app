// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeDataConnect } from "@firebase/data-connect";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWD-s2qbX-ecoL7qpZx1_YUQGnQZd5k5E",
  authDomain: "news-cbb9c.firebaseapp.com",
  projectId: "news-cbb9c",
  storageBucket: "news-cbb9c.firebasestorage.app",
  messagingSenderId: "491986320251",
  appId: "1:491986320251:web:3ed26335c646927efa9bde",
  measurementId: "G-N1BKTBPW7B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign in anonymously for demo purposes (replace with your auth logic)
signInAnonymously(auth).catch(console.error);



export { app, auth, dataConnect };
