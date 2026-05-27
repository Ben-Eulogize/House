import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps asset paths relative so the built app can be served
// from a subfolder (e.g. GitHub Pages /House/app/) without rewrites.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: true, port: 5173 },
})
