import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.VITE_RPC_URL': JSON.stringify(process.env.VITE_RPC_URL || 'https://rpc-amoy.polygon.technology/')
  }
});
