import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  preview: {
    host: true, // binds to 0.0.0.0
    port: 5173, // optional, Render will use its own port via $PORT
    allowedHosts: ['retroboard-3vps.onrender.com'], // allow your Render domain
  },
});
