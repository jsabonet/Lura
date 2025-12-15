import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { IntegratedLocationWeatherProvider } from "@/contexts/IntegratedLocationWeatherContext";
import InstallPrompt from "@/components/InstallPrompt";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import ConditionalNavigation from "@/components/navigation/ConditionalNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LuraFarm - Assistente Agrícola Inteligente",
  description: "Seu parceiro digital para agricultura de precisão. Previsões climáticas, detecção de pragas por IA, recomendações personalizadas e informações de mercado.",
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  themeColor: '#00A86B',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LuraFarm',
  },
  other: {
    'mobile-web-app-capable': 'yes',
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
        <ServiceWorkerRegistration />
        <AuthProvider>
          <IntegratedLocationWeatherProvider autoInitialize={true}>
            {children}
            <ConditionalNavigation />
            <InstallPrompt />
          </IntegratedLocationWeatherProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
