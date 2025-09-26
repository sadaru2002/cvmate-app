/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Ensure all relevant paths are included
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom colors here if needed, or let Tailwind generate them
      },
    },
  },
  // Add this to configure the color format
  experimental: {
    colorFunctions: {
      format: 'rgb', // Force Tailwind to output colors in rgb format
    },
  },
  plugins: [],
};

export default config;