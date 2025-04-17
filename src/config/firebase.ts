import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCn9_7WKk-AdfJf4ro6EbYzgGcW8pqUmmo",
  authDomain: "wsp-final-project.firebaseapp.com",
  projectId: "wsp-final-project",
  storageBucket: "wsp-final-project.firebasestorage.app",
  messagingSenderId: "771833245604",
  appId: "1:771833245604:web:b6578c8ce81faf6881db31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
