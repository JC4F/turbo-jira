<script lang="ts" setup>
import List from '@/components/Project/Lists/List.vue'
import { updateIssueMutation } from '@/graphql/queries/issue'
import { useAppStore } from '@/stores'
import { IssueStatus } from '@/types'
import {
  calculateIssueListPosition,
  isPositionChanged,
  updateArrayItemById,
  type DropResult,
  type Target
} from '@/utils'
import { useMutation } from '@vue/apollo-composable'
import { computed, ref } from 'vue'

const store = useAppStore()

// Reactive variables
const project = computed(store.getProject)
const destination = ref<Target>()
const source = ref<Target>()

const { mutate } = useMutation(updateIssueMutation)

// Methods
const handleIssueDrop = (issueId: string, d: Target, s: Target) => {
  if (!isPositionChanged(s, d)) return

  const issueUpdateValues = {
    status: d.issueStatusZone,
    listPosition: calculateIssueListPosition(project.value.issues, d, s, issueId)
  }

  const issues = updateArrayItemById(project.value.issues, issueId, issueUpdateValues)

  const oldProjectValues = store.getProject()
  // Optimistic update
  store.setProject({
    ...project.value,
    issues
  })

  mutate({
    issueId,
    issue: issueUpdateValues
  } as any).catch((e) => {
    console.error(e)
    store.setProject(oldProjectValues)
  })
  destination.value = undefined
  source.value = undefined
}

const onDrop = (dropResult: DropResult) => {
  const { removedIndex, addedIndex, payload, to } = dropResult

  if (removedIndex === null && addedIndex === null) return

  if (removedIndex !== null) {
    source.value = {
      index: removedIndex,
      issueStatusZone: payload.status
    }
  }

  if (addedIndex !== null) {
    destination.value = {
      index: addedIndex,
      issueStatusZone: Object.values(IssueStatus)[to]
    }
  }

  if (destination.value !== undefined && source.value !== undefined) {
    handleIssueDrop(payload.id, destination.value, source.value)
  }
}
</script>

<template>
  <div class="flex mt-7">
    <List @drop="onDrop" v-for="status in IssueStatus" :key="status" :status="status"> </List>
  </div>
</template>
