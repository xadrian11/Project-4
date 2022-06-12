import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    proxy: {
      '^/api': {
        changeOrigin: true,
        target: 'http://localhost:5555',
      },
    },
  },
});
