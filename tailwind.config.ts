import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- BASE COLORS ---
        'base-dark': '#0a0a0a', // Near black for deep contrast
        'panel-dark': '#1f2937', // A dark gray for cards/panels (bg-gray-800)
        
        // --- PRIMARY/CTA COLOR ---
        // Used for buttons, primary links, and focus rings (Indigo/Violet focus)
        primary: {
          '500': '#6366f1', // Indigo-500 equivalent for standard link/focus
          '600': '#4f46e5', // Indigo-600 for main buttons
          '700': '#4338ca', // Indigo-700 for button hover state
        },
        
        // --- ACCENT/HIGHLIGHT COLOR ---
        // Used for small icons, highlighted words, and visual breaks (Fuchsia/Magenta)
        accent: '#ec4899', // Fuchsia-500 equivalent
      },
    },
  },
  plugins: [],
}
export default config