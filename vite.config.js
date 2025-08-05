import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Content-Type': 'text/html; charset=utf-8'
    }
  },
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Content-Type': 'text/html; charset=utf-8'
    }
  }
})