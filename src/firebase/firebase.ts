import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/analytics";
import { Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3VZWqLQkFzD9MUCvVjUtp22sgZYklPK4",
  authDomain: "chat-ce59a.firebaseapp.com",
  projectId: "chat-ce59a",
  storageBucket: "chat-ce59a.appspot.com",
  messagingSenderId: "417613792244",
  appId: "1:417613792244:web:b6ed321c5b2c690e242fa1",
  measurementId: "G-C2BQ79V66Y",
};

export const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth() as unknown as Auth;
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();
