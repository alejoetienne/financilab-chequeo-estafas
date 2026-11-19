import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages project site: https://alejoetienne.github.io/financilab-chequeo-estafas/
const base = process.env.GITHUB_PAGES === 'true' ? '/financilab-chequeo-estafas/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
