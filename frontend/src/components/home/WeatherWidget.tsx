'use client';
import { Cloud, Droplets, Wind, Sun, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';

export default function WeatherWidget() {
  const { weatherData, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#00A86B]/10 to-[#3BB273]/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl shadow-black/20">
        <div className="flex items-center justify-center h-40">
          <Loader2 size={32} className="text-[#00A86B] animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-xl rounded-2xl p-5 border border-red-500/20 shadow-xl shadow-black/20">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle size={24} />
          <div>
            <p className="font-semibold">Erro ao carregar clima</p>
            <p className="text-sm text-red-300/80">{error || 'Permita o acesso à localização'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#00A86B]/10 to-[#3BB273]/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl shadow-black/20 hover:shadow-2xl transition-all duration-500 hover:border-[#00A86B]/30">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={14} className="text-[#00A86B]" />
            <p className="text-white/70 text-xs font-medium">{weatherData.localizacao}</p>
          </div>
          <h2 className="text-white text-5xl font-bold tracking-tight">{weatherData.temperatura}°C</h2>
          <p className="text-white/60 text-sm mt-1.5 font-medium">{weatherData.condicao}</p>
        </div>
        <div className="bg-gradient-to-br from-[#00A86B]/30 to-[#3BB273]/30 backdrop-blur rounded-2xl p-4 shadow-lg">
          <Cloud size={36} className="text-white" strokeWidth={2} />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <div className="flex flex-col items-center text-center">
          <div className="bg-[#00A86B]/20 rounded-xl p-2 mb-2">
            <Droplets size={20} className="text-[#00A86B]" strokeWidth={2.5} />
          </div>
          <p className="text-white/40 text-xs mb-0.5">Umidade</p>
          <p className="text-white font-bold text-base">{weatherData.umidade}%</p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="bg-[#00A86B]/20 rounded-xl p-2 mb-2">
            <Wind size={20} className="text-[#00A86B]" strokeWidth={2.5} />
          </div>
          <p className="text-white/40 text-xs mb-0.5">Vento</p>
          <p className="text-white font-bold text-base">{weatherData.vento} km/h</p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="bg-[#F2C94C]/20 rounded-xl p-2 mb-2">
            <Sun size={20} className="text-[#F2C94C]" strokeWidth={2.5} />
          </div>
          <p className="text-white/40 text-xs mb-0.5">Chuva</p>
          <p className="text-white font-bold text-base">{weatherData.chuva_probabilidade}%</p>
        </div>
      </div>
    </div>
  );
}
