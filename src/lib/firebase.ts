import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTmkIuaO9lxay-4oUYFyPFDb4M7rfvIso",
  authDomain: "lawme-da3af.firebaseapp.com",
  projectId: "lawme-da3af",
  storageBucket: "lawme-da3af.firebasestorage.app",
  messagingSenderId: "925024794674",
  appId: "1:925024794674:web:3019c74d87db03b2abe42b",
  measurementId: "G-8GLKW76C86"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };