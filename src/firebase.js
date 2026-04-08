// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEpcZBgiTdJ9b4VJApwLeasa8qvg6DJcM",
  authDomain: "warikan-app-bfa38.firebaseapp.com",
  projectId: "warikan-app-bfa38",
  storageBucket: "warikan-app-bfa38.firebasestorage.app",
  messagingSenderId: "814532892032",
  appId: "1:814532892032:web:9852829084c500f8249d65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);