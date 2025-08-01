import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2vCKS1AS-ob7MK5MLIqxr8zkLYk0-4lQ",
  authDomain: "retroboard-35f16.firebaseapp.com",
  projectId: "retroboard-35f16",
  storageBucket: "retroboard-35f16.firebasestorage.app",
  messagingSenderId: "97219406728",
  appId: "1:97219406728:web:feb28991693287abd2683d",
  measurementId: "G-BMR9YGD3LF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);