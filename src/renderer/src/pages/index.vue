<!--
 * @Date: 2023-02-10 15:12:29
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-16 22:53:56
 * @FilePath: /gridea-neo/src/renderer/src/pages/index.vue
-->
<script setup lang="ts">
const sideMenus = computed(() => {
  return [
    {
      icon: 'ri-article-line',
      text: '文章',
      count: 1234,
      index: 'articles'
    },
    {
      icon: 'ri-menu-2-line',
      text: '菜单',
      count: 1234,
      index: 'menu'
    },
    {
      icon: 'ri-price-tag-3-line',
      text: '标签',
      count: 1234,
      index: 'tags'
    },
    {
      icon: 'ri-t-shirt-line',
      text: '主题',
      index: 'theme'
    },
    {
      icon: 'ri-server-line',
      text: '远程',
      index: 'setting'
    }
  ]
})

const route = useRoute()
const currentRouter = computed(() => {
  return route.path
})

const router = useRouter()
onMounted(() => {
  router.push('articles')
})
</script>

<template>
  <el-container>
    <el-aside class="sider" width="200px">
      <div class="top-container">
        <div class="logo">
          <img class="img" src="@renderer/assets/logo.png" />
        </div>
        <el-menu router default-active="articles">
          <el-menu-item v-for="menu in sideMenus" :key="menu.index" :index="menu.index">
            <div class="menu-item">
              <div class="flex items-center">
                <i class="mr-2 text-base"
                  :class="{ [menu.icon]: true }"
                  :style="{ color: currentRouter === menu.index ? '#f9d757' : 'inherit' }"
                />
                <span text="normal">{{ menu.text }}</span>
              </div>
              <span class="number">{{ menu.count }}</span>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>
    <el-main class="right-container">
      <div class="content">
        <router-view></router-view>
      </div>
    </el-main>
  </el-container>
</template>

<style lang="less">
@import '@renderer/assets/css/var.less';

.sider {
  background: @primary-bg;
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;

  &::-webkit-scrollbar {
    width: 0;
  }
}

.logo {
  min-height: 64px;
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 32px 0 16px;

  h3 {
    color: @primary-color;
    font-size: 18px;
    transform: translateY(8px);
    // background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(250, 250, 250, 1)), to(rgba(255, 255, 255, 0.4)));
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
  }

  .img {
    width: 64px;
    height: 64px;
    border-radius: 16px;
  }
}

.menu-item {
  display: flex;
  justify-content: space-between;
  background: @primary-bg;
  width: 100%;
  transition: all 0.3s;

  .number {
    font-weight: lighter;
  }

  &:hover {
    background-color: #fff;
  }
}

.right-container {
  background: #fff;
  margin-left: 8px 8px 8px 208px;
  padding: 8px 16px 8px 8px;
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 208px;
  right: 0px;
}

.el-menu-item {
  width: 90%;
  margin: 5%;
  background: @primary-bg;
  padding-left: 16px !important;
  transition: all 0.3s;
  cursor: default;
  border-radius: 6px;

  &:hover {
    background-color: white;
  }

  &.is-active {
    background-color: #fff;

    .menu-item {
      background-color: #fff;
    }
  }
}

:root {
  --el-menu-bg-color: @primary-bg;
  --el-menu-hover-bg-color: #fff;
  --el-menu-active-color: black;
  --el-menu-item-height: 36px;
}
</style>
