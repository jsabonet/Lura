'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.log('🔒 Acesso negado - redirecionando para login');
      router.push('/login');
      return;
    }

    console.log('✅ Usuário autenticado');
    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F2027] to-[#1B2735] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-[#00A86B] animate-spin mx-auto mb-4" />
          <p className="text-white/70">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
