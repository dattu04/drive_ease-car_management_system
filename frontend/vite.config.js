import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ drive_ease-car_management_system/',   // 👈 repo name
})
