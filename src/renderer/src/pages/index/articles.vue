<!--
 * @Date: 2023-02-16 16:54:04
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-19 21:13:53
 * @FilePath: /gridea-neo/src/renderer/src/pages/index/articles.vue
-->
<script setup lang="ts">
import { useSiteStore } from '@renderer/store'
import type { IPost } from 'src/interfaces/post'
import moment from 'moment'

const selectedPost: any = ref([])
const keyword = ref<string>('')
const searchInputVisible = ref<boolean>(false)

function addArticle() {
  // eslint-disable-next-line no-console
  console.log('添加新的文章')
}

function toggleSerachInputVisible() {
  searchInputVisible.value = !searchInputVisible.value
}

const store = useSiteStore()
const currentPage = ref(1)
const pageSize = ref(20)
const postList = computed(() => {
  return store.$state.posts.filter((item: IPost) =>
    item.data.title.toLowerCase().includes(keyword.value.toLowerCase())
  )
})
const currentPostList = computed(() => {
  return postList.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  )
})

function editPost(post: IPost) {
  // eslint-disable-next-line no-console
  console.log(post)
}
</script>

<template>
  <div class="article-page">
    <div class="flex justify-between tool-container">
      <div class="flex items-center">
        <div v-if="selectedPost?.length > 0"
          class="flex items-center py-1 px-2 bg-gray-100 transition cursor-default hover:bg-gray-200 rounded-sm"
        >
          <i class="ri-delete-bin-3-line mr-2" />
          <span class="text-sm">已选{{ selectedPost.length }}</span>
        </div>
      </div>
      <div class="flex">
        <el-input v-if="searchInputVisible"
          v-model="keyword"
          class="serach-input"
          placeholder="输入关键词"
          style="width: 200px"
          @blur="toggleSerachInputVisible"
        />
        <el-tooltip v-if="!keyword && !searchInputVisible"
          placement="bottom"
          content="搜索文章"
          :hide-after="50"
        >
          <div class="op-btn" @click="() => (searchInputVisible = true)">
            <i class="zwicon-search" style="transform: scale(0.88)"></i>
          </div>
        </el-tooltip>
        <el-tooltip placement="bottom" content="添加文章" :hide-after="50">
          <div class="op-btn" tabindex="0" @click="addArticle">
            <i class="zwicon-plus" style="transform: scale(1.08)"></i>
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="content-container">
      <div class="pb-12">
        <div v-for="post in currentPostList"
          :key="post.fileName"
          class="post-container flex mb-2 relative cursor-pointer transition hover:bg-gray-100 overflow-hidden"
          @click="() => editPost(post)"
        >
          <div class="p-4 flex-1 flex">
            <div class="flex flex-shrink-0 items-center pr-4">
              <el-checkbox size="large"></el-checkbox>
            </div>
            <div class="flex-1">
              <a class="post-title block text-base text-gray-700 mb-2">{{ post.data.title }}</a>
              <div class="text-xs flex items-center text-gray-400">
                <div class="text-xs flex items-center mr-2">
                  <div class="rounded-full w-1 h-1 mr-1"
                    :class="{
                      'bg-green-500': post.data.published,
                      'bg-gray-700': !post.data.published
                    }"
                  ></div>
                  {{ post.data.published ? '已发布' : '草稿' }}
                </div>
                <div class="flex items-center">
                  <i class="ri-calendar-line mr-1" />
                  {{ moment(post.data.date).format('YYYY-MM-DD') }}
                </div>
                <div v-if="post.data.tags!.length > 0"
                  class="flex-1 flex flex-wrap items-center ml-2"
                >
                  <i class="ri-price-tag-3-line" />
                  <div v-for="(tag, index) in post.data.tags" :key="index">
                    <div v-if="index < 2" class="text-xs ml-1 flex">{{ tag }}</div>
                  </div>
                  <div v-if="post.data.tags!.length > 2" class="ml-1">...</div>
                </div>
              </div>
            </div>
          </div>

          <img v-if="post.data.feature" :src="post.data.feature" class="feature-img" />
          <div class="absolute right-0 top-0 -mt-px -mr-px flex">
            <div v-if="post.data.hideInList"
              class="text-xs flex items-center px-2 rounded-b rounded-br-none bg-gray-800 text-white"
            >
              HIDE
            </div>
            <div v-if="post.data.isTop"
              class="ml-2 text-xs flex items-center px-2 rounded-b rounded-br-none bg-yellow-400 text-gray-900"
            >
              TOP
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '@renderer/assets/css/var.less';

.post-container {
  box-shadow: inset 0 0 0 1px #eaeaea;
  border-radius: 6px;

  &:hover {
    .post-title {
      color: @link-color;
    }
  }
}

.feature-img {
  width: 176px;
  height: 84px;
  object-fit: cover;
}
</style>
