import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight, X } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logotipo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { 
    login, 
    register, 
    signInWithGoogle, 
    error, 
    clearError,
    loading 
  } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (error) {
      // O erro já é tratado no AuthContext e disponibilizado via useAuth()
      console.error('Authentication error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  // Limpa erros quando alterna entre login e registro
  const toggleRegister = () => {
    clearError();
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden w-full max-w-md border border-gray-700">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-center">
          <div className="flex justify-center">
            <img src={logo} alt="Law Me Logo" className="h-20" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isRegistering ? 'Crie sua conta' : 'Acesse sua conta'}
          </h2>
          <p className="text-indigo-100 mt-1">
            {isRegistering ? 'Comece a usar o Law Me hoje mesmo' : 'Bem-vindo de volta ao Law Me'}
          </p>
        </div>

        <div className="p-6">
          {/* Exibição de erros */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-start">
              <div className="flex-1 text-red-200 text-sm">
                {error.userFriendlyMessage}
              </div>
              <button 
                onClick={clearError}
                className="text-red-300 hover:text-white ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Campo Email */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                    minLength={isRegistering ? 6 : undefined}
                  />
                </div>
              </div>
            </div>

            {/* Botão de Ação */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                loading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:from-indigo-700 hover:to-violet-700 hover:shadow-indigo-500/20'
              }`}
            >
              {loading ? (
                <span>Carregando...</span>
              ) : (
                <>
                  {isRegistering ? 'Cadastrar' : 'Entrar'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OU</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          {/* Login com Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full flex items-center justify-center py-3 px-4 border ${
              loading ? 'border-gray-700' : 'border-gray-600 hover:border-gray-500'
            } text-white font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
              loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            Continuar com Google
          </button>

          {/* Alternar entre Login/Cadastro */}
          <p className="mt-6 text-center text-sm text-gray-400">
            {isRegistering ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}{' '}
            <button
              type="button"
              onClick={toggleRegister}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              disabled={loading}
            >
              {isRegistering ? 'Faça login' : 'Crie uma conta'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}