'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function MercadoPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 flex items-center justify-center">
        <div className="text-green-800 dark:text-green-100">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800">
      {/* Header */}
      <header className="bg-white dark:bg-green-800 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="text-2xl">🌾</div>
              <h1 className="text-2xl font-bold text-green-800 dark:text-green-100">
                AgroAlerta
              </h1>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white">
                Dashboard
              </Link>
              <Link href="/clima" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white">
                Clima
              </Link>
              <Link href="/pragas" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white">
                Pragas
              </Link>
              <Link href="/mercado" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white font-medium">
                Mercado
              </Link>
            </nav>

            <Link
              href="/dashboard"
              className="text-green-700 hover:text-green-900 dark:text-green-200 dark:hover:text-white"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-green-800 dark:text-green-100 mb-2">
            💰 Mercado Agrícola
          </h2>
          <p className="text-green-600 dark:text-green-200">
            Preços atualizados e tendências de mercado para produtos agrícolas
          </p>
        </div>

        {/* Em construção */}
        <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-2xl font-bold text-green-800 dark:text-green-100 mb-4">
            Em Construção
          </h3>
          <p className="text-green-600 dark:text-green-200 mb-6">
            Estamos trabalhando para trazer informações de mercado em tempo real para você.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-4 bg-green-50 dark:bg-green-700 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold text-green-800 dark:text-green-100">
                Preços em Tempo Real
              </h4>
              <p className="text-sm text-green-600 dark:text-green-200">
                Acompanhe os preços dos seus produtos
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-700 rounded-lg">
              <div className="text-2xl mb-2">📈</div>
              <h4 className="font-semibold text-green-800 dark:text-green-100">
                Tendências
              </h4>
              <p className="text-sm text-green-600 dark:text-green-200">
                Análise de tendências de mercado
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-700 rounded-lg">
              <div className="text-2xl mb-2">🔔</div>
              <h4 className="font-semibold text-green-800 dark:text-green-100">
                Alertas de Preço
              </h4>
              <p className="text-sm text-green-600 dark:text-green-200">
                Receba notificações de mudanças
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
