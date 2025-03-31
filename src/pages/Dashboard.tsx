import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, FileText, Users, Settings, Bell, MessageSquare, Calendar, Bookmark } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 bg-opacity-50 backdrop-blur-lg border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Law Me
          </h1>
          <p className="text-sm text-gray-400 mt-1">Sua plataforma jurídica</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg bg-indigo-900 bg-opacity-30 text-indigo-200 hover:bg-indigo-800 hover:bg-opacity-50 transition-all">
            <Home className="h-5 w-5" />
            <span>Início</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 transition-all">
            <FileText className="h-5 w-5" />
            <span>Processos</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 transition-all">
            <Users className="h-5 w-5" />
            <span>Clientes</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 transition-all">
            <Calendar className="h-5 w-5" />
            <span>Agenda</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 transition-all">
            <MessageSquare className="h-5 w-5" />
            <span>Mensagens</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 transition-all">
            <Bookmark className="h-5 w-5" />
            <span>Documentos</span>
          </a>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 transition-all">
            <Settings className="h-5 w-5" />
            <span>Configurações</span>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-b border-gray-700">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold">Dashboard</h2>
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="relative p-2 rounded-full hover:bg-gray-700 hover:bg-opacity-50">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline">{user?.email}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 px-4 py-2 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-900 to-violet-900 rounded-xl p-6 mb-6 border border-indigo-800">
            <h1 className="text-2xl font-bold mb-2">Bem-vindo de volta, {user?.email?.split('@')[0]}!</h1>
            <p className="text-indigo-200">Aqui está o que está acontecendo na sua conta hoje.</p>
          </div>

          {/* Feed Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-4 border border-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <textarea 
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Compartilhe uma atualização..."
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex space-x-2">
                        <button className="p-2 rounded-full hover:bg-gray-700">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-700">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">
                        Publicar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feed Items */}
              <div className="space-y-4">
                {/* Example Post 1 */}
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                      J
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">João Silva</h3>
                          <p className="text-xs text-gray-400">2 horas atrás</p>
                        </div>
                        <button className="text-gray-400 hover:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </div>
                      <p className="mt-2">Acabei de atualizar o processo #12345 com novos documentos. Por favor, revisem quando possível.</p>
                      <div className="flex items-center mt-4 space-x-4 text-gray-400">
                        <button className="flex items-center space-x-1 hover:text-indigo-400">
                          <MessageSquare className="h-4 w-4" />
                          <span>3 comentários</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Example Post 2 */}
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-full bg-pink-600 flex items-center justify-center">
                      M
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Maria Souza</h3>
                          <p className="text-xs text-gray-400">Ontem</p>
                        </div>
                        <button className="text-gray-400 hover:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </div>
                      <p className="mt-2">Lembrete: Reunião com o cliente ABC Corp amanhã às 10h. Por favor, preparem os documentos necessários.</p>
                      <div className="flex items-center mt-4 space-x-4 text-gray-400">
                        <button className="flex items-center space-x-1 hover:text-indigo-400">
                          <MessageSquare className="h-4 w-4" />
                          <span>5 comentários</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-4 border border-gray-700">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-400" />
                  Próximos Eventos
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-900 rounded-lg p-2 flex flex-col items-center justify-center min-w-12">
                      <span className="text-xs font-semibold">QUI</span>
                      <span className="text-lg font-bold">15</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Reunião com cliente</h4>
                      <p className="text-sm text-gray-400">10:00 - 11:30</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-violet-900 rounded-lg p-2 flex flex-col items-center justify-center min-w-12">
                      <span className="text-xs font-semibold">SEX</span>
                      <span className="text-lg font-bold">16</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Prazo para documentos</h4>
                      <p className="text-sm text-gray-400">Todo o dia</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Documents */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-4 border border-gray-700">
                <h3 className="font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-indigo-400" />
                  Documentos Recentes
                </h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 hover:bg-opacity-30 transition-colors">
                    <div className="bg-indigo-900 bg-opacity-50 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-indigo-300" />
                    </div>
                    <div>
                      <h4 className="font-medium">Contrato ABC Corp.pdf</h4>
                      <p className="text-xs text-gray-400">Atualizado ontem</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 hover:bg-opacity-30 transition-colors">
                    <div className="bg-violet-900 bg-opacity-50 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-violet-300" />
                    </div>
                    <div>
                      <h4 className="font-medium">Petição Inicial.docx</h4>
                      <p className="text-xs text-gray-400">Atualizado há 2 dias</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}