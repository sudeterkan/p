import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get, child } from "firebase/database";
import { getAuth } from "firebase/auth"; // 🔑 Authentication eklendi

const firebaseConfig = {
  apiKey: "AIzaSyBYm3QrXZAYv-VbtFdz8jeIozXqbQcLsBI",
  authDomain: "parkmate-4dcd6.firebaseapp.com",
  databaseURL: "https://parkmate-4dcd6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "parkmate-4dcd6",
  storageBucket: "parkmate-4dcd6.firebasestorage.app",
  messagingSenderId: "610672793712",
  appId: "1:610672793712:web:06a77f3eda90f2f152bcb5",
  measurementId: "G-YBJKHRNE4W",
};

// Uygulamayı başlat
const app = initializeApp(firebaseConfig);

// Realtime Database ve Auth referansları
const db = getDatabase(app);
const auth = getAuth(app); // 🔑 Authentication burada tanımlandı

// İhtiyaç duyulan her şeyi export ediyoruz
export { db, ref, push, get, child, auth };
