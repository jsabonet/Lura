'use client';
import { useState, useRef } from 'react';
import { X, Camera, MapPin, Upload } from 'lucide-react';

interface AdicionarFotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  projectId: string;
}

export default function AdicionarFotoModal({ isOpen, onClose, onSubmit, projectId }: AdicionarFotoModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [gpsCoords, setGpsCoords] = useState<string>('');
  const [capturingGPS, setCapturingGPS] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setError('Arquivo muito grande. Máximo 10MB.');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const captureGPS = async () => {
    setCapturingGPS(true);
    setError('');
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0
        });
      });
      
      const coords = `${position.coords.latitude},${position.coords.longitude}`;
      setGpsCoords(coords);
    } catch (err) {
      setError('Não foi possível obter localização GPS');
    } finally {
      setCapturingGPS(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Selecione uma foto');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('imagem', selectedFile);
      formData.append('project', projectId);
      if (gpsCoords) {
        formData.append('gps_coords', gpsCoords);
      }

      await onSubmit(formData);
      
      // Resetar formulário
      setPreview(null);
      setSelectedFile(null);
      setGpsCoords('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload da foto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1B2735] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Adicionar Foto</h2>
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

          {/* Preview da Foto */}
          {preview ? (
            <div className="relative aspect-video bg-white/5 rounded-xl overflow-hidden border border-white/10">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-2 right-2 bg-red-500/80 backdrop-blur rounded-lg p-2 hover:bg-red-500 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-white/5 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors border-2 border-dashed border-white/20"
            >
              <Upload size={48} className="text-white/30 mb-3" />
              <p className="text-white/60 text-sm">Clique para selecionar foto</p>
              <p className="text-white/40 text-xs mt-1">Máximo 10MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Botão de GPS */}
          <div>
            <button
              type="button"
              onClick={captureGPS}
              disabled={capturingGPS}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <MapPin size={18} className={capturingGPS ? 'animate-pulse' : ''} />
              {capturingGPS ? 'Obtendo localização...' : gpsCoords ? '✓ Localização capturada' : 'Capturar Localização GPS'}
            </button>
            {gpsCoords && (
              <p className="text-white/40 text-xs mt-2 text-center">
                📍 {gpsCoords}
              </p>
            )}
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
              disabled={loading || !selectedFile}
            >
              {loading ? 'Enviando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
