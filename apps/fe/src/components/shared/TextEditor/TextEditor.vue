<script lang="ts" setup>
import Quill from 'quill'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { quillConfig } from './editor'

const props = defineProps<{
  placeholder?: string
  value?: string
  defaultValue?: string
  mode: string
}>()

const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'changeMode', mode: string): void
}>()

const quill = ref<Quill>()
const editorRef = ref<HTMLDivElement>()
const initialValue = ref<string>(props.value ?? props.defaultValue ?? '')

const initQuill = () => {
  return new Quill(editorRef.value as HTMLDivElement, {
    placeholder: props.placeholder,
    ...quillConfig
  })
}

const enableWriteMode = () => {
  emit('changeMode', 'write')
}

const insertValue = (value: string) => {
  quill.value?.setText(value)
  quill.value?.blur()
}

const getHTMLValue = () =>
  (editorRef.value as HTMLDivElement).querySelector('.ql-editor')?.innerHTML

const handleContentsChange = () => {
  emit('input', getHTMLValue() ?? '')
}

watch(
  () => props.mode,
  (_, from) => {
    if (from === 'write') {
      quill.value?.setText('')
      insertValue(props.value ?? '')
      initialValue.value = props.value ?? ''
    }
  }
)

onMounted(() => {
  try {
    quill.value = initQuill()
    insertValue(initialValue.value)
    quill.value.on('text-change', handleContentsChange)
  } catch (error) {
    console.log(error)
  }
})

onBeforeUnmount(() => {
  quill.value?.off('text-change', handleContentsChange)
  quill.value = null as any
})
</script>

<template>
  <div>
    <div v-show="mode == 'write'" class="ql">
      <div ref="editorRef"></div>
    </div>
    <div v-if="mode == 'read'" class="ql-snow">
      <div
        @click="enableWriteMode"
        class="content ql-editor"
        v-html="initialValue ? initialValue : 'Add a description'"
      />
    </div>
  </div>
</template>

<style lang="scss">
.ql {
  .ql-toolbar {
    border-radius: 4px 4px 0px 0px !important;
    border: 1px solid #dfe1e6 !important;
    border-bottom: none !important;
  }
  .ql-container.ql-snow {
    color: #172b4d;
    font-size: 15px;
    border-radius: 0px 0px 4px 4px;
    border: 1px solid #dfe1e6;
    border-top: none;
  }
}
.ql-editor {
  min-height: 110px;
  font-family:
    'CircularStd',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Helvetica,
    Arial,
    sans-serif,
    'CircularStd';

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: bold;
  }
  img,
  video {
    display: inline-block;
  }
}
.content {
  padding: 0 !important;
  font-size: 15px;
}
</style>
