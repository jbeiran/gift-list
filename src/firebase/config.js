import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBp_n3-eEYTJCh55SZEZArEt9cobAANfpA",
    authDomain: "gift-list-23954.firebaseapp.com",
    projectId: "gift-list-23954",
    storageBucket: "gift-list-23954.firebasestorage.app",
    messagingSenderId: "522995791522",
    appId: "1:522995791522:web:27ba7d19ae9d1e7b2989fb",
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
