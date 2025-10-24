import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { IntegratedLocationWeatherProvider } from "@/contexts/IntegratedLocationWeatherContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LuraFarm - Sistema Inteligente de Alerta Agrícola",
  description: "Sistema gratuito de alerta agrícola para Moçambique. Previsões climáticas, detecção de pragas por IA, recomendações personalizadas e informações de mercado.",
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <IntegratedLocationWeatherProvider autoInitialize={true}>
            {children}
          </IntegratedLocationWeatherProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
