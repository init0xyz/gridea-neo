<!--
 * @Date: 2023-02-24 20:42:18
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-25 20:28:11
 * @FilePath: /gridea-neo/src/renderer/src/components/monacoMarkdownEditor.vue
-->
<script setup lang="ts">
import * as monaco from 'monaco-editor'
import * as MonacoMarkdown from 'monaco-markdown'
import theme from '@renderer/assets/monaco-theme'

const props = defineProps(['content'])

const emits = defineEmits(['update', 'keydown'])

// const setEditorHeight = () => {
//   const lines = document.querySelectorAll('.view-line') as any
//   if (lines) {
//     if (lines.length === 1 && !lines[0].innerText.trim()) {
//       lines[0].classList.add('input-holder')
//     }
//     else if (lines[0].classList.contains('input-holder')) {
//       lines[0].classList.remove('input-holder')
//     }
//   }
// }

let editor: any = null

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log(props.content)
  monaco.editor.defineTheme('GrideaLight', theme as any)
  monaco.editor.setTheme('GrideaLight')
  editor = monaco.editor.create(document.getElementById('monaco-markdown-editor') as any, {
    language: 'markdown-math',
    value: props.content,
    fontSize: 15,
    lineNumbers: 'off',
    minimap: {
      enabled: false
    },
    wordWrap: 'on',
    colorDecorators: true,
    extraEditorClassName: 'gridea-editor',
    folding: false,
    renderLineHighlight: 'none',
    scrollbar: {
      vertical: 'auto',
      horizontal: 'hidden',
      verticalScrollbarSize: 4
    },
    lineHeight: 26.25,
    scrollBeyondLastLine: false,
    wordBasedSuggestions: false,
    snippetSuggestions: 'none',
    lineDecorationsWidth: 0,
    occurrencesHighlight: false,
    automaticLayout: true
    // fontFamily: 'PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif',
  })
  const extension = new MonacoMarkdown.MonacoMarkdownExtension()
  extension.activate(editor)

  // setTimeout(setEditorHeight, 0)

  editor.onDidChangeModelContent(() => {
    // setTimeout(setEditorHeight, 0)
    const value = editor.getValue()
    if (props.content !== value) {
      emits('update', value)
    }
  })

  editor.onKeyDown(() => {
    emits('keydown')
  })
})
</script>

<template>
  <div id="monaco-markdown-editor" />
</template>

<style lang="less" scoped>
#monaco-markdown-editor {
  max-width: 734px;
  // min-height: calc(100vh - 176px);
  height: calc(100vh - 110px);
  z-index: 1;
}

:deep(.context-view .monaco-scrollable-element) {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
  border-radius: 4px;
}

:deep(.monaco-menu .monaco-action-bar.vertical .action-item) {
  border: none;
}

:deep(.action-menu-item) {
  color: #718096 !important;

  &:hover {
    color: #744210 !important;
    background: #fffff0 !important;
  }
}

:deep(.decorationsOverviewRuler) {
  display: none !important;
}

:deep(.monaco-menu .monaco-action-bar.vertical .action-label.separator) {
  border-bottom-color: #e2e8f0 !important;
}

:deep(.input-holder) {
  &:before {
    content: '开始写作...';
    color: rgba(208, 211, 217, 0.6);
  }
}

:deep(.monaco-editor) {
  .scrollbar {
    .slider {
      background: #eee;
    }
  }

  .scroll-decoration {
    box-shadow: #efefef 0 2px 2px -2px inset;
  }
}
</style>
