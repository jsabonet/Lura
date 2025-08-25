'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface AppHeaderProps {
  currentPage?: string;
}

export default function AppHeader({ currentPage }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
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
            <Link 
              href="/dashboard" 
              className={`hover:text-green-900 dark:hover:text-white ${
                currentPage === 'dashboard' 
                  ? 'text-green-900 dark:text-white font-medium' 
                  : 'text-green-700 dark:text-green-200'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/clima" 
              className={`hover:text-green-900 dark:hover:text-white ${
                currentPage === 'clima' 
                  ? 'text-green-900 dark:text-white font-medium' 
                  : 'text-green-700 dark:text-green-200'
              }`}
            >
              Clima
            </Link>
            <Link 
              href="/pragas" 
              className={`hover:text-green-900 dark:hover:text-white ${
                currentPage === 'pragas' 
                  ? 'text-green-900 dark:text-white font-medium' 
                  : 'text-green-700 dark:text-green-200'
              }`}
            >
              Pragas
            </Link>
            <Link 
              href="/mercado" 
              className={`hover:text-green-900 dark:hover:text-white ${
                currentPage === 'mercado' 
                  ? 'text-green-900 dark:text-white font-medium' 
                  : 'text-green-700 dark:text-green-200'
              }`}
            >
              Mercado
            </Link>
            <Link 
              href="/chatbot" 
              className={`hover:text-green-900 dark:hover:text-white ${
                currentPage === 'chatbot' 
                  ? 'text-green-900 dark:text-white font-medium' 
                  : 'text-green-700 dark:text-green-200'
              }`}
            >
              Assistente
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <span className="text-green-700 dark:text-green-200 hidden sm:block">
              {user?.first_name || user?.username}
            </span>
            <Link
              href="/perfil"
              className="text-green-700 hover:text-green-900 dark:text-green-200 dark:hover:text-white"
            >
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="text-green-700 hover:text-green-900 dark:text-green-200 dark:hover:text-white"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
