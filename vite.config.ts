import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // The v0 preview proxy does not forward Vite's native WebSocket endpoint.
      // Keep the dev server from injecting a client that repeatedly retries it.
      hmr: false,
      // File changes are synchronized by the preview environment.
      watch: null,
    },
  };
});
