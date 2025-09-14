"use client";
import React, { useEffect, useState } from 'react';
import { alertsService, AlertChannel } from '@/services/alerts';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cultura: string;
  regiao: string;
  latitude?: number;
  longitude?: number;
  defaultChannel?: AlertChannel;
}

export default function AlertActivationModal({ isOpen, onClose, cultura, regiao, latitude, longitude, defaultChannel = 'sms' }: Props) {
  const { user, updateUser } = useAuth();
  const [channel, setChannel] = useState<AlertChannel>(defaultChannel);
  const [phone, setPhone] = useState<string>(user?.telefone || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setChannel(defaultChannel);
      setPhone(user?.telefone || '');
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, user, defaultChannel]);

  if (!isOpen) return null;

  const canSave = !!cultura && !!regiao && !!channel && !!phone;

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Actualizar telefone do utilizador se mudou
      if (user && phone && phone !== user.telefone) {
        await updateUser({ telefone: phone, receber_sms: true });
      }

      // Criar/atualizar assinatura
      await alertsService.createOrUpdate({
        cultura,
        regiao,
        latitude,
        longitude,
        canal: channel,
        ativo: true,
        metadados: { origem: 'weather-dashboard' },
      } as any);

      setSuccess('Alerta ativado com sucesso!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (e: any) {
      setError(e?.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4 sm:p-0">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header - Mobile Optimized */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              🔔 Ativar Alerta
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Receba notificações importantes para <span className="font-semibold text-blue-600 dark:text-blue-400">{cultura}</span> na região <span className="font-semibold text-green-600 dark:text-green-400">{regiao}</span>.
            </p>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="sm:hidden p-2 -mt-1 -mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {/* Canal de envio - Mobile Optimized */}
          <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              📡 Canal de Notificação
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setChannel('sms')}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  channel === 'sms' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📱</span>
                  <div>
                    <div className="font-medium">SMS</div>
                    <div className={`text-xs ${channel === 'sms' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      Mensagem de texto
                    </div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setChannel('whatsapp')}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  channel === 'whatsapp' 
                    ? 'bg-green-600 text-white border-green-600 shadow-lg' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-green-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">💬</span>
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className={`text-xs ${channel === 'whatsapp' ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      Mais recursos
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Telefone - Mobile Optimized */}
          <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              📞 Número de Telefone
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +258 84 123 4567"
                className="w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-xl border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <span className="text-lg">📱</span>
              </div>
            </div>
            <div className="mt-2 flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">ℹ️</span>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Inclua o código do país (+258 para Moçambique). O número será usado para enviar alertas importantes sobre suas culturas.
              </p>
            </div>
          </div>

          {/* Status Messages - Mobile Optimized */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">{error}</p>
              </div>
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✅</span>
                <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">{success}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Mobile Optimized */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!canSave || saving}
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-3 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Ativando...</span>
              </>
            ) : (
              <>
                <span>🔔</span>
                <span>Ativar Alerta</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
