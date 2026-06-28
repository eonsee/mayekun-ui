import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isDev = mode === 'development'

  return {
    build: {
      sourcemap: isDev ? true : 'hidden',
    },
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: isDev
      ? {
          proxy: {
            '/admin': {
              target: env.VITE_PROXY_TARGET,
              changeOrigin: true,
            },
            '/upload': {
              target: env.VITE_PROXY_TARGET,
              changeOrigin: true,
            },
          },
        }
      : undefined,
  }
})
