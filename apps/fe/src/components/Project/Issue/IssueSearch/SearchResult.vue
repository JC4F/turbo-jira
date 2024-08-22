<script setup lang="ts">
import type { Issue } from '@/types/issue'
import { eventBus } from '@/utils'

// Props
const props = defineProps<{
  issue: Issue
}>()

// Methods
const selectResult = () => {
  eventBus.emit('close-search-modal', {
    isOpen: false
  })
  eventBus.emit('toggle-issue-details', {
    isOpen: true,
    id: props.issue?.id
  })
}

// Expose components and methods
// const IssueDetailsComponent = IssueDetails
</script>

<template>
  <div
    @click="selectResult"
    class="flex items-center py-1 px-3 rounded transition duration-100 cursor-pointer select-none hover:bg-background"
  >
    <j-icon :size="24" class="flex-shrink-0" :name="props.issue.type"></j-icon>
    <div class="pl-4">
      <div class="text-foreground text-15">{{ issue.title }}</div>
      <div class="uppercase text-xs text-foreground">
        {{ `${issue.type}-${issue.id}` }}
      </div>
    </div>
  </div>
</template>

<style></style>
