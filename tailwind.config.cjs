/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Tech Blue Theme
        'primary': {
          DEFAULT: 'hsl(24, 90%, 55%)',       // Warm orange - Main brand color
          50: 'hsl(24, 90%, 95%)',
          100: 'hsl(24, 90%, 90%)',
          200: 'hsl(24, 90%, 80%)',
          300: 'hsl(24, 90%, 70%)',
          400: 'hsl(24, 90%, 60%)',
          500: 'hsl(24, 90%, 55%)',
          600: 'hsl(24, 90%, 50%)',
          700: 'hsl(24, 90%, 45%)',
          800: 'hsl(24, 90%, 35%)',
          900: 'hsl(24, 90%, 25%)',
        },
        'primary-hover': 'hsl(24, 90%, 45%)', // Darker orange for interactions
        'primary-light': 'hsl(24, 90%, 95%)', // Light orange backgrounds
        'secondary': {
          DEFAULT: 'hsl(38, 85%, 50%)',      // Warm amber accent
          50: 'hsl(38, 85%, 95%)',
          100: 'hsl(38, 85%, 90%)',
          200: 'hsl(38, 85%, 80%)',
          300: 'hsl(38, 85%, 70%)',
          400: 'hsl(38, 85%, 60%)',
          500: 'hsl(38, 85%, 50%)',
          600: 'hsl(38, 85%, 45%)',
          700: 'hsl(38, 85%, 40%)',
          800: 'hsl(38, 85%, 30%)',
          900: 'hsl(38, 85%, 20%)',
        },
        'accent': {
          DEFAULT: 'hsl(12, 75%, 55%)',       // Terracotta accent
          50: 'hsl(12, 75%, 95%)',
          100: 'hsl(12, 75%, 90%)',
          200: 'hsl(12, 75%, 80%)',
          300: 'hsl(12, 75%, 70%)',
          400: 'hsl(12, 75%, 60%)',
          500: 'hsl(12, 75%, 55%)',
          600: 'hsl(12, 75%, 45%)',
          700: 'hsl(12, 75%, 40%)',
          800: 'hsl(12, 75%, 30%)',
          900: 'hsl(12, 75%, 20%)',
        },

        // Category Color System
        'category-ai': 'hsl(270, 80%, 60%)',      // Purple for AI articles
        'category-cloud': 'hsl(195, 80%, 50%)',   // Cyan for Cloud articles
        'category-security': 'hsl(0, 85%, 60%)', // Red for Security articles
        'category-devtools': 'hsl(140, 70%, 45%)', // Green for DevTools articles
        'category-policy': 'hsl(38, 90%, 55%)',  // Orange for Policy articles

        // Background Colors
        'background': 'hsl(30, 20%, 97%)',       // Warm off-white background
        'background-dark': 'hsl(25, 15%, 10%)',  // Deep warm gray background
        'surface': '#ffffff',
        'surface-dark': 'hsl(25, 12%, 14%)',    // Warm charcoal surface

        // Text Colors
        'text-primary': 'hsl(210, 15%, 20%)',
        'text-secondary': 'hsl(210, 10%, 40%)',
        'text-muted': 'hsl(210, 10%, 60%)',

        // Legacy colors for backward compatibility
        'gray': {
          50: 'hsl(210, 20%, 98%)',
          100: 'hsl(210, 15%, 95%)',
          200: 'hsl(210, 10%, 85%)',
          300: 'hsl(210, 10%, 75%)',
          400: 'hsl(210, 10%, 65%)',
          500: 'hsl(210, 10%, 50%)',
          600: 'hsl(210, 15%, 35%)',
          700: 'hsl(210, 15%, 25%)',
          800: 'hsl(210, 20%, 15%)',
          900: 'hsl(210, 25%, 10%)',
        },
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'primary': ['Inter', 'sans-serif'],
      },
      fontWeight: {
        'normal': 400,
        'medium': 500,
        'semibold': 600,
        'bold': 700,
      },
      borderRadius: {
        'sm': '0.5rem',
        'DEFAULT': '0.75rem',
        'md': '1rem',
        'lg': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 20px hsl(210, 95%, 50%)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, hsl(210, 95%, 50%), hsl(195, 80%, 50%))',
        'gradient-hero': 'linear-gradient(135deg, hsl(210, 95%, 50%)/10%, transparent)',
        'gradient-accent': 'linear-gradient(135deg, hsl(270, 80%, 60%), hsl(210, 95%, 50%))',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
};
