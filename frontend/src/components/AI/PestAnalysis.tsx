// AI Pest Analysis Component
// Componente especializado para análise de pragas e doenças

'use client';

import { useState } from 'react';
import { Bug, Leaf, AlertTriangle, CheckCircle, Loader2, Camera, Upload } from 'lucide-react';
import { aiService, AIResponse } from '../../services/aiService';

interface PestAnalysisProps {
  onAnalysisComplete?: (analysis: string) => void;
  className?: string;
}

interface FormData {
  description: string;
  cropType: string;
  symptoms: string[];
  severity: 'low' | 'medium' | 'high';
}

const commonCrops = [
  'Milho', 'Arroz', 'Feijão', 'Tomate', 'Cebola', 'Repolho',
  'Batata', 'Mandioca', 'Banana', 'Coco', 'Caju', 'Manga',
  'Algodão', 'Tabaco', 'Cana-de-açúcar', 'Outro'
];

const commonSymptoms = [
  'Folhas amareladas',
  'Manchas nas folhas',
  'Folhas murchas',
  'Buracos nas folhas',
  'Presença de insetos',
  'Fungos/mofo',
  'Frutos danificados',
  'Raízes afetadas',
  'Crescimento retardado',
  'Descoloração',
  'Necrose',
  'Galhas/tumores'
];

export default function PestAnalysis({ onAnalysisComplete, className = '' }: PestAnalysisProps) {
  const [formData, setFormData] = useState<FormData>({
    description: '',
    cropType: '',
    symptoms: [],
    severity: 'medium'
  });

  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      setError('Descrição é obrigatória');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Usar método específico para análise de pragas
      const response: AIResponse = await aiService.analyzePestDisease(
        formData.description,
        formData.cropType || undefined,
        formData.symptoms.length > 0 ? formData.symptoms : undefined
      );

      if (response.success && response.content) {
        setAnalysis(response.content);
        if (onAnalysisComplete) {
          onAnalysisComplete(response.content);
        }
      } else {
        setError(response.error || 'Erro na análise');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      description: '',
      cropType: '',
      symptoms: [],
      severity: 'medium'
    });
    setAnalysis(null);
    setError(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border ${className}`}>
      {/* Header */}
      <div className="bg-orange-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bug className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Análise de Pragas e Doenças</h2>
          <Leaf className="w-5 h-5" />
        </div>
        <p className="text-orange-100 text-sm mt-1">
          Descreva os sintomas observados para obter um diagnóstico AI
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição dos Sintomas *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva detalhadamente os sintomas observados nas plantas..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Tipo de Cultura */}
          <div>
            <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Cultura
            </label>
            <select
              id="cropType"
              value={formData.cropType}
              onChange={(e) => handleInputChange('cropType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Selecione a cultura (opcional)</option>
              {commonCrops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          {/* Sintomas Comuns */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sintomas Observados
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonSymptoms.map(symptom => (
                <label
                  key={symptom}
                  className={`flex items-center p-2 rounded border cursor-pointer transition-colors ${
                    formData.symptoms.includes(symptom)
                      ? 'bg-orange-50 border-orange-300 text-orange-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.symptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                    className="mr-2 rounded text-orange-600"
                  />
                  <span className="text-sm">{symptom}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Severidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nível de Severidade
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'low', label: 'Baixa', icon: CheckCircle },
                { value: 'medium', label: 'Média', icon: AlertTriangle },
                { value: 'high', label: 'Alta', icon: AlertTriangle }
              ].map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.severity === value
                      ? getSeverityColor(value)
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="severity"
                    value={value}
                    checked={formData.severity === value}
                    onChange={(e) => handleInputChange('severity', e.target.value as any)}
                    className="sr-only"
                  />
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading || !aiService.isServiceAvailable()}
              className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analisando...</span>
                </>
              ) : (
                <>
                  <Bug className="w-4 h-4" />
                  <span>Analisar Sintomas</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={clearForm}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpar
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Erro:</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Analysis Result */}
        {analysis && (
          <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700 mb-3">
              <CheckCircle className="w-5 h-5" />
              <h3 className="font-semibold">Resultado da Análise</h3>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700">
              {analysis.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-2">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>
        )}

        {!aiService.isServiceAvailable() && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">
                Serviço AI não disponível. Verifique a configuração do Firebase.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}