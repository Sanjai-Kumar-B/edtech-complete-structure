import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "#F8F9FD",
        "surface": "#FFFFFF",
        "primary": "#6C5CE7",
        "primary-container": "#F0EFFF",
        "secondary": "#7D7D7D",
        "on-surface": "#1D1D1D",
        "on-surface-variant": "#4A4A4A",
        "outline-variant": "#E0E0E0",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F1F2F6",
        "surface-container": "#EAECEF",
        "error": "#FF4757",
        "success": "#2ED573",
        "warning": "#FFA502",
        "info": "#1E90FF",
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
    },
  },
  plugins: [forms, containerQueries],
}
