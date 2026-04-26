import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDw3IaEfIxQbKk0RqeuZ8s2zEn5HfjbnIE",
  authDomain: "cornell-bathroom.firebaseapp.com",
  projectId: "cornell-bathroom",
  storageBucket: "cornell-bathroom.firebasestorage.app",
  messagingSenderId: "911685438989",
  appId: "1:911685438989:web:2676a90666334621c48f44",
  measurementId: "G-GGDX6EX18H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();