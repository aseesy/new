/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#FF8D3C',
        secondary: '#13AEB9',
        dark90: '#262D37',
        medium50: '#737B87',
        gold: '#FFA553',
        tan: '#FFEBC4',
        magenta: '#F35065',
        success: '#9BCD9B',
        light20: '#B5B9BE',
        light50: '#F1F2F3',
        brown: '#AF7A76',
        blue: '#2189AE',
        paleGreen: '#C3CDAA',
        maroon: '#7A393D',
        navy: '#3B3656',
        light: '#FFFFFF',
        dark: '#000000',
        teal: '#48B1BA',
    }
    },
  },
  plugins: [],
}