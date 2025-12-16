'use client';
import { DollarSign, TrendingUp, Package, ShoppingBag, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function NegociosPageContent() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F2027] via-[#1B2735] to-[#203A43] pb-24">
      {/* Header Premium */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#F2C94C]/20 via-transparent to-[#00A86B]/10 px-4 pt-8 pb-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Negócios</h1>
            <p className="text-white/60 text-sm">Marketplace e finanças</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
            <ShoppingBag size={28} className="text-[#F2C94C]" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
      {/* Resumo Financeiro */}
      <div className="bg-gradient-to-br from-[#00A86B]/10 to-[#3BB273]/10 backdrop-blur-xl rounded-2xl p-6 border border-[#00A86B]/20 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#00A86B] to-[#3BB273] rounded-xl p-3 shadow-lg">
              <DollarSign size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-white/60 text-xs font-medium uppercase tracking-wider">Saldo Estimado</h3>
              <div className="text-4xl font-bold text-white mt-1">15.450 MT</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
          <div className="bg-[#00A86B]/20 rounded-lg p-2">
            <TrendingUp size={18} className="text-[#00A86B]" strokeWidth={2.5} />
          </div>
          <p className="text-[#00A86B] text-sm font-bold">+12% este mês</p>
          <span className="text-white/40 text-xs ml-auto">vs. mês anterior</span>
        </div>
      </div>
      
      {/* Seção de Marketplace */}
      <div>
        <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
          <Package size={20} className="text-[#F2C94C]" />
          Marketplace
        </h2>
        <button className="w-full bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-xl p-4 font-bold mb-4 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
          <ArrowUpRight size={20} strokeWidth={2.5} />
          Anunciar Colheita
        </button>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10">
          <div className="bg-gradient-to-br from-[#F2C94C]/20 to-[#F2C94C]/10 rounded-2xl p-4 w-fit mx-auto mb-4">
            <Package size={40} className="text-[#F2C94C]" strokeWidth={2} />
          </div>
          <h3 className="text-white font-bold mb-2">Nenhum anúncio ativo</h3>
          <p className="text-white/50 text-sm">
            Anuncie sua colheita para receber<br />ofertas de compradores!
          </p>
        </div>
      </div>
      
      {/* Seção de Finanças */}
      <div>
        <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
          <Calendar size={20} className="text-[#00A86B]" />
          Transações Recentes
        </h2>
        <div className="space-y-3">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 flex justify-between items-center border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-red-400/20 rounded-lg p-2">
                <ArrowDownRight size={20} className="text-red-400" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Sementes de Milho</p>
                <p className="text-white/50 text-xs flex items-center gap-1">
                  <Calendar size={12} />
                  03 Dez 2025
                </p>
              </div>
            </div>
            <span className="text-red-400 font-bold text-lg">-1.200 MT</span>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 flex justify-between items-center border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-[#00A86B]/20 rounded-lg p-2">
                <ArrowUpRight size={20} className="text-[#00A86B]" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Venda Tomate</p>
                <p className="text-white/50 text-xs flex items-center gap-1">
                  <Calendar size={12} />
                  01 Dez 2025
                </p>
              </div>
            </div>
            <span className="text-[#00A86B] font-bold text-lg">+8.500 MT</span>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 flex justify-between items-center border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-red-400/20 rounded-lg p-2">
                <ArrowDownRight size={20} className="text-red-400" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Adubo Orgânico</p>
                <p className="text-white/50 text-xs flex items-center gap-1">
                  <Calendar size={12} />
                  28 Nov 2025
                </p>
              </div>
            </div>
            <span className="text-red-400 font-bold text-lg">-850 MT</span>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}

export default function NegociosPage() {
  return (
    <ProtectedRoute>
      <NegociosPageContent />
    </ProtectedRoute>
  );
}
