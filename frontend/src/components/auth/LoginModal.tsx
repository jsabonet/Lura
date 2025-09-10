'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      onClose();
      setFormData({ username: '', password: '' });
    } else {
      setError(result.error || 'Erro no login');
    }
    
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-green-900/20 dark:bg-green-950/30 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="relative w-full max-w-md max-h-[95vh] overflow-y-auto">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-green-400/30 to-emerald-500/40 blur-2xl" />
        
        <div className="bg-white/95 dark:bg-green-950/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-green-200/70 dark:ring-green-700/70 p-4 sm:p-6 lg:p-8 border border-green-100/70 dark:border-green-800/70 m-2 sm:m-0">
          {/* Header with green accent */}
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400/40 to-emerald-500/50 rounded-full blur-xl"></div>
            <div className="flex justify-between items-start">
              <div className="relative flex-1 min-w-0">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl shadow-lg">
                    <div className="text-white text-base sm:text-lg">🌾</div>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent truncate">
                    Entrar
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-green-600/90 dark:text-green-300/90 font-medium pr-2 leading-relaxed">
                  Acesse sua conta no AgroAlerta
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-green-500 hover:text-green-700 hover:bg-green-100/80 dark:text-green-400 dark:hover:text-green-200 dark:hover:bg-green-800/50 transition-all duration-200 ml-2 backdrop-blur-sm"
                aria-label="Fechar"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-50/80 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-red-200/70 dark:border-red-700/50 backdrop-blur-sm">
                <div className="flex">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-green-700 dark:text-green-300 mb-1.5 sm:mb-2">
                Nome de Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 dark:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-green-200/80 dark:border-green-700/80 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500 bg-white/90 dark:bg-green-900/90 text-green-900 dark:text-green-100 transition-all duration-200 placeholder-green-500/70 dark:placeholder-green-400/70 backdrop-blur-sm"
                  placeholder="Seu nome de usuário"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-green-700 dark:text-green-300 mb-1.5 sm:mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 dark:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-green-200/80 dark:border-green-700/80 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500 bg-white/90 dark:bg-green-900/90 text-green-900 dark:text-green-100 transition-all duration-200 placeholder-green-500/70 dark:placeholder-green-400/70 backdrop-blur-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-300 disabled:to-emerald-300 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base rounded-lg sm:rounded-xl transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none backdrop-blur-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="font-medium">Entrando...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Entrar
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-green-200/60 dark:border-green-700/60"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 sm:px-4 bg-white/80 dark:bg-green-950/80 text-green-600/90 dark:text-green-400/90 font-medium backdrop-blur-sm rounded-full">
                  Não tem uma conta?
                </span>
              </div>
            </div>
            <button
              onClick={onSwitchToRegister}
              className="mt-3 sm:mt-4 font-semibold text-sm sm:text-base text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline transition-all duration-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-green-100/80 dark:hover:bg-green-800/50 backdrop-blur-sm"
            >
              Registre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
