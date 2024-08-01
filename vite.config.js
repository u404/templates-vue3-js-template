import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'
import pxToRemOrVwPlugin from 'vite-plugin-px-rem-vw'
import inject from '@rollup/plugin-inject'
// 按需引入组件库：
// element-plus参考： https://element-plus.org/zh-CN/guide/quickstart.html
// vant-ui参考：https://vant-ui.github.io/vant/#/zh-CN/quickstart#fang-fa-er.-an-xu-yin-ru-zu-jian-yang-shi

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
    plugins: [
      vue(),
      pxToRemOrVwPlugin({
        type: 'vw',
        options: {
          viewportWidth: 375,
          mediaQuery: false // 媒体查询里的不转换
        }
      }),
      // // 自动引入全局库，相当于在每个文件顶部自动加上了 import jQuery from 'jquery'
      // inject({
      //   jQuery: 'jquery' // 注意需要同时配置eslint
      // }),
      mockDevServerPlugin()
    ],
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
