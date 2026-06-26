/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          'cyber-green': '#00ff88',
          'cyber-dark': '#0a0a0a',
          'cyber-gray': '#1a1a1a',
          'cyber-border': '#333333',
        },
        fontFamily: {
          'cyber': ['Orbitron', 'monospace'],
        },
        animation: {
          'glow': 'glow 2s ease-in-out infinite alternate',
          'float': 'float 3s ease-in-out infinite',
          'matrix': 'matrix 20s linear infinite',
        },
        keyframes: {
          glow: {
            '0%': { boxShadow: '0 0 20px #00ff88' },
            '100%': { boxShadow: '0 0 30px #00ff88, 0 0 40px #00ff88' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          matrix: {
            '0%': { transform: 'translateY(-100%)' },
            '100%': { transform: 'translateY(100vh)' },
          },
        },
      },
    },
    plugins: [],
  }