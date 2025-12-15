'use client';

import Link from 'next/link';
import { MessageCircle, Sprout, TrendingUp, Shield, Droplets, Calendar, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F2027] via-[#1B2735] to-[#203A43] text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:px-8 md:py-6 border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00A86B] to-[#3BB273] rounded-xl flex items-center justify-center shadow-lg">
            <Sprout size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-2xl">LuraFarm</span>
        </div>
        <Link 
          href="/dashboard" 
          className="bg-[#00A86B] hover:bg-[#00A86B]/90 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          Entrar
        </Link>
      </header>

      {/* Hero Section */}
      <section className="px-4 md:px-8 py-16 md:py-24 text-center max-w-6xl mx-auto">
        <div className="inline-block bg-[#00A86B]/20 border border-[#00A86B]/30 rounded-full px-4 py-2 mb-6">
          <span className="text-[#00A86B] font-semibold text-sm">🌱 Agricultura Inteligente para Moçambique</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Cultive com{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A86B] to-[#3BB273]">
            Inteligência
          </span>
        </h1>
        
        <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Aumente sua produtividade com assistência de IA, monitoramento climático em tempo real 
          e gestão inteligente de culturas. Tudo em um só lugar.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00A86B] to-[#3BB273] hover:from-[#00A86B]/90 hover:to-[#3BB273]/90 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-[#00A86B]/50 hover:scale-105"
          >
            <Zap size={22} strokeWidth={2.5} />
            Começar Gratuitamente
          </Link>
          <Link
            href="/sobre"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 hover:border-white/40"
          >
            Saiba Mais
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-8 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Recursos que Transformam sua Agricultura
          </h2>
          <p className="text-white/60 text-lg">
            Ferramentas poderosas desenvolvidas para o agricultor moderno
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-[#00A86B]/30 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00A86B]/20 to-[#3BB273]/20 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="text-[#00A86B]" size={28} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-xl mb-3">Assistente IA Lura</h3>
            <p className="text-white/70 leading-relaxed">
              Converse com a Lura por voz ou texto para obter recomendações personalizadas sobre suas culturas.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-[#00A86B]/30 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00A86B]/20 to-[#3BB273]/20 rounded-xl flex items-center justify-center mb-4">
              <Droplets className="text-[#00A86B]" size={28} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-xl mb-3">Monitoramento Climático</h3>
            <p className="text-white/70 leading-relaxed">
              Previsões precisas de 7 dias e alertas climáticos em tempo real para sua região.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-[#00A86B]/30 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00A86B]/20 to-[#3BB273]/20 rounded-xl flex items-center justify-center mb-4">
              <Sprout className="text-[#00A86B]" size={28} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-xl mb-3">Gestão de Culturas</h3>
            <p className="text-white/70 leading-relaxed">
              Acompanhe crescimento, saúde e necessidades das suas plantações em tempo real.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-[#00A86B]/30 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00A86B]/20 to-[#3BB273]/20 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="text-[#00A86B]" size={28} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-xl mb-3">Análise de Mercado</h3>
            <p className="text-white/70 leading-relaxed">
              Preços atualizados e tendências de mercado para maximizar seus lucros.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-[#00A86B]/30 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00A86B]/20 to-[#3BB273]/20 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="text-[#00A86B]" size={28} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-xl mb-3">Planejamento Inteligente</h3>
            <p className="text-white/70 leading-relaxed">
              Organize tarefas e atividades com sugestões baseadas em IA e clima.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-[#00A86B]/30 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00A86B]/20 to-[#3BB273]/20 rounded-xl flex items-center justify-center mb-4">
              <Shield className="text-[#00A86B]" size={28} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-xl mb-3">Proteção de Dados</h3>
            <p className="text-white/70 leading-relaxed">
              Seus dados agrícolas protegidos com criptografia e privacidade garantida.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 md:px-8 py-16 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-[#00A86B]/10 to-[#3BB273]/10 backdrop-blur-xl rounded-3xl p-12 border border-[#00A86B]/20">
          <h3 className="text-3xl font-bold text-center mb-12">
            Feito para Agricultores Moçambicanos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#00A86B] mb-2">100%</div>
              <div className="text-white/70 font-medium text-lg">Gratuito</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#00A86B] mb-2">🇲🇿</div>
              <div className="text-white/70 font-medium text-lg">Adaptado para Moçambique</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#00A86B] mb-2">24/7</div>
              <div className="text-white/70 font-medium text-lg">Assistência Disponível</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-16 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Pronto para Revolucionar sua Agricultura?
        </h2>
        <p className="text-white/70 text-lg mb-8">
          Junte-se a centenas de agricultores que já estão cultivando com inteligência
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00A86B] to-[#3BB273] hover:from-[#00A86B]/90 hover:to-[#3BB273]/90 px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-[#00A86B]/50 hover:scale-105"
        >
          <Zap size={24} strokeWidth={2.5} />
          Começar Agora - É Grátis
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl mt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 text-center">
          <p className="text-white/60 font-medium">
            &copy; 2025 LuraFarm. Sistema gratuito para agricultores de Moçambique.
          </p>
        </div>
      </footer>
    </div>
  );
}
