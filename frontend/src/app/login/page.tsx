'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, redirect to dashboard
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🌾</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            AgroAlerta
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sistema de Monitoramento Agrícola
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Demo Note */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
            <strong>Demo:</strong> Use qualquer email e senha para acessar
          </p>
        </div>

        {/* Quick Access */}
        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
          >
            Ir direto para o Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
