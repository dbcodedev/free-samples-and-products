import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgMjyXBr2Wf49GE6PuL1N2f8o1sK9OpvM",
  authDomain: "free-samples-a418f.firebaseapp.com",
  projectId: "free-samples-a418f",
  storageBucket: "free-samples-a418f.appspot.com",
  messagingSenderId: "922519637675",
  appId: "1:922519637675:web:6aaf5749ec5ed19173f1ee"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);