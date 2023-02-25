/*
 * @Date: 2023-02-09 11:53:34
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-25 11:51:43
 * @FilePath: /gridea-neo/src/renderer/src/main.ts
 */
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import routes from 'virtual:generated-pages'
import App from './App.vue'
import './workers'

import '@unocss/reset/tailwind.css'
import './assets/css/zwicon.less'
import 'remixicon/fonts/remixicon.css'
import './assets/css/main.less'
import 'uno.css'

const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
app.use(router)
app.use(pinia)
app.mount('#app')
