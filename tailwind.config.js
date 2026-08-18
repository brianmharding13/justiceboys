/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,html}'],
  theme: {
    extend: {
      colors: {
        ink: '#050506',
        panel: '#0c0c0f',
        edge: '#1e1e24',
        steel: '#9a9aa2', // mid accent — replaces the old red
        bone: '#e8e6e1',
        ash: '#6f6d72',
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      animation: {
        flicker: 'flicker 6s linear infinite',
        scan: 'scan 8s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 96%, 100%': { opacity: '1' },
          '97%': { opacity: '0.72' },
          '98%': { opacity: '1' },
          '99%': { opacity: '0.85' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};
