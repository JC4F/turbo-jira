<script lang="ts" setup>
import IssueDetails from '@/components/Project/Issue/IssueDetails/IssueDetails.vue'
import { useAppStore } from '@/stores'
import { computed } from 'vue'

defineProps<{
  issueId: string
}>()

const store = useAppStore()

// Computed property for project
const project = computed(store.getProject)
</script>

<template>
  <div class="pr-6 py-8 pl-10 flex flex-col h-full w-full">
    <j-breadcrumbs :items="['Projects', project.name, 'Issues', issueId]" />
    <IssueDetails
      :issueId="issueId"
      :withFullScreenButton="false"
      :withCloseButton="false"
      class="full-issue-details mt-5"
    />
  </div>
</template>

<style lang="scss">
.full-issue-details {
  max-width: 987px;
}
</style>
