import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-800 dark:text-green-100 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
          Página não encontrada
        </h2>
        <p className="text-green-600 dark:text-green-300 mb-8">
          A página que você está procurando não existe.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}
