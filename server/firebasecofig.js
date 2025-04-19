// Import the functions you need from the SDKs you need
var admin = require("firebase-admin");
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
});

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWD-s2qbX-ecoL7qpZx1_YUQGnQZd5k5E",
  authDomain: "news-cbb9c.firebaseapp.com",
  projectId: "news-cbb9c",
  storageBucket: "news-cbb9c.firebasestorage.app",
  messagingSenderId: "491986320251",
  appId: "1:491986320251:web:3ed26335c646927efa9bde",
  measurementId: "G-N1BKTBPW7B"
};

// Initialize Firebase
const db = admin.firestore();

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { db };