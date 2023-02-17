<!--
 * @Date: 2023-02-10 15:12:29
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-17 22:18:24
 * @FilePath: /gridea-neo/src/renderer/src/pages/index.vue
-->
<script setup lang="ts">
import { useSiteStore } from '@renderer/store'
import type { Site } from '@renderer/store/'

const store = useSiteStore()
function reloadSite() {
  const siteFolder = localStorage.getItem('sourceFolder') || ''

  window.electron.ipcRenderer.send('app-site-reload', { siteFolder })
  window.electron.ipcRenderer.once('app-site-reloaded', (_, result: Site) => {
    store.updateSite(result)
  })
}

const sideMenus = computed(() => {
  return [
    {
      icon: 'ri-article-line',
      text: '文 章',
      count: 1234,
      index: 'articles'
    },
    {
      icon: 'ri-menu-2-line',
      text: '菜 单',
      count: 1234,
      index: 'menu'
    },
    {
      icon: 'ri-price-tag-3-line',
      text: '标 签',
      count: 1234,
      index: 'tags'
    },
    {
      icon: 'ri-t-shirt-line',
      text: '主 题',
      index: 'theme'
    },
    {
      icon: 'ri-server-line',
      text: '远 程',
      index: 'setting'
    }
  ]
})

const route = useRoute()
const currentRouter = computed(() => {
  const result = route.path.slice(1)
  return result
})

function publish() {
  // eslint-disable-next-line no-console
  console.log('click publish button')
}

function preview() {
  window.electron.ipcRenderer.send('html-render')

  window.electron.ipcRenderer.once('html-rendered', () => {
    window.electron.ipcRenderer.send('app-preview-server-port-get')
    window.electron.ipcRenderer.once(
      'app-preview-server-port-got',
      (_, port: number | string | null) => {
        if (!port && typeof port !== 'number') {
          // eslint-disable-next-line no-console
          console.log('有错误')
        } else {
          // eslint-disable-next-line no-console
          console.log(`成功， 端口号为${port}`)
        }
      }
    )
  })
}

const hasUpdate = ref(false)
const systemModalVisible = ref(false)

const router = useRouter()
onMounted(() => {
  router.push('articles')
  // @see https://docs.headwayapp.co/widget for more configuration options.
  const config = {
    selector: '.version-container',
    account: 'xbrnVx',
    translations: {
      title: 'Gridea News',
      readMore: 'Read more',
      labels: {
        new: 'News',
        improvement: 'Updates',
        fix: 'Fixes'
      },
      footer: 'Read more 👉'
    }
  }
  // @ts-expect-error init at index.html
  if (window.Headway) {
    // @ts-expect-error init at index.html
    Headway.init(config)
  }
  reloadSite()
})
</script>

<template>
  <el-container>
    <el-aside class="sider" width="200px">
      <div class="flex flex-col place-content-between" style="height: 100%">
        <div class="top-container select-none">
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
                  <span class="nav-text">{{ menu.text }}</span>
                </div>
                <span class="number">{{ menu.count }}</span>
              </div>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="bottom-container">
          <el-button plain round class="preview-btn" @click="preview">
            <i class="zwicon-eye mr-2" />
            {{ '预 览' }}
          </el-button>
          <el-button plain round class="sync-btn" @click="publish">
            <i class="zwicon-deploy mr-2" />
            {{ '同 步' }}
          </el-button>
          <div class="version-container" :class="{ 'version-dot': hasUpdate }">
            <i class="ri-equalizer-line text-base" @click="systemModalVisible = true"></i>
            <i class="ri-earth-line web-btn"></i>
            <el-tooltip content="Star支持作者">
              <i class="ri-github-line text-base"></i>
            </el-tooltip>
          </div>
        </div>
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
  // -webkit-app-region: drag;
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
    pointer-events: none;
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
    background-color: @primary-hover-bg;
  }
}

.right-container {
  background: @primary-hover-bg;
  margin-left: 8px 8px 8px 208px;
  padding: 8px 16px 8px 8px;
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 208px;
  right: 0px;
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  width: 90%;
  margin: 5%;
  background: @primary-bg;
  padding-left: 16px !important;
  transition: all 0.3s;
  cursor: default;
  border-radius: 6px;

  .nav-text {
    color: gray;
  }

  &:hover {
    background-color: white;

    .menu-item {
      background-color: white;
    }
  }

  &.is-active {
    background-color: @primary-hover-bg;

    .menu-item {
      background-color: @primary-hover-bg;
    }

    .nav-text {
      color: black;
    }
  }
}

.bottom-container {
  padding: 24px 32px 8px;

  button {
    margin: 8px 0;
  }
}

.preview-btn {
  background: @primary-hover-bg;
  transition: all 0.3s;
  width: 100%;

  &:hover {
    background: #fafafa;
  }

  &.el-button.is-plain {
    --el-button-hover-border-color: #334155;
    --el-button-hover-text-color: #334155;
  }
}

.sync-btn {
  border: none;
  transition: all 0.3s;
  width: 100%;
  color: #bababa;

  &:hover {
    background: linear-gradient(124deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%);
    border: none;
  }

  &.el-button.is-plain {
    background-color: black;
    --el-button-hover-text-color: @primary-hover-bg;
  }
}

.el-button + .el-button {
  margin-left: 0;
}

.web-btn {
  font-size: 16px;
  cursor: pointer;

  &:hover {
    color: @link-color;
  }
}

.version-container {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  align-items: center;
  position: relative;
  font-size: 12px;

  &.version-dot {
    &:before {
      content: '';
      display: block;
      width: 4px;
      height: 4px;
      background: red;
      border-radius: 2px;
      position: absolute;
      top: 51%;
      left: -12px;
      transform: translateY(-50%);
    }
  }
}

:root {
  --el-menu-bg-color: @primary-bg;
  --el-menu-hover-bg-color: @primary-hover-bg;
  --el-menu-active-color: black;

  --el-menu-item-height: 36px;
  --el-button-text-color: gray;
}
</style>
