/*
 * @Date: 2023-02-09 11:53:34
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-13 10:17:29
 * @FilePath: /gridea-neo/electron.vite.config.ts
 */
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import { presetIcons } from 'unocss'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    // build: {
    //   minify: 'terser',
    //   terserOptions: {
    //     compress: {
    //       drop_console: true,
    //       drop_debugger: true
    //     }
    //   }
    // },
    resolve: {
      alias: {
        '@main': resolve('src/main/')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    // build: {
    //   minify: 'terser',
    //   terserOptions: {
    //     compress: {
    //       drop_console: true,
    //       drop_debugger: true
    //     }
    //   }
    // },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      Vue({
        reactivityTransform: true
      }),
      // https://github.com/hannoeru/vite-plugin-pages
      Pages(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: ['vue', 'vue/macros', 'vue-router', '@vueuse/core'],
        dts: true,
        dirs: ['./src/composables/**'],
        vueTemplate: true,
        resolvers: [ElementPlusResolver()]
      }),

      // https://github.com/antfu/vite-plugin-components
      Components({
        dts: true
      }),

      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss({
        presets: [presetIcons({})]
      })
    ]
  }
})
