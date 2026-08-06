import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5FrNi1yO8Idi2R1Othzn8e6GBJsLX2tI",
  authDomain: "verixa-7549e.firebaseapp.com",
  projectId: "verixa-7549e",
  storageBucket: "verixa-7549e.firebasestorage.app",
  messagingSenderId: "765607110867",
  appId: "1:765607110867:web:6fa60d8457abc860530c26",
  measurementId: "G-NJ60W3Q82Y",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);