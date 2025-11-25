import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'          // or '@vitejs/plugin-react-swc' (see note)
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),            // ensure this package is installed, or switch to plugin-react-swc
    tailwindcss(),
  ],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,         // allow external access (0.0.0.0)
    port: 5173,         // optional: set dev server port
    proxy: {
      '/api': {
        target: 'http://72.61.227.66:5000', // no trailing slash
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // optional: strip /api prefix
      },
    },
  },
})
