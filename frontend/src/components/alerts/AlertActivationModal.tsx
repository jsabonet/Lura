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

      // Atualizar telefone do usuário se mudou
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ativar Alerta</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Receba alertas para a cultura <span className="font-semibold">{cultura}</span> na região <span className="font-semibold">{regiao}</span>.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">Canal de envio</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setChannel('sms')}
                className={`px-3 py-2 rounded-lg border ${channel === 'sms' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
              >
                📱 SMS
              </button>
              <button
                onClick={() => setChannel('whatsapp')}
                className={`px-3 py-2 rounded-lg border ${channel === 'whatsapp' ? 'bg-green-600 text-white border-green-600' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
              >
                💬 WhatsApp
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">Telefone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: +25884xxxxxxx"
              className="mt-1 w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Inclua o código do país (+258)</p>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          )}
          {success && (
            <div className="text-sm text-green-600 dark:text-green-400">{success}</div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Cancelar</button>
          <button
            disabled={!canSave || saving}
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Ativar Alerta'}
          </button>
        </div>
      </div>
    </div>
  );
}
