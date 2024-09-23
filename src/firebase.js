// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export {auth};