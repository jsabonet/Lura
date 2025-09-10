'use client';

import { useEffect, useState } from 'react';
import { alertsService, AlertSubscription } from '@/services/alerts';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AlertasPage() {
  const { isAuthenticated, loading } = useAuth();
  const [subs, setSubs] = useState<AlertSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCultura, setNewCultura] = useState('');
  const [newRegiao, setNewRegiao] = useState('');
  const [newCanal, setNewCanal] = useState<'sms' | 'whatsapp'>('sms');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      setIsLoading(true);
      const data = await alertsService.list();
      setSubs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar');
      setSubs([]); // Ensure subs is always an array
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      load();
    }
  }, [isAuthenticated, loading]);

  const toggleActive = async (sub: AlertSubscription) => {
    const updated = await alertsService.update(sub.id, { ativo: !sub.ativo });
    setSubs(prev => prev.map(s => (s.id === sub.id ? updated : s)));
  };

  const remove = async (sub: AlertSubscription) => {
    await alertsService.remove(sub.id);
    setSubs(prev => prev.filter(s => s.id !== sub.id));
  };

  const create = async () => {
    try {
      setCreating(true);
      const created = await alertsService.createOrUpdate({
        cultura: newCultura.trim(),
        regiao: newRegiao.trim(),
        canal: newCanal,
        ativo: true,
      } as any);
      setSubs(prev => [created, ...prev]);
      setNewCultura('');
      setNewRegiao('');
      setNewCanal('sms');
    } catch (e: any) {
      setError(e?.message || 'Erro ao criar');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return null;
  if (!isAuthenticated) return <div className="p-8">Faça login para ver seus alertas.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-blue-900 dark:to-emerald-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🔔 Meus Alertas</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Gerencie assinaturas de alertas por cultura e região</p>
            </div>
            <div className="flex gap-3">
              <Link href="/clima" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Voltar ao Clima</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assinaturas</h3>
            <button onClick={load} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">Atualizar</button>
          </div>

          {/* Create form */}
          <div className="mb-6 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Adicionar novo alerta</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                value={newCultura}
                onChange={(e) => setNewCultura(e.target.value)}
                placeholder="Cultura (ex: milho)"
                className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
              <input
                value={newRegiao}
                onChange={(e) => setNewRegiao(e.target.value)}
                placeholder="Região (ex: Maputo)"
                className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
              <select
                value={newCanal}
                onChange={(e) => setNewCanal(e.target.value as any)}
                className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              >
                <option value="sms">📱 SMS</option>
                <option value="whatsapp">💬 WhatsApp</option>
              </select>
              <button
                disabled={!newCultura || !newRegiao || creating}
                onClick={create}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white disabled:opacity-50"
              >
                {creating ? 'Adicionando...' : 'Adicionar'}
              </button>
            </div>
          </div>

          {isLoading ? (
            <div>Carregando...</div>
          ) : error ? (
            <div className="text-red-600 dark:text-red-400">{error}</div>
          ) : subs.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-300">Nenhum alerta configurado ainda. Ative um pela página de clima.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subs.map((s) => (
                <div key={s.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Cultura</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{s.cultura}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${s.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{s.ativo ? 'Ativo' : 'Inativo'}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">📍 {s.regiao}</div>
                  <div className="mt-2 text-sm">Canal: {s.canal === 'sms' ? '📱 SMS' : '💬 WhatsApp'}</div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => toggleActive(s)} className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm">
                      {s.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                    <button onClick={() => remove(s)} className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm">Remover</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
