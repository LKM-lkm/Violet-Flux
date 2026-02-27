import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app/**/*.{vue,js,ts}',
    './content/**/*.md',
    './components/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#b497d7',
          50: '#faf8fc',
          100: '#f3eef8',
          200: '#ebe4f2',
          300: '#d4c0ed',
          400: '#c2a9e4',
          500: '#b497d7',
          600: '#a682cf',
          700: '#9163c0',
          800: '#7743a3',
          900: '#4c2c4f',
          950: '#2d1b3d',
        },
      },
    },
  },
}
