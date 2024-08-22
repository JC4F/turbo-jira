<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  value: string
  updateIssue: (data: { title: string }) => Promise<void>
}>()

const isWorking = ref<boolean>(false)
const title = ref<string>(props.value)

const updateIssueDescription = async () => {
  try {
    isWorking.value = true
    await props.updateIssue({ title: title.value })
    isWorking.value = false
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="w-full inline-block mt-4 -ml-2 h-10">
    <j-textarea
      placeholder="Short summary"
      class="title h-auto font-medium text-2xl text-textDarkest;"
      @input="(e: any) => (title = e)"
      @blur="updateIssueDescription"
      :value="value"
    />
  </div>
</template>

<style lang="scss" scoped>
.title {
  border-color: transparent !important;
}
</style>
