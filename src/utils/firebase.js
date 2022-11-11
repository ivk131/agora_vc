import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA0kfy4FNpQOFPRPrr0T2Le2PjfCrKXhcY",
  authDomain: "agora-vc.firebaseapp.com",
  databaseURL: "https://agora-vc-default-rtdb.firebaseio.com",
  projectId: "agora-vc",
  storageBucket: "agora-vc.appspot.com",
  messagingSenderId: "334486991109",
  appId: "1:334486991109:web:fe5c9768d9c3f77c13876c",
  measurementId: "G-6KB45TWME2",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
