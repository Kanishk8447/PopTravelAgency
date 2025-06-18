import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://gen-ai-foundation-demo-cec4ghc4aeesbjba.a03.azurefd.net',
        changeOrigin: true,
       // secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
