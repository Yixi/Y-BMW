import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  esbuild: {
    drop: ['console', 'debugger'],
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@root/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  server: {
    host: true,
    proxy: {
      '/eadrax-coas': {
        target: 'https://myprofile.bmw.com.cn',
        changeOrigin: true,
      },
      '/bmwKey.php': {
        target: 'https://m.qqtlr.com',
        changeOrigin: true,
      },
    },
    port: 8880,
  },
})
