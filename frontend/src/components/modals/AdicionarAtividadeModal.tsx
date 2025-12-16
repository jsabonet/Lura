'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

interface AdicionarAtividadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  projectId: string;
}

export default function AdicionarAtividadeModal({ isOpen, onClose, onSubmit, projectId }: AdicionarAtividadeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    project: projectId,
    tipo: 'inspecao',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
    custo: '0'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
      // Resetar formulário
      setFormData({
        project: projectId,
        tipo: 'inspecao',
        descricao: '',
        data: new Date().toISOString().split('T')[0],
        custo: '0'
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar atividade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1B2735] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Nova Atividade</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Tipo de Atividade */}
          <div>
            <label className="block text-white/70 text-sm mb-2">Tipo de Atividade</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00A86B]"
              required
            >
              <option value="plantio">🌱 Plantio</option>
              <option value="adubo">🧪 Adubação</option>
              <option value="defensivo">🛡️ Aplicação Defensivo</option>
              <option value="capina">🌿 Capina</option>
              <option value="irrigacao">💧 Irrigação</option>
              <option value="inspecao">🔍 Inspeção</option>
              <option value="colheita">🌾 Colheita</option>
              <option value="outro">📝 Outro</option>
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-white/70 text-sm mb-2">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00A86B] resize-none"
              rows={4}
              placeholder="Descreva a atividade realizada..."
              required
            />
          </div>

          {/* Data */}
          <div>
            <label className="block text-white/70 text-sm mb-2">Data</label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00A86B]"
              required
            />
          </div>

          {/* Custo */}
          <div>
            <label className="block text-white/70 text-sm mb-2">Custo (MT)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.custo}
              onChange={(e) => setFormData({ ...formData, custo: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00A86B]"
              placeholder="0.00"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 text-white rounded-lg py-3 font-medium hover:bg-white/20 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-lg py-3 font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
