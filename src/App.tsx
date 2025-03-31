import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LoadingScreen from './components/LoadingScreen'; // Adicione este componente

// Componente para verificar o estado de autenticação
const AuthCheck = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />; // Tela de carregamento enquanto verifica a autenticação
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthCheck>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthCheck>
      </AuthProvider>
    </Router>
  );
}

export default App;