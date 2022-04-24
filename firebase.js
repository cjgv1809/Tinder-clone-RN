// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGo48ufH0UY2jm_qCcgkJ65MwHjUN4hw4",
  authDomain: "tinder-clone-c6d81.firebaseapp.com",
  projectId: "tinder-clone-c6d81",
  storageBucket: "tinder-clone-c6d81.appspot.com",
  messagingSenderId: "269131577824",
  appId: "1:269131577824:web:278b742d11a3fcf36dd385",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
