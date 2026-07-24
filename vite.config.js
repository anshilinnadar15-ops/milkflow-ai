import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for MilkFlow AI
// Host set to true so the dev server / preview works inside containers and on Render
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
    allowedHosts: true,
  },
})
