import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA5XNVqhmryqUQMhwT9S4vNP9XkrIIs8CQ",
    authDomain: "chatlama-f20c1.firebaseapp.com",
    projectId: "chatlama-f20c1",
    storageBucket: "chatlama-f20c1.appspot.com",
    messagingSenderId: "118116252806",
    appId: "1:118116252806:web:e8f0d25880242883036507",
    measurementId: "G-KLT66T8L90"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const strorage = getStorage()
