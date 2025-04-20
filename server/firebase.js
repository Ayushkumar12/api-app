import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBABanc9qyPW098eqGNAm0YsKW9aA9e0Z0",
  authDomain: "ayush-d1675.firebaseapp.com",
  databaseURL: "https://ayush-d1675-default-rtdb.firebaseio.com",
  projectId: "ayush-d1675",
  storageBucket: "ayush-d1675.appspot.com",
  messagingSenderId: "1091620849392",
  appId: "1:1091620849392:web:5feb74c720bdc79ed56435",
  measurementId: "G-N0PCCCYRST"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
