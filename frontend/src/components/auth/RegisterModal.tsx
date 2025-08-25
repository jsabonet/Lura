'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterData } from '@/types';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const PROVINCIAS = [
  'Maputo', 'Gaza', 'Inhambane', 'Sofala', 'Manica', 
  'Tete', 'Zambézia', 'Nampula', 'Cabo Delgado', 'Niassa'
];

const CULTURAS = [
  'Milho', 'Arroz', 'Feijão', 'Mandioca', 'Batata-doce',
  'Amendoim', 'Gergelim', 'Algodão', 'Caju', 'Coco',
  'Banana', 'Manga', 'Abacaxi', 'Tomate', 'Cebola'
];

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    telefone: '',
    tipo_usuario: 'agricultor',
    localizacao: '',
    provincia: '',
    distrito: '',
    culturas_interesse: [],
    receber_sms: true,
    receber_whatsapp: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.password2) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Erro no registro');
    }
    
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCulturaChange = (cultura: string) => {
    const currentCulturas = formData.culturas_interesse || [];
    if (currentCulturas.includes(cultura)) {
      setFormData({
        ...formData,
        culturas_interesse: currentCulturas.filter(c => c !== cultura),
      });
    } else {
      setFormData({
        ...formData,
        culturas_interesse: [...currentCulturas, cultura],
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white dark:bg-green-800 rounded-lg p-8 w-full max-w-2xl mx-4 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-100">
            Registrar
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-green-200 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-200 mb-1">
                Nome
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-200 mb-1">
                Sobrenome
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 dark:text-green-200 mb-1">
              Nome de Usuário
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 dark:text-green-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-200 mb-1">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-200 mb-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-200 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-200 mb-1">
                Província
              </label>
              <select
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
              >
                <option value="">Selecionar província</option>
                {PROVINCIAS.map(provincia => (
                  <option key={provincia} value={provincia}>
                    {provincia}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 dark:text-green-200 mb-1">
              Distrito
            </label>
            <input
              type="text"
              name="distrito"
              value={formData.distrito}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 dark:text-green-200 mb-2">
              Culturas de Interesse
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CULTURAS.map(cultura => (
                <label key={cultura} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.culturas_interesse?.includes(cultura)}
                    onChange={() => handleCulturaChange(cultura)}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-green-700 dark:text-green-200">
                    {cultura}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="receber_sms"
                checked={formData.receber_sms}
                onChange={handleChange}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-green-700 dark:text-green-200">
                Receber SMS
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="receber_whatsapp"
                checked={formData.receber_whatsapp}
                onChange={handleChange}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-green-700 dark:text-green-200">
                Receber WhatsApp
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-green-600 dark:text-green-200">
            Já tem uma conta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-medium text-green-700 dark:text-green-100 hover:underline"
            >
              Entre aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
