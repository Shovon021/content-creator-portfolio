import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false
  },
  build: {
    // Target modern browsers — no legacy transpilation overhead
    target: 'es2020',
    // Inline assets < 4 KB as base64 to cut requests
    assetsInlineLimit: 4096,
    // Source maps off in production
    sourcemap: false,
    // Warn if any chunk exceeds 500 KB gzipped
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Split vendor libs so browser can cache them independently
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
            return 'motion-vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor';
          }
        }
      }
    }
  }
});

