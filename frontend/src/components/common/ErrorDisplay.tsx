'use client';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorDisplay({ 
  error, 
  onRetry, 
  title = 'Ops! Algo deu errado' 
}: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
      <div className="text-4xl mb-4">😕</div>
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
        {title}
      </h3>
      <p className="text-red-600 dark:text-red-300 mb-4 text-sm">
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
}

export function ErrorPage({ 
  error, 
  onRetry, 
  title = 'Erro no Carregamento' 
}: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <ErrorDisplay error={error} onRetry={onRetry} title={title} />
      </div>
    </div>
  );
}
