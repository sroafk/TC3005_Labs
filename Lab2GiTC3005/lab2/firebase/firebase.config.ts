import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtFpoty70RldEJdL_DsqcKO4Qq1L7MZhw",
  authDomain: "backend-firebase-c9a8c.firebaseapp.com",
  projectId: "backend-firebase-c9a8c",
  storageBucket: "backend-firebase-c9a8c.firebasestorage.app",
  messagingSenderId: "693911739233",
  appId: "1:693911739233:web:6ba049b2bae9889a66c320",
  measurementId: "G-GWZPFFHJW2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };