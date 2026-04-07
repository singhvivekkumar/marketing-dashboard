/**
 * vite.config.js
 *
 * Vite is the BUILD TOOL for React — not a framework.
 * Think of it as the engine under the hood:
 *   - In development : starts a lightning-fast local server (< 1 second)
 *   - In production  : bundles all React code into optimised static files
 *                      (HTML + JS + CSS) that Nginx serves on your server
 *
 * You write 100% standard React.js code.
 * Vite replaces the old "Create React App" (CRA) which is now deprecated.
 * Your team never interacts with Vite directly — just run `npm run dev`.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    // During development, proxy /api calls to the Node.js backend
    // so you never have to change URLs between dev and production
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'dist',          // npm run build → creates dist/ folder
    sourcemap: false,        // disable sourcemaps in production
    chunkSizeWarningLimit: 1000,
  },
});
