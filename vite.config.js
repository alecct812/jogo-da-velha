import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base precisa bater com o nome do repositório para o GitHub Pages funcionar
export default defineConfig({
  base: '/jogo-da-velha/',
  plugins: [react()],
})
