<!--
 * @Date: 2023-02-16 17:38:37
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-27 15:21:18
 * @FilePath: /gridea-neo/src/renderer/src/pages/index/menu.vue
-->
<script setup lang="ts">
const reloadSite = inject('site-reload', Function, true)

onMounted(() => {
  reloadSite()
})
</script>

<template>
  <h1>This is Menu page</h1>
</template>
