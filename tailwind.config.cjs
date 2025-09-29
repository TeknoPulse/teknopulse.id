/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Tech Blue Theme
        'primary': {
          DEFAULT: 'hsl(210, 95%, 50%)',      // #0EA5E9 - Main brand color
          50: 'hsl(210, 95%, 95%)',
          100: 'hsl(210, 95%, 90%)',
          200: 'hsl(210, 95%, 80%)',
          300: 'hsl(210, 95%, 70%)',
          400: 'hsl(210, 95%, 60%)',
          500: 'hsl(210, 95%, 50%)',
          600: 'hsl(210, 95%, 45%)',
          700: 'hsl(210, 95%, 40%)',
          800: 'hsl(210, 95%, 30%)',
          900: 'hsl(210, 95%, 20%)',
        },
        'primary-hover': 'hsl(210, 95%, 45%)', // Darker blue for interactions
        'primary-light': 'hsl(210, 95%, 95%)', // Very light blue backgrounds
        'secondary': {
          DEFAULT: 'hsl(195, 80%, 50%)',     // Cyan blue accent
          50: 'hsl(195, 80%, 95%)',
          100: 'hsl(195, 80%, 90%)',
          200: 'hsl(195, 80%, 80%)',
          300: 'hsl(195, 80%, 70%)',
          400: 'hsl(195, 80%, 60%)',
          500: 'hsl(195, 80%, 50%)',
          600: 'hsl(195, 80%, 45%)',
          700: 'hsl(195, 80%, 40%)',
          800: 'hsl(195, 80%, 30%)',
          900: 'hsl(195, 80%, 20%)',
        },
        'accent': {
          DEFAULT: 'hsl(270, 80%, 60%)',       // Purple accent
          50: 'hsl(270, 80%, 95%)',
          100: 'hsl(270, 80%, 90%)',
          200: 'hsl(270, 80%, 80%)',
          300: 'hsl(270, 80%, 70%)',
          400: 'hsl(270, 80%, 60%)',
          500: 'hsl(270, 80%, 50%)',
          600: 'hsl(270, 80%, 45%)',
          700: 'hsl(270, 80%, 40%)',
          800: 'hsl(270, 80%, 30%)',
          900: 'hsl(270, 80%, 20%)',
        },

        // Category Color System
        'category-ai': 'hsl(270, 80%, 60%)',      // Purple for AI articles
        'category-cloud': 'hsl(195, 80%, 50%)',   // Cyan for Cloud articles
        'category-security': 'hsl(0, 85%, 60%)', // Red for Security articles
        'category-devtools': 'hsl(140, 70%, 45%)', // Green for DevTools articles
        'category-policy': 'hsl(38, 90%, 55%)',  // Orange for Policy articles

        // Background Colors
        'background': 'hsl(210, 95%, 98%)',      // Light blue-tinted background
        'background-dark': 'hsl(210, 25%, 8%)',  // Dark blue-gray background
        'surface': '#ffffff',
        'surface-dark': 'hsl(210, 20%, 12%)',

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
