import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.url, '')

  return {
    base: env.BASE_URL || '',
    server: {
      proxy: {
        '/eloan': {
          target: 'http://10.0.0.69:8081/',
          changeOrigin: true
          // rewrite: (path) => path.replace(/^\/urule/, '')
        }
      }
    },
    plugins: [vue(), mockDevServerPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/variables.scss";'
        }
      }
    }
  }
})
