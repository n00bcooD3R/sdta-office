/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neu: {
          bg: 'var(--neu-bg)',
          card: 'var(--neu-card)',
          text: 'var(--neu-text)',
          muted: 'var(--neu-muted)',
          accent: 'var(--neu-accent)',
          border: 'var(--neu-border)',
        }
      },
      boxShadow: {
        'neu-outset': 'var(--shadow-neu-outset)',
        'neu-inset': 'var(--shadow-neu-inset)',
        'neu-pressed': 'var(--shadow-neu-pressed)',
        'neu-sm': 'var(--shadow-neu-sm)',
        'neu-glow': '0 0 15px var(--neu-accent-glow)',
      },
      borderRadius: {
        'neu': '20px',
        'neu-lg': '28px',
        'neu-sm': '12px',
      }
    },
  },
  plugins: [],
};
