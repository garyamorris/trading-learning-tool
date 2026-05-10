/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fbf6ec',
        paper: '#f3ecd9',
        ink: '#2b2a26',
        coral: '#e8694e',
        teal: '#3d8b8b',
        mustard: '#e3a93a',
        lavender: '#9a8cc7',
        sage: '#8caf6f',
        rose: '#c14b6b',
      },
      fontFamily: {
        hand: ['"Patrick Hand"', 'cursive'],
        body: ['"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
        display: ['"Caveat Brush"', 'cursive'],
      },
      boxShadow: {
        sketch: '3px 3px 0 0 #2b2a26',
        sketchSm: '2px 2px 0 0 #2b2a26',
        sketchLg: '5px 5px 0 0 #2b2a26',
      },
      keyframes: {
        wobble: {
          '0%,100%': { transform: 'translate(0,0) rotate(0deg)' },
          '25%': { transform: 'translate(0.5px,-0.5px) rotate(0.3deg)' },
          '50%': { transform: 'translate(-0.5px,0.5px) rotate(-0.3deg)' },
          '75%': { transform: 'translate(0.3px,0.3px) rotate(0.2deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        wobble: 'wobble 3s ease-in-out infinite',
        pop: 'pop 0.35s ease-out',
      },
    },
  },
  plugins: [],
}
