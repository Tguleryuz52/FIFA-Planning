/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // FIFA theme colors
        primary: '#0a0a0f',
        secondary: '#12121a',
        gold: '#FFD700',
        'gold-dark': '#CC9900',
      },
    },
  },
  plugins: [],
};
