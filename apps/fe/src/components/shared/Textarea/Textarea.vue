<script lang="ts" setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'
import autosize from 'autosize'

const props = defineProps<{
  value?: string
  autoFocus?: boolean
}>()

const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const elementRef = ref<HTMLTextAreaElement | null>(null)

const handleInput = (e: Event) => {
  emit('input', (e.target as HTMLTextAreaElement).value)
}

onMounted(() => {
  if (elementRef.value) {
    autosize(elementRef.value)
    if (props.autoFocus) {
      elementRef.value.focus()
    }
  }
})
</script>

<template>
  <textarea ref="elementRef" :value="props.value" @input="handleInput" />
</template>

<template>
  <textarea
    @input="handleInput"
    @keydown="$emit('keydown', $event)"
    @blur="$emit('blur', $event)"
    :value="value"
    v-bind="$attrs"
    ref="elementRef"
    rows="1"
    class="textarea"
  />
</template>

<style lang="scss" scoped>
.textarea {
  border: 1px solid transparent;
  @apply border-borderLightest;
}
.textarea:hover:not(:focus) {
  @apply bg-backgroundLight;
}
.textarea:focus {
  @apply bg-white border-default border-borderInputFocus;
  box-shadow: 0 0 0 1px #4c9aff;
}
</style>
<style lang="scss" scoped>
.textarea {
  padding: 7px 7px 8px;
  line-height: 1.28;
  resize: none;
  box-shadow: transparent 0px 0px 0px 1px;
  transition: background 0.1s ease 0s;
  overflow: auto;
  overflow-y: hidden;
  width: 100%;
  border-radius: 3px;
  appearance: none;
}
</style>
