import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svg from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svg(), // для импорта SVG как React-компонентов
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // алиас для импортов
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
});