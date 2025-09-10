// AgroAlerta Color Palette - Professional Green Theme
export const colors = {
  // Primary green colors (matching homepage)
  primary: {
    50: '#f0fdf4',   // Very light green
    100: '#dcfce7',  // Light green
    200: '#bbf7d0',  // Lighter green
    300: '#86efac',  // Light green
    400: '#4ade80',  // Medium green
    500: '#22c55e',  // Primary green
    600: '#16a34a',  // Darker green
    700: '#15803d',  // Dark green
    800: '#166534',  // Very dark green
    900: '#14532d',  // Darkest green
    950: '#052e16',  // Almost black green
  },
  
  // Emerald accent colors
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },
  
  // Background gradients
  gradients: {
    light: 'from-green-50 to-emerald-100',
    dark: 'from-green-900 to-emerald-800',
    primary: 'from-green-600 to-emerald-600',
    primaryHover: 'from-green-700 to-emerald-700',
    modalOverlay: 'from-green-400/25 to-emerald-500/35',
  },
  
  // State colors
  success: '#22c55e',  // Green 500
  warning: '#f59e0b',  // Amber 500
  error: '#ef4444',    // Red 500
  info: '#3b82f6',     // Blue 500
};

// CSS custom properties for runtime theme switching
export const cssVariables = `
  :root {
    --color-primary-50: 240 253 244;
    --color-primary-100: 220 252 231;
    --color-primary-200: 187 247 208;
    --color-primary-300: 134 239 172;
    --color-primary-400: 74 222 128;
    --color-primary-500: 34 197 94;
    --color-primary-600: 22 163 74;
    --color-primary-700: 21 128 61;
    --color-primary-800: 22 101 52;
    --color-primary-900: 20 83 45;
    --color-primary-950: 5 46 22;
  }
`;
