'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      setShowRegisterModal(true);
    }
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🌾</div>
            <h1 className="text-2xl font-bold text-green-800 dark:text-green-100">
              AgroAlerta
            </h1>
          </div>
          <div className="space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-green-700 dark:text-green-200">
                  Olá, {user?.first_name || user?.username}!
                </span>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-green-700 hover:text-green-900 dark:text-green-200 dark:hover:text-white"
                >
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-green-700 hover:text-green-900 dark:text-green-200 dark:hover:text-white"
                >
                  Entrar
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Registrar
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-green-800 dark:text-green-100 mb-6">
            Sistema Inteligente de
            <span className="text-green-600 dark:text-green-400"> Alerta Agrícola</span>
          </h2>
          <p className="text-xl text-green-700 dark:text-green-200 mb-8 max-w-3xl mx-auto">
            Desenvolvido especificamente para agricultores de Moçambique. 
            Combine previsões climáticas, detecção de pragas por IA, recomendações personalizadas e informações de mercado.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={handleGetStarted}
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {isAuthenticated ? 'Ir ao Dashboard' : 'Começar Agora'}
            </button>
            <button
              onClick={() => router.push('/sobre')}
              className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 hover:text-white transition-colors"
            >
              Saiba Mais
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white dark:bg-green-800 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow cursor-pointer"
               onClick={() => router.push('/clima')}>
            <div className="text-4xl mb-4">🌤️</div>
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-2">
              Clima Inteligente
            </h3>
            <p className="text-green-600 dark:text-green-200">
              Previsões de 7 dias e alertas climáticos extremos
            </p>
          </div>

          <div className="bg-white dark:bg-green-800 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow cursor-pointer"
               onClick={() => router.push('/pragas')}>
            <div className="text-4xl mb-4">🐛</div>
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-2">
              Detecção de Pragas
            </h3>
            <p className="text-green-600 dark:text-green-200">
              Identifique pragas com IA através de fotos
            </p>
          </div>

          <div className="bg-white dark:bg-green-800 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow cursor-pointer"
               onClick={() => router.push('/chatbot')}>
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-2">
              Assistente Agrícola
            </h3>
            <p className="text-green-600 dark:text-green-200">
              Chatbot inteligente com recomendações personalizadas
            </p>
          </div>

          <div className="bg-white dark:bg-green-800 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow cursor-pointer"
               onClick={() => router.push('/mercado')}>
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-2">
              Mercado Agrícola
            </h3>
            <p className="text-green-600 dark:text-green-200">
              Preços em tempo real e tendências de mercado
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-green-800 rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-green-800 dark:text-green-100 mb-8">
            Feito para Moçambique
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">100%</div>
              <div className="text-green-700 dark:text-green-200">Gratuito</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">🇲🇿</div>
              <div className="text-green-700 dark:text-green-200">Adaptado para Moçambique</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">24/7</div>
              <div className="text-green-700 dark:text-green-200">Assistência Disponível</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-green-600 dark:text-green-300">
        <p>&copy; 2025 AgroAlerta. Sistema gratuito para agricultores de Moçambique.</p>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}
