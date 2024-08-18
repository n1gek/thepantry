// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZpOJM3Gxe6kpLr1u2SGuLmzn7dNbTPXI",
  authDomain: "pantry-7a5a4.firebaseapp.com",
  projectId: "pantry-7a5a4",
  storageBucket: "pantry-7a5a4.appspot.com",
  messagingSenderId: "1065491651362",
  appId: "1:1065491651362:web:6ed1cfb102d3c5c918237b",
  measurementId: "G-2SVYHX2E3X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {app, firestore};