import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Tipos para os erros de autenticação
export type AuthErrorType = {
  code: string;
  message: string;
  userFriendlyMessage: string;
};

interface UserAdditionalData {
  userType: 'client' | 'lawyer' | null;
  fullName: string;
  phone: string;
  cpf: string;
  interests?: string[];
  oabNumber?: string;
  oabState?: string;
  specializations?: string[];
  completedRegistration: boolean;
}

interface AuthContextType {
  user: User | null;
  userData: UserAdditionalData | null;
  loading: boolean;
  error: AuthErrorType | null;
  clearError: () => void;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  saveAdditionalData: (data: Omit<UserAdditionalData, 'completedRegistration'>) => Promise<void>;
  checkRegistrationComplete: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserAdditionalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthErrorType | null>(null);

  // Função para carregar dados adicionais do Firestore
  const loadUserData = async (userId: string) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as UserAdditionalData;
        setUserData(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error loading user data:", error);
      return null;
    }
  };

  // Função para verificar se o registro está completo
  const checkRegistrationComplete = async () => {
    if (!user) return false;
    
    const data = await loadUserData(user.uid);
    return data?.completedRegistration || false;
  };

  // Função para salvar dados adicionais
  const saveAdditionalData = async (data: Omit<UserAdditionalData, 'completedRegistration'>): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    setLoading(true);
  
    try {
      const userRef = doc(db, 'users', user.uid);
      const userData = {
        ...data,
        completedRegistration: true,
        email: user.email,
        lastUpdated: new Date()
      };
  
      await setDoc(userRef, userData, { merge: true });
      setUserData(userData);
      // Removido o "return true" que estava aqui
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar os dados do usuário
  const refreshUserData = async () => {
    if (user) {
      await loadUserData(user.uid);
    }
  };

  // Efeito principal para gerenciar autenticação
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          await loadUserData(firebaseUser.uid);
        } else {
          setUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
      } finally {
        setLoading(false);
        setError(null);
      }
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
      setUserData(null);
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
    userData,
    loading,
    error,
    clearError,
    signInWithGoogle,
    logout,
    register,
    login,
    saveAdditionalData,
    checkRegistrationComplete,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};