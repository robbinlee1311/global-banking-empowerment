import type { Config } from 'tailwindcss';
const config: Config = {content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],theme: {extend: {colors: {primary: '#0066cc', secondary: '#1a5490'}}},plugins: []};
export default config;