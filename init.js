// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPnahnHkPbiiS88W5idzsPaXGbf7hor3U",
  authDomain: "mbm-group-ab.firebaseapp.com",
  projectId: "mbm-group-ab",
  storageBucket: "mbm-group-ab.firebasestorage.app",
  messagingSenderId: "819205330696",
  appId: "1:819205330696:web:2cbd9a034001a97f3dbebd",
  measurementId: "G-WQPJJKBZ75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);