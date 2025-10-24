import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Para produção - build standalone
  output: 'standalone',
  // Configuração de imagens para APIs externas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        port: '',
        pathname: '/img/wn/**',
      },
    ],
  },
  // Corrige tracing de arquivos em monorepo (raiz em ../)
  outputFileTracingRoot: path.join(__dirname, '..'),
  // Configurações para resolver problemas de desenvolvimento
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Evitar problemas de build com Turbopack
  experimental: {
    turbo: undefined,
  },
};

export default nextConfig;
