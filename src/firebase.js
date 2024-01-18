// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCNm1m9OwJM5oXXgpfKNtKGN114cBXsBZ8",
    authDomain: "task-scheduling-kernel.firebaseapp.com",
    databaseURL: "https://task-scheduling-kernel-default-rtdb.firebaseio.com",
    projectId: "task-scheduling-kernel",
    storageBucket: "task-scheduling-kernel.appspot.com",
    messagingSenderId: "15154131326",
    appId: "1:15154131326:web:9753c66e90165cafa2432f",
    measurementId: "G-STQXS8GQB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export {
    db
}