import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/castle-practice/',
  build: {
    target: ['es2015', 'safari13'],
  },
})
