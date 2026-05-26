import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// base 由 DEPLOY_TARGET 环境变量控制：pages 部署时用 /balatro-v6/，本地开发用 ./
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: process.env.DEPLOY_TARGET === 'pages' ? '/balatro-v6/' : './',
})
