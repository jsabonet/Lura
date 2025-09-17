'use client';

import { PropsWithChildren } from 'react';

export default function ChatbotLayout({ children }: PropsWithChildren) {
  return (
    <main className="min-h-screen bg-gray-50">
      {children}
    </main>
  );
}