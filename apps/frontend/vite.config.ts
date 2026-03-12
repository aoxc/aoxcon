import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    base: '/aoxcon/',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY ?? ''),
      'process.env.VITE_SYSTEM_MODE': JSON.stringify(env.VITE_SYSTEM_MODE ?? mode),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      chunkSizeWarningLimit: 800,
      minify: isProduction ? 'terser' : 'esbuild',
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log'],
            },
            format: {
              comments: false,
            },
          }
        : undefined,
    },
  };
});
