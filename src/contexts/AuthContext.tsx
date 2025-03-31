import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

// Tipos para os erros de autenticação
export type AuthErrorType = {
  code: string;
  message: string;
  userFriendlyMessage: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthErrorType | null;
  clearError: () => void;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Função para traduzir erros do Firebase para mensagens amigáveis
const getFriendlyErrorMessage = (error: AuthError): AuthErrorType => {
  let userFriendlyMessage = 'Ocorreu um erro durante a autenticação';
  
  switch (error.code) {
    case 'auth/invalid-email':
      userFriendlyMessage = 'O e-mail fornecido é inválido';
      break;
    case 'auth/user-disabled':
      userFriendlyMessage = 'Esta conta foi desativada';
      break;
    case 'auth/user-not-found':
      userFriendlyMessage = 'Nenhuma conta encontrada com este e-mail';
      break;
    case 'auth/invalid-credential':
      userFriendlyMessage = 'Senha incorreta';
      break;
    case 'auth/email-already-in-use':
      userFriendlyMessage = 'Este e-mail já está em uso por outra conta';
      break;
    case 'auth/operation-not-allowed':
      userFriendlyMessage = 'Operação não permitida';
      break;
    case 'auth/weak-password':
      userFriendlyMessage = 'A senha é muito fraca (mínimo de 6 caracteres)';
      break;
    case 'auth/too-many-requests':
      userFriendlyMessage = 'Muitas tentativas. Tente novamente mais tarde';
      break;
    case 'auth/popup-closed-by-user':
      userFriendlyMessage = 'Login com Google cancelado';
      break;
    default:
      userFriendlyMessage = error.message || userFriendlyMessage;
  }

  return {
    code: error.code,
    message: error.message,
    userFriendlyMessage
  };
};

// Função para salvar o usuário no LocalStorage
const saveUserToLocalStorage = (user: User | null) => {
  if (user) {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      // Adicione outros dados do usuário que você queira persistir
    };
    localStorage.setItem('user', JSON.stringify(userData));
  } else {
    localStorage.removeItem('user');
  }
};

// Função para carregar o usuário do LocalStorage
const loadUserFromLocalStorage = (): User | null => {
  const userData = localStorage.getItem('user');
  if (!userData) return null;

  try {
    const parsedData = JSON.parse(userData);
    // Retorna um objeto que simula um User do Firebase
    return {
      uid: parsedData.uid,
      email: parsedData.email,
      displayName: parsedData.displayName,
      photoURL: parsedData.photoURL,
      // Outras propriedades necessárias
      // Note: este não é um User real do Firebase, apenas um objeto com os dados
    } as User;
  } catch (error) {
    console.error('Failed to parse user data from localStorage', error);
    return null;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(loadUserFromLocalStorage());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthErrorType | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // Usuário autenticado no Firebase
        setUser(firebaseUser);
        saveUserToLocalStorage(firebaseUser);
      } else {
        // Usuário não autenticado
        setUser(null);
        saveUserToLocalStorage(null);
      }
      setLoading(false);
      setError(null); // Limpa erros quando o estado de autenticação muda
    });

    return unsubscribe;
  }, []);

  const clearError = () => setError(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const authError = getFriendlyErrorMessage(error as AuthError);
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = getFriendlyErrorMessage(error as AuthError);
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = getFriendlyErrorMessage(error as AuthError);
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      saveUserToLocalStorage(null);
    } catch (error) {
      const authError = getFriendlyErrorMessage(error as AuthError);
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    clearError,
    signInWithGoogle,
    logout,
    register,
    login,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};