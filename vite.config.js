import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler']
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://team-pulse-bend.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path  // Keep the path as is since we're already using /api/v1 in our API calls
      }
    }
  }
})