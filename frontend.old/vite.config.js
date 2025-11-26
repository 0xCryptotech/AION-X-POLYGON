import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.VITE_RPC_URL': JSON.stringify(process.env.VITE_RPC_URL || 'https://rpc-amoy.polygon.technology/')
  },
  optimizeDeps: {
    exclude: ['@pythnetwork/pyth-evm-js'],
    include: ['clsx', 'tailwind-merge'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },
  assetsInclude: ['**/*.js']
});
