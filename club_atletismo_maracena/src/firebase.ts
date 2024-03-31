// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcVpspx6GEOQ51VK223U_jmawURkFhYmM",
  authDomain: "club-atletismo-maracena.firebaseapp.com",
  projectId: "club-atletismo-maracena",
  storageBucket: "club-atletismo-maracena.appspot.com",
  messagingSenderId: "852666052821",
  appId: "1:852666052821:web:ae3bd906aae6d8906f325c",
  measurementId: "G-BJ5L9YJGG0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;