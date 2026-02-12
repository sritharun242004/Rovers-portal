import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path"
import react from "@vitejs/plugin-react"
import dotenv from 'dotenv';
dotenv.config();
import { defineConfig } from "vite"
const VITE_API_URL = process.env.VITE_API_URL
export default defineConfig({
  plugins: [
    react(), 
    // Sentry plugin DISABLED for development to prevent localhost:4444 errors
    // sentryVitePlugin({
    //   org: "edge-76",
    //   project: "rovers-front-end"
    // })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['@zxing/browser', '@zxing/library'],
    exclude: ['html5-qrcode']
  },
  build: {
    commonjsOptions: {
      include: [/@zxing\/.*/, /node_modules/],
    },
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    allowedHosts: ["localhost", ".deployments.pythagora.ai", "gwr.rovers.life", "rovers.life", "www.rovers.life"],
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // Don't rewrite the path - keep /api prefix
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
    cors: true,
    hmr: {
      host: process.env.VITE_HMR_HOST || 'localhost',
      protocol: process.env.VITE_HMR_PROTOCOL || 'ws',
    },
  },
})