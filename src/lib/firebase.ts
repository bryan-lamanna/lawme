import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBTmkIuaO9lxay-4oUYFyPFDb4M7rfvIso",
  authDomain: "lawme-da3af.firebaseapp.com",
  projectId: "lawme-da3af",
  storageBucket: "lawme-da3af.firebasestorage.app",
  messagingSenderId: "925024794674",
  appId: "1:925024794674:web:3019c74d87db03b2abe42b",
  measurementId: "G-8GLKW76C86"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);

// Serviços do Firebase
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Configurações adicionais do provedor Google
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { 
  app,
  auth,
  db,
  googleProvider,
  analytics
};