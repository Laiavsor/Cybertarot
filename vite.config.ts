import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' — чтобы сборка работала и на сервере, и внутри Capacitor (file:// / https://localhost)
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true,
    port: 5173,
    // Превью Arena живёт на поддомене e2b.app — разрешаем внешние хосты
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsInlineLimit: 2048,
  },
});
