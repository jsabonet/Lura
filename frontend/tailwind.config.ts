import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Usar classe para dark mode (evita mudanças automáticas no mobile)
  darkMode: 'class',
  theme: {
    extend: {
      // Gradientes e cores customizadas
      colors: {
        'agricultura': {
          50: '#f0fdf4',
          100: '#dcfce7', 
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      // Animações suaves para modais
      animation: {
        'modal-fade-in': 'modal-fade-in 0.3s ease-out',
        'modal-slide-in': 'modal-slide-in 0.3s ease-out',
      },
      keyframes: {
        'modal-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'modal-slide-in': {
          '0%': { 
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)'
          },
        },
      },
      // Fontes
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
