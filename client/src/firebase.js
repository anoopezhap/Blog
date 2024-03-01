// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRBASE_API_KEY,
  authDomain: "mern-blog-ef03c.firebaseapp.com",
  projectId: "mern-blog-ef03c",
  storageBucket: "mern-blog-ef03c.appspot.com",
  messagingSenderId: "822500807590",
  appId: "1:822500807590:web:7233338c896d4b68cf7567",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
