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
        rewrite: (path) => {
          // For auth endpoints, keep /api/auth
          if (path.startsWith('/api/auth')) {
            return path.replace(/^\/api/, '/api/v1');
          }
          // For pulse-logs endpoints, route correctly
          return path.replace(/^\/api/, '/api/v1');
        }
      }
    }
  }
})