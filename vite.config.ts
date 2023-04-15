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
        target: 'http://bmw.yixi.pro',
        changeOrigin: true,
      },
    },
    port: 8880,
  },
})
