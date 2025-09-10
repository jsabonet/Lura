'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900 dark:via-emerald-900 dark:to-green-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-green-800/80 backdrop-blur-sm border-b border-green-200 dark:border-green-700">
        <div className="container mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🌾</div>
              <h1 className="text-2xl font-bold text-green-800 dark:text-green-100">
                AgroAlerta
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-green-700 dark:text-green-200 font-medium">
                    Olá, {user?.first_name || user?.username}!
                  </span>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-4 py-2 text-green-700 hover:text-green-900 dark:text-green-200 dark:hover:text-white font-medium rounded-lg hover:bg-green-50 dark:hover:bg-green-700/50 transition-all duration-200"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="px-4 py-2 text-green-700 hover:text-green-900 dark:text-green-200 dark:hover:text-white font-medium rounded-lg hover:bg-green-50 dark:hover:bg-green-700/50 transition-all duration-200"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Registrar
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <div className="bg-white/80 dark:bg-green-800/80 backdrop-blur-sm rounded-3xl p-12 border border-green-200 dark:border-green-700 shadow-2xl">
            <h2 className="text-5xl lg:text-6xl font-bold text-green-800 dark:text-green-100 mb-6">
              Sistema Inteligente de
              <span className="block text-green-600 dark:text-green-400 mt-2"> Alerta Agrícola</span>
            </h2>
            <p className="text-xl text-green-700 dark:text-green-200 mb-10 max-w-4xl mx-auto leading-relaxed">
              Desenvolvido especificamente para agricultores de Moçambique. 
              Combine previsões climáticas, detecção de pragas por IA, recomendações personalizadas e informações de mercado.
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isAuthenticated ? 'Ir ao Dashboard' : 'Começar Agora'}
              </button>
              <button
                onClick={() => router.push('/sobre')}
                className="border-2 border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-green-600 hover:text-white dark:hover:bg-green-600 transition-all duration-300 backdrop-blur-sm"
              >
                Saiba Mais
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="bg-white/80 dark:bg-green-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-green-200 dark:border-green-700 text-center hover:shadow-2xl hover:bg-white dark:hover:bg-green-800 transition-all duration-300 cursor-pointer transform hover:scale-105"
               onClick={() => router.push('/clima')}>
            <div className="text-5xl mb-6">🌤️</div>
            <h3 className="text-xl font-bold text-green-800 dark:text-green-100 mb-3">
              Clima Inteligente
            </h3>
            <p className="text-green-600 dark:text-green-200 leading-relaxed">
              Previsões de 7 dias e alertas climáticos extremos
            </p>
          </div>

          <div className="bg-white/80 dark:bg-green-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-green-200 dark:border-green-700 text-center hover:shadow-2xl hover:bg-white dark:hover:bg-green-800 transition-all duration-300 cursor-pointer transform hover:scale-105"
               onClick={() => router.push('/pragas')}>
            <div className="text-5xl mb-6">🐛</div>
            <h3 className="text-xl font-bold text-green-800 dark:text-green-100 mb-3">
              Detecção de Pragas
            </h3>
            <p className="text-green-600 dark:text-green-200 leading-relaxed">
              Identifique pragas com IA através de fotos
            </p>
          </div>

          <div className="bg-white/80 dark:bg-green-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-green-200 dark:border-green-700 text-center hover:shadow-2xl hover:bg-white dark:hover:bg-green-800 transition-all duration-300 cursor-pointer transform hover:scale-105"
               onClick={() => router.push('/chatbot')}>
            <div className="text-5xl mb-6">💬</div>
            <h3 className="text-xl font-bold text-green-800 dark:text-green-100 mb-3">
              Assistente Agrícola
            </h3>
            <p className="text-green-600 dark:text-green-200 leading-relaxed">
              Chatbot inteligente com recomendações personalizadas
            </p>
          </div>

          <div className="bg-white/80 dark:bg-green-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-green-200 dark:border-green-700 text-center hover:shadow-2xl hover:bg-white dark:hover:bg-green-800 transition-all duration-300 cursor-pointer transform hover:scale-105"
               onClick={() => router.push('/mercado')}>
            <div className="text-5xl mb-6">💰</div>
            <h3 className="text-xl font-bold text-green-800 dark:text-green-100 mb-3">
              Mercado Agrícola
            </h3>
            <p className="text-green-600 dark:text-green-200 leading-relaxed">
              Preços em tempo real e tendências de mercado
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/80 dark:bg-green-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-green-200 dark:border-green-700 mb-16">
          <h3 className="text-3xl font-bold text-center text-green-800 dark:text-green-100 mb-12">
            Feito para Moçambique
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6 rounded-2xl bg-green-50/50 dark:bg-green-900/30 border border-green-200 dark:border-green-600">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">100%</div>
              <div className="text-green-700 dark:text-green-200 font-semibold text-lg">Gratuito</div>
            </div>
            <div className="p-6 rounded-2xl bg-green-50/50 dark:bg-green-900/30 border border-green-200 dark:border-green-600">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">🇲🇿</div>
              <div className="text-green-700 dark:text-green-200 font-semibold text-lg">Adaptado para Moçambique</div>
            </div>
            <div className="p-6 rounded-2xl bg-green-50/50 dark:bg-green-900/30 border border-green-200 dark:border-green-600">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">24/7</div>
              <div className="text-green-700 dark:text-green-200 font-semibold text-lg">Assistência Disponível</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-green-800/60 backdrop-blur-sm border-t border-green-200 dark:border-green-700">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-green-600 dark:text-green-300 font-medium">
            &copy; 2025 AgroAlerta. Sistema gratuito para agricultores de Moçambique.
          </p>
        </div>
      </footer>
    </div>
  );
}
