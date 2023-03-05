<!--
 * @Date: 2023-02-24 18:52:27
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-03-03 11:57:08
 * @FilePath: /gridea-neo/src/renderer/src/components/ArticleUpdate.vue
-->
<script setup lang="ts">
import { UrlFormats } from '@renderer/helpers/enums'
import { useSiteStore } from '@renderer/store'
import moment from 'moment'
import { nanoid } from 'nanoid'
import type { IPost } from 'src/interfaces/post'
import type { Action } from 'element-plus'
import slug from '@renderer/helpers/slug'
const props = defineProps({
  articleFileName: String
})
const emits = defineEmits(['close'])
const store = useSiteStore()
const reloadSite = inject('site-reload', Function, true)

const changedAfterLastSave = ref(false)

function close() {
  if (changedAfterLastSave.value === true) {
    ElMessageBox.confirm('你将丢失所有的未保存的更改，是否继续？', '警告', {
      confirmButtonText: '继续',
      cancelButtonText: '返回',
      callback: (action: Action) => {
        if (action === 'confirm') {
          changedAfterLastSave.value = false
          emits('close')
        }
      }
    })
    return
  }
  emits('close')
}

const form = ref({
  title: '',
  fileName: '',
  tags: [] as string[],
  date: moment(new Date()),
  content: '',
  published: false,
  hideInList: false,
  isTop: false,
  featureImage: {
    path: '',
    name: '',
    type: ''
  },
  featureImagePath: '',
  deleteFileName: ''
})

const canSubmit = computed(() => {
  return form.value.title && form.value.content
})

const fileNameChanged = ref(false)
const currentPostIndex = ref(-1)
const originalFileName = ref('')
const featureType = ref<'DEFAULT' | 'EXTERNAL'>('DEFAULT')

function buildCurrentForm() {
  if (props.articleFileName) {
    fileNameChanged.value = true // 编辑文章标题时URL不跟随其变化
    currentPostIndex.value = store.posts.findIndex(
      (item: IPost) => item.fileName === props.articleFileName
    )
    const currentPost = store.posts[currentPostIndex.value]
    originalFileName.value = currentPost.fileName
    if (currentPost) {
      form.value.title = currentPost.data.title
      form.value.fileName = currentPost.fileName
      form.value.tags = currentPost.data.tags || []
      form.value.date = moment(currentPost.data.date).isValid()
        ? moment(currentPost.data.date)
        : moment()
      form.value.content = currentPost.content
      form.value.published = currentPost.data.published
      form.value.hideInList = currentPost.data.hideInList
      form.value.isTop = currentPost.data.isTop

      if (currentPost.data.feature && currentPost.data.feature.includes('http')) {
        form.value.featureImagePath = currentPost.data.feature
        featureType.value = 'EXTERNAL'
      } else {
        form.value.featureImage.path =
          (currentPost.data.feature && currentPost.data.feature.substring(7)) || ''
        form.value.featureImage.name = form.value.featureImage.path.replace(/^.*[\\/]/, '')
      }
    }
  } else if (store.$state.themeConfig.postUrlFormat === UrlFormats.ShortId) {
    form.value.fileName = nanoid(7)
  }
}

function buildFileName() {
  if (form.value.fileName === '') {
    form.value.fileName =
      store.$state.themeConfig.postUrlFormat === UrlFormats.Slug
        ? slug(form.value.title)
        : nanoid(7)
  }
}

function checkArticleUrlValid() {
  const restPosts = JSON.parse(JSON.stringify(store.$state.posts))
  const foundPostIndex = restPosts.findIndex((post: IPost) => post.fileName === form.value.fileName)

  if (foundPostIndex !== -1) {
    if (currentPostIndex.value === -1) {
      // 新增文章时文件名和其他文章文件名冲突
      return false
    }
    restPosts.splice(currentPostIndex.value, 1)
    const index = restPosts.findIndex((post: IPost) => post.fileName === form.value.fileName)
    if (index !== -1) {
      return false
    }
  }

  currentPostIndex.value = currentPostIndex.value === -1 ? 0 : currentPostIndex.value
  return true
}

function formatForm(published?: boolean) {
  buildFileName()
  const valid = checkArticleUrlValid()
  if (!valid) {
    ElMessage.error('文章的 URL 与其他文章重复')
    return
  }

  if (form.value.fileName.includes('/')) {
    ElMessage.error('URL 不可包含 /')
    return
  }

  // 文件名改变之后，删除原来文件
  if (form.value.fileName.toLowerCase() !== originalFileName.value.toLowerCase()) {
    form.value.deleteFileName = originalFileName.value
  }
  const result = {
    ...JSON.parse(JSON.stringify(form.value)),
    date: form.value.date.format('YYYY-MM-DD HH:mm:ss')
  }
  if (featureType.value !== 'EXTERNAL') {
    result.featureImagePath = ''
  }
  if (featureType.value !== 'DEFAULT') {
    result.featureImage = {
      path: '',
      name: '',
      type: ''
    }
  }

  result.published = typeof published === 'boolean' ? published : result.published

  return result
}

function updatePostSavedStatus() {
  changedAfterLastSave.value = false
}

function saveDraft() {
  if (canSubmit.value) {
    const result = formatForm(false)
    window.electron.ipcRenderer.send('app-post-create', result)
    window.electron.ipcRenderer.once('app-post-created', () => {
      updatePostSavedStatus()
      ElMessage.success('保存草稿成功')
      reloadSite()
    })
  }
}

function savePost() {
  if (canSubmit.value) {
    const result = formatForm(true)
    window.electron.ipcRenderer.send('app-post-create', result)
    window.electron.ipcRenderer.once('app-post-created', () => {
      updatePostSavedStatus()
      ElMessage.success('保存成功')
      reloadSite()
    })
  } else {
    ElMessage.warning('无法保存')
  }
}

onBeforeMount(() => {
  buildCurrentForm()
})

onMounted(() => {
  watch(
    form,
    () => {
      changedAfterLastSave.value = true
    },
    { deep: true }
  )
})

function handleFormContentUpdate(newValue: string) {
  form.value.content = newValue
}

function handleInputChange() {
  if (!fileNameChanged.value && store.$state.themeConfig.postUrlFormat === UrlFormats.Slug) {
    form.value.fileName = slug(form.value.title)
  }
}
</script>

<template>
  <div class="article-update-page">
    <div ref="pageTitle" class="page-title">
      <div class="flex" justify="end">
        <el-tooltip placement="bottom" content="返回">
          <div class="op-btn" tabindex="0" @click.prevent="close">
            <i class="zwicon-arrow-left" />
          </div>
        </el-tooltip>
        <el-tooltip placement="bottom" content="存草稿">
          <div class="op-btn"
            tabindex="0"
            :class="{ disabled: !canSubmit }"
            @click.prevent="saveDraft"
          >
            <i class="zwicon-checkmark" />
          </div>
        </el-tooltip>
        <el-tooltip placement="bottom" content="保存">
          <div class="op-btn save-btn" tabindex="0" :class="{ disabled: !canSubmit }">
            <i class="zwicon-checkmark" @click.prevent="savePost" />
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="page-content">
      <div class="editor-wrapper">
        <el-input v-model="form.title"
          class="post-title w-full"
          size="large"
          placeholder="输入标题"
          @change="handleInputChange"
        ></el-input>
        <monaco-markdown-editor ref="monacoMarkdownEditor"
          :content="form.content"
          class="post-editor"
          @update="handleFormContentUpdate"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.article-update-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1025;
  background: #fff;
  display: flex;
  flex-direction: column;

  .page-title {
    padding: 8px 16px;
    z-index: 1026;
    background: #fff;
    transition: opacity 700ms ease;
    border-bottom: 1px solid #e8e8e88a;

    .op-btn {
      height: 30px;
      line-height: 30px;
      padding: 0 16px;
      font-size: 18px;
      border-radius: 20px;
      margin-left: 8px;
      outline: none;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s;

      i {
        font-weight: bold;
      }

      &:hover {
        background: #efefef;
        color: #515457;
      }

      &:focus {
        background: #efefef;
      }

      &.save-btn:not(.disabled) {
        color: #38a169;

        &:hover {
          background: #9ae6b4;
          color: #22543d;
        }

        &:focus {
          color: #22543d;
          background: #68d391;
        }
      }

      &.disabled {
        cursor: default;
        color: #ccc;

        // background: #fafafa;
        &:hover,
        &:focus {
          background: #fff;
        }
      }
    }
  }

  .page-content {
    background: #fff;
    flex: 1;
    display: flex;
    overflow: scroll;
  }
}

.editor-wrapper {
  width: 100vw;
  margin: 0;
  position: absolute;
  top: 47px;
  left: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .post-title {
    width: 752px;
  }

  .post-editor {
    width: 100%;
    height: 100%;

    :deep(#monaco-markdown-editor) {
      width: 728px;
    }

    :deep(.monaco-editor) {
      .scrollbar {
        position: fixed !important;
        top: 47px !important;
      }
    }
  }
}

:deep(.el-input) {
  box-shadow: none;
  --el-input-hover-border: none;
  --el-input-focus-border: none;
  --el-input-hover-border-color: none;
  --el-input-focus-border-color: none;
  --el-input-transparent-border: none;
  --el-input-clear-hover-color: none;
  padding: none;
}

:deep(.el-input__inner) {
  font-size: 24px;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
}
</style>
