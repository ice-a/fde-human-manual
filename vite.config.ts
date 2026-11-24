import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' 让构建产物使用相对路径，
// 因此同一份 dist 可直接部署到 Vercel / Cloudflare Pages / GitHub Pages 项目子路径。
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
