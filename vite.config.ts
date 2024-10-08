import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@root/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'https://bmw.yixi.pro',
        // target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    port: 8808,
  },
})
