<script lang="ts" setup>
import { ref, computed } from 'vue'

// Define props
const props = defineProps<{
  initialValue?: string
  updateIssue: (payload: { description: string }) => Promise<void>
}>()

// Reactive state
const mode = ref<string>('read')
const isWorking = ref<boolean>(false)
const editor = ref<HTMLDivElement>()

// Computed property
const readOnly = computed(() => mode.value === 'read')

// Methods
const handleModeChange = (m: string) => {
  mode.value = m
}

const cancelWrite = () => {
  handleModeChange('read')
}

const updateIssueDescription = async () => {
  try {
    isWorking.value = true
    const description = (editor.value as any).getHTMLValue()
    await props.updateIssue({ description })
    isWorking.value = false
    handleModeChange('read')
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>
    <div class="pt-5 pb-2 text-15 text-textDarkest">Description</div>
    <j-text-editor
      @changeMode="handleModeChange"
      :mode="mode"
      :value="initialValue"
      ref="editor"
      placeholder="Describe the issue"
    />
    <div v-if="!readOnly" class="flex items-center pt-3">
      <j-button
        :isWorking="isWorking"
        @click="updateIssueDescription"
        variant="primary"
        class="mr-2"
      >
        Save</j-button
      ><j-button @click="cancelWrite" variant="empty"> Cancel </j-button>
    </div>
  </div>
</template>

<style></style>
