import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite';

/**
 * @title AOXC Neural OS - Sovereign Build Infrastructure
 * @audit_status VERIFIED
 * @compliance Triple-Chain Standard (XLYR, SUI, ADA)
 * @version 3.1.0
 */
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // AUDIT: Load environment variables with strictly defined process context
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    /**
     * [NETWORK_UPLINK_CONFIG]
     * Base path synchronization for GitHub Pages deployment.
     */
    base: '/aoxcon/',

    plugins: [
      react(), 
      tailwindcss()
    ],

    /**
     * [NEURAL_OS_DEFINITIONS]
     * Global constants injected during build-time for systemic consistency.
     */
    define: {
      'process.env.VITE_SYSTEM_MODE': JSON.stringify(env.VITE_SYSTEM_MODE ?? mode),
      '__AOXC_VERSION__': JSON.stringify('3.1.0-NEURAL'),
    },

    resolve: {
      /**
       * [PATH_COORDINATION]
       * Architectural aliases for clean modular imports.
       */
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      port: 3000,
      host: true, 
      strictPort: true,
    },

    build: {
      /**
       * [PERFORMANCE_AUDIT]
       * Target ESNext for high-integrity execution on modern runtimes.
       */
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      
      // Audit: Adjusted limit to accommodate complex neural UI components
      chunkSizeWarningLimit: 1500, 
      
      /**
       * [SECURITY_HARDENING]
       * Minification strategy to strip debug artifacts and console overhead.
       */
      minify: isProduction ? 'terser' : 'esbuild',
      terserOptions: isProduction ? {
        compress: {
          drop_console: true, 
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        format: {
          comments: false, 
        },
      } : undefined,

      rollupOptions: {
        output: {
          /**
           * [STRUCTURAL_INTEGRITY]
           * Modular chunking strategy to isolate core logic from heavy dependency vendors.
           * Reduces memory overhead and optimizes parallel delivery.
           */
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('ethers')) return 'vendor-crypto-core';
              if (id.includes('framer-motion')) return 'vendor-neural-motion';
              if (id.includes('lucide-react')) return 'vendor-visual-assets';
              return 'vendor-os-primitives';
            }
          },
          
          /**
           * [DETERMINISTIC_HASHING]
           * Prevents cache collision and ensures consistent state transitions across deployments.
           */
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },

    /**
     * [ECOSYSTEM_AWARENESS]
     * Pre-optimizing high-frequency dependencies for seamless Triple-Chain coordination.
     */
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion', 'lucide-react', 'ethers'],
    },
  };
});
