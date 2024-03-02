/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      aspectRatio: {
        '3/4': '3 / 4',
      },
    },
  },
  plugins: [],
};
