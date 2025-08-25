import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
