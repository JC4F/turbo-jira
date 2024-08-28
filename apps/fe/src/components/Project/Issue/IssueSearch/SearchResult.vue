<script setup lang="ts">
import IssueTypeIcon from '@/components/shared/IssueTypeIcon/IssueTypeIcon.vue'
import type { Issue } from '@/types/issue'
import { eventBus } from '@/utils'

// Props
const props = defineProps<{
  issue: Issue
}>()

const selectResult = () => {
  eventBus.emit('close-search-modal', {
    isOpen: false
  })
  eventBus.emit('toggle-issue-details', {
    isOpen: true,
    id: props.issue?.id
  })
}
</script>

<template>
  <div
    @click="selectResult"
    class="flex items-center py-1 px-3 rounded transition duration-100 cursor-pointer select-none hover:bg-background"
  >
    <IssueTypeIcon :issueType="props.issue.type" />
    <div class="pl-4">
      <div class="text-foreground">{{ issue.title }}</div>
      <div class="uppercase text-xs text-foreground">
        {{ `${issue.type}-${issue.id}` }}
      </div>
    </div>
  </div>
</template>

<style></style>
