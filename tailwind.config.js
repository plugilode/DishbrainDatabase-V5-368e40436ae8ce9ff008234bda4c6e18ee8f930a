module.exports = {
  darkMode: 'class', // Enables dark mode based on the 'class' strategy
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // Ensure Tailwind scans your pages
    './components/**/*.{js,ts,jsx,tsx}', // Ensure Tailwind scans your components
    './src/**/*.{js,ts,jsx,tsx}', // If you are using a `src` directory
    './public/index.html', // If you're using public/index.html for static content
  ],
  theme: {
    extend: {}, // Customize the theme if needed
  },
  plugins: [], // Add any Tailwind plugins you need here
};
