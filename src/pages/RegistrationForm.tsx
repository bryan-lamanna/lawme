import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const areasOfLaw = [
  'Civil', 'Trabalhista', 'Tributário', 'Empresarial', 
  'Ambiental', 'Penal', 'Família', 'Consumidor'
];

export default function RegistrationForm() {
  const { user, saveAdditionalData } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'client' | 'lawyer'>('client');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    cpf: '',
    interests: [] as string[],
    oabNumber: '',
    oabState: '',
    specializations: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSave = {
        userType,
        fullName: formData.fullName,
        phone: formData.phone,
        cpf: formData.cpf,
        completedRegistration: true,
        ...(userType === 'client' 
          ? { interests: formData.interests }
          : { 
              oabNumber: formData.oabNumber,
              oabState: formData.oabState,
              specializations: formData.specializations
            })
      };

      await saveAdditionalData(dataToSave);
      // atualiza a pagina
      window.location.reload();

      console.log('Dados salvos com sucesso!');
    } catch (err) {
      setError('Erro ao salvar dados. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (field: 'interests' | 'specializations', value: string) => {
    setFormData(prev => {
      const current = [...prev[field]];
      const index = current.indexOf(value);
      
      if (index === -1) {
        current.push(value);
      } else {
        current.splice(index, 1);
      }

      return { ...prev, [field]: current };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden w-full max-w-md border border-gray-700">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            Complete seu cadastro
          </h2>
          <p className="text-indigo-100 mt-1">
            Precisamos de algumas informações adicionais
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setUserType('client')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  userType === 'client' 
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Sou Cliente
              </button>
              <button
                type="button"
                onClick={() => setUserType('lawyer')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  userType === 'lawyer' 
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Sou Advogado
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {userType === 'lawyer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Número da OAB
                    </label>
                    <input
                      type="text"
                      value={formData.oabNumber}
                      onChange={(e) => setFormData({...formData, oabNumber: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Estado da OAB
                    </label>
                    <select
                      value={formData.oabState}
                      onChange={(e) => setFormData({...formData, oabState: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione</option>
                      {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Áreas de Especialização
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {areasOfLaw.map(area => (
                        <label key={area} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.specializations.includes(area)}
                            onChange={() => handleCheckboxChange('specializations', area)}
                            className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-300">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {userType === 'client' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Áreas de Interesse
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {areasOfLaw.map(area => (
                      <label key={area} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(area)}
                          onChange={() => handleCheckboxChange('interests', area)}
                          className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-300">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-violet-700'
              }`}
            >
              {loading ? 'Salvando...' : 'Completar Cadastro'}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}