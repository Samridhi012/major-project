//Client Setup: Initializes the Firebase SDK on the client side for user sign-in and MFA.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzXTCWbGWNcIc_X3eSgPnl-4762XpNfL8",
  authDomain: "expense-tracker-major-project.firebaseapp.com",
  projectId: "expense-tracker-major-project",
  storageBucket: "expense-tracker-major-project.firebasestorage.app",
  messagingSenderId: "584715555897",
  appId: "1:584715555897:web:f5e8c6480d15dbb62a69e8",
  measurementId: "G-MW7LD6GC43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);