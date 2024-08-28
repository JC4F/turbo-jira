<script setup lang="ts">
import { Textarea } from '@repo/ui'
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
    <Textarea
      placeholder="Short summary"
      class="title h-auto font-medium text-2xl text-foreground;"
      @input="(e: any) => (title = e)"
      @blur="updateIssueDescription"
      :value="value"
      rows="1"
    />
  </div>
</template>

<style lang="scss" scoped>
.title {
  border-color: transparent !important;
}
</style>
