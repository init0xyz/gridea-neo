<!--
 * @Date: 2023-02-24 18:52:27
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-25 20:23:26
 * @FilePath: /gridea-neo/src/renderer/src/components/ArticleUpdate.vue
-->
<script setup lang="ts">
import moment from 'moment'
const emits = defineEmits(['close'])

function close() {
  emits('close')
}

const canSubmit = ref(true)

const form = ref({
  title: '',
  fileName: '',
  tags: [] as string[],
  date: moment(new Date()),
  content: '# hello world',
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
</script>

<template>
  <div class="article-update-page">
    <div ref="pageTitle" class="page-title">
      <div class="flex" justify="end">
        <el-tooltip placement="bottom" content="返回">
          <div class="op-btn" tabindex="0" @click="close">
            <i class="zwicon-arrow-left" />
          </div>
        </el-tooltip>
        <el-tooltip placement="bottom" content="存草稿">
          <div class="op-btn" tabindex="0" :class="{ disabled: !canSubmit }">
            <i class="zwicon-checkmark" />
          </div>
        </el-tooltip>
        <el-tooltip placement="bottom" content="保存">
          <div class="op-btn save-btn" tabindex="0" :class="{ disabled: !canSubmit }">
            <i class="zwicon-checkmark" />
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
        ></el-input>
        <monaco-markdown-editor ref="monacoMarkdownEditor"
          :content="form.content"
          class="post-editor"
          @update="(newValue) => (form.content = newValue)"
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
