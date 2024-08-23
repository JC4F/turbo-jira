<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import List from '@/components/Project/Lists/List.vue'
import { IssueStatus } from '@/types'
import { getters, mutations } from '@/stores'
import {
  type DropResult,
  type Target,
  calculateIssueListPosition,
  isPositionChanged,
  updateArrayItemById
} from '@/utils'
import { updateIssueMutation } from '@/graphql/queries/issue'

// Reactive variables
const project = computed(getters.project)
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

  const oldProjectValues = getters.project()
  // Optimistic update
  mutations.setProject({
    ...project.value,
    issues
  })

  mutate({
    issueId,
    issue: issueUpdateValues
  } as any).catch((e) => {
    console.error(e)
    mutations.setProject(oldProjectValues)
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
  <div class="container flex mt-7">
    <List @drop="onDrop" v-for="status in IssueStatus" :key="status" :status="status"> </List>
  </div>
</template>
