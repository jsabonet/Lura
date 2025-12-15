'use client';
import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Verificar se já foi instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Verificar se já foi rejeitado recentemente
    const lastDismissed = localStorage.getItem('installPromptDismissed');
    if (lastDismissed) {
      const daysSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // Não mostrar novamente por 7 dias
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Mostrar prompt após 5 segundos
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA instalado com sucesso');
      }
      
      setShowPrompt(false);
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white p-4 rounded-xl shadow-2xl z-50 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
        aria-label="Fechar"
      >
        <X size={20} />
      </button>
      
      <div className="flex items-start gap-3 pr-6">
        <div className="bg-white/20 rounded-full p-2 shrink-0">
          <Download size={24} strokeWidth={2.5} />
        </div>
        
        <div className="flex-1">
          <p className="font-bold text-lg mb-1">Instalar LuraFarm</p>
          <p className="text-sm text-white/90 mb-3">
            Adicione à tela inicial para acesso rápido e use offline!
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-[#00A86B] px-4 py-2 rounded-lg font-bold text-sm hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Instalar Agora
            </button>
            <button
              onClick={handleDismiss}
              className="border-2 border-white/50 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              Mais Tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
