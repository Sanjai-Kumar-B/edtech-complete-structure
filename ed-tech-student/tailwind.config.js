import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6C35DE',
        'primary-light': '#8B5CF6',
        'primary-dark': '#4F1FB5',
        'primary-container': '#EDE9FE',
        'on-primary': '#ffffff',
        'on-primary-container': '#4F1FB5',
        secondary: '#515f74',
        'on-secondary': '#ffffff',
        'secondary-container': '#d5e3fc',
        'on-secondary-container': '#57657a',
        surface: '#f7f9fb',
        'surface-container': '#eceef0',
        'surface-container-low': '#f2f4f6',
        'surface-container-high': '#e6e8ea',
        'surface-bright': '#f7f9fb',
        'on-surface': '#191c1e',
        'on-surface-variant': '#444653',
        'surface-variant': '#e0e3e5',
        'outline': '#757684',
        'outline-variant': '#c4c5d5',
        background: '#f7f9fb',
        'on-background': '#191c1e',
        'inverse-surface': '#2d3133',
        'inverse-on-surface': '#eff1f3',
        'inverse-primary': '#c4b5fd',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
    },
  },
  plugins: [forms, containerQueries],
}
