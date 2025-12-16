'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

interface AdicionarCustoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  projectId: string;
}

export default function AdicionarCustoModal({ isOpen, onClose, onSubmit, projectId }: AdicionarCustoModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    project: projectId,
    categoria: 'insumo',
    descricao: '',
    valor_orcado: '',
    valor_real: '',
    data: new Date().toISOString().split('T')[0]
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
        categoria: 'insumo',
        descricao: '',
        valor_orcado: '',
        valor_real: '',
        data: new Date().toISOString().split('T')[0]
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar custo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1B2735] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Novo Custo</h2>
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

          {/* Categoria */}
          <div>
            <label className="block text-white/70 text-sm mb-2">Categoria</label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00A86B]"
              required
            >
              <option value="insumo">🧪 Insumos (Sementes, Adubo, etc)</option>
              <option value="mao_obra">👷 Mão de Obra</option>
              <option value="maquina">🚜 Maquinário</option>
              <option value="transporte">🚚 Transporte</option>
              <option value="outro">📦 Outro</option>
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-white/70 text-sm mb-2">Descrição</label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00A86B]"
              placeholder="Ex: Compra de sementes de milho"
              required
            />
          </div>

          {/* Valor Orçado */}
          <div>
            <label className="block text-white/70 text-sm mb-2">Valor Orçado (MT)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.valor_orcado}
              onChange={(e) => setFormData({ ...formData, valor_orcado: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00A86B]"
              placeholder="0.00"
              required
            />
          </div>

          {/* Valor Real */}
          <div>
            <label className="block text-white/70 text-sm mb-2">Valor Real Gasto (MT)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.valor_real}
              onChange={(e) => setFormData({ ...formData, valor_real: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00A86B]"
              placeholder="0.00"
              required
            />
            <p className="text-white/40 text-xs mt-1">
              Quanto você realmente gastou? Pode ser diferente do orçado.
            </p>
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

          {/* Preview da Variação */}
          {formData.valor_orcado && formData.valor_real && (
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Variação:</span>
                <span className={`font-bold ${parseFloat(formData.valor_real) > parseFloat(formData.valor_orcado) ? 'text-red-400' : 'text-[#00A86B]'}`}>
                  {parseFloat(formData.valor_real) > parseFloat(formData.valor_orcado) 
                    ? `+${((parseFloat(formData.valor_real) - parseFloat(formData.valor_orcado)) / parseFloat(formData.valor_orcado) * 100).toFixed(1)}%`
                    : `${((parseFloat(formData.valor_real) - parseFloat(formData.valor_orcado)) / parseFloat(formData.valor_orcado) * 100).toFixed(1)}%`
                  }
                </span>
              </div>
            </div>
          )}

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
