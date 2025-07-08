import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For proper client-side routing
  preview: {
    port: 5173,
    strictPort: false,
  },
  build: {
    // For production build
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          framer: ['framer-motion'],
        },
      },
    },
  },
})
