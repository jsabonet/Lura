'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'white';
}

export default function LoadingSpinner({ size = 'md', color = 'green' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    green: 'border-green-600 border-t-transparent',
    white: 'border-white border-t-transparent'
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} border-2 ${colorClasses[color]} rounded-full animate-spin`} />
  );
}

export function LoadingPage({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-green-800 dark:text-green-100 text-lg">{message}</p>
      </div>
    </div>
  );
}

export function LoadingCard({ message = 'Carregando dados...' }: { message?: string }) {
  return (
    <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-8 text-center">
      <LoadingSpinner size="md" />
      <p className="mt-4 text-green-600 dark:text-green-200">{message}</p>
    </div>
  );
}
