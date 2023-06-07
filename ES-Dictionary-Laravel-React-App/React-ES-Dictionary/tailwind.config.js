// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: '#f5f2ea',
        coffeeMate: '#f7f5ee',
        coffeeMateB: '#dcd8cf',
        coffeeBrown: '#f09e63',
        coffeeDark: '#753b11',
      },
      transitionProperty: {
        'opacity': 'opacity', // Add 'opacity' to transition properties
      },
    },
  },
  variants: {
    extend: {
      opacity: ['responsive', 'hover', 'focus', 'group-hover'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

