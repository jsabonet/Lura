'use client';

import { usePathname } from 'next/navigation';
import BottomNav from '@/components/navigation/BottomNav';
import LuraFAB from '@/components/navigation/LuraFAB';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Não exibir navegação na landing page (/)
  const showNavigation = pathname !== '/';

  if (!showNavigation) {
    return null;
  }

  return (
    <>
      <BottomNav />
      <LuraFAB />
    </>
  );
}
