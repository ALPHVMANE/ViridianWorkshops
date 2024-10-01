// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChS7xpoQg3lSguaIDhg2lVYCyhE6E4Lc4",
  authDomain: "viridianworkshops.firebaseapp.com",
  projectId: "viridianworkshops",
  storageBucket: "viridianworkshops.appspot.com",
  messagingSenderId: "1074265766787",
  appId: "1:1074265766787:web:00b43da9c58f8e163b94b6",
  measurementId: "G-VHX11WKGLH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};