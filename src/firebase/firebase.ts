import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3VZWqLQkFzD9MUCvVjUtp22sgZYklPK4",
  authDomain: "chat-ce59a.firebaseapp.com",
  projectId: "chat-ce59a",
  storageBucket: "chat-ce59a.appspot.com",
  messagingSenderId: "417613792244",
  appId: "1:417613792244:web:b6ed321c5b2c690e242fa1",
  measurementId: "G-C2BQ79V66Y",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const auth = getAuth();
