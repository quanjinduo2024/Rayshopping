import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // 关键：允许局域网访问
    host: '0.0.0.0',
    port: 3000,
    cors: true,
    proxy: {
      '/api/v1/user': {
        target: 'http://localhost:8001',  // 他自己的user-service
        changeOrigin: true,
      },
      '/api/v1': {
        target: 'http://localhost:8002',  // 你的shop-service
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
