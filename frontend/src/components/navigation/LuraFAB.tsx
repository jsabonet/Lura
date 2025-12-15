'use client';
import Link from 'next/link';
import { Mic } from 'lucide-react';

export default function LuraFAB() {
  return (
    <Link href="/chatbot">
      <button 
        className="fixed bottom-20 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#00A86B] to-[#3BB273] rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-[#0F2027] hover:scale-110 transition-transform active:scale-95"
        aria-label="Conversar com Lura"
      >
        <Mic size={28} className="text-white" strokeWidth={2.5} />
      </button>
    </Link>
  );
}
