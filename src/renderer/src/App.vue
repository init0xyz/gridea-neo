<!--
 * @Date: 2023-02-09 11:53:34
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-18 11:24:06
 * @FilePath: /gridea-neo/src/renderer/src/App.vue
-->
<script setup lang="ts">
const router = useRouter()
onMounted(() => {
  router.push('/')
})
</script>

<template>
  <div id="app">
    <RouterView></RouterView>
  </div>
</template>
