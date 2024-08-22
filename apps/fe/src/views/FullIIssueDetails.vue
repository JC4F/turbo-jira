<script lang="ts" setup>
import { computed } from 'vue'
import IssueDetails from '@/components/Project/Issue/IssueDetails/IssueDetails.vue'
import { getters } from '@/stores'

defineProps<{
  issueId: string | number
}>()

// Computed property for project
const project = computed(getters.project)
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
