<script lang="ts" setup>
import IssueComponent from '@/components/Project/Issue/Issue.vue'
import { useAppStore } from '@/stores'
import { IssueStatus, IssueStatusCopy, type Issue } from '@/types'
import type { Filters } from '@/types/filters'
import { getSortedListIssues, type DropResult } from '@/utils'
import dayjs from 'dayjs'
import { computed, defineEmits, defineProps } from 'vue'
import { Container, Draggable } from 'vue3-smooth-dnd'

// Props
const props = defineProps<{
  status: IssueStatus
}>()

// Emits
const emit = defineEmits<{
  (e: 'drop', payload: DropResult): void
}>()

const store = useAppStore()

// Computed properties
const project = computed(store.getProject)
const filters = computed(store.getFilters)
const currentUserId = computed(() => store.getCurrentUser().id)

const filterIssues = (projectIssues: Array<Issue>, filters: Filters, currentUserId: string) => {
  const { searchTerm, userIds, myOnly, recent } = filters

  let issues = [...(projectIssues || [])]

  if (searchTerm) {
    issues = issues.filter((issue) => issue.title.toLowerCase().includes(searchTerm.toLowerCase()))
  }
  if (userIds.length > 0) {
    issues = issues.filter(
      (issue) =>
        [issue.userIds, userIds].reduce((a, b) => a.filter((c) => b.includes(c))).length > 0
    )
  }
  if (myOnly && currentUserId) {
    issues = issues.filter((issue) => issue.userIds.includes(currentUserId))
  }
  if (recent) {
    issues = issues.filter((issue) => dayjs(issue.updatedAt).isAfter(dayjs().subtract(3, 'day')))
  }
  return issues
}

const filteredIssues = computed(() =>
  filterIssues(project.value.issues, filters.value, currentUserId.value)
)
const filteredListIssues = computed(() => getSortedListIssues(filteredIssues.value, props.status))

const allListIssues = computed(() => getSortedListIssues(project.value.issues, props.status))

const formattedIssuesCount = computed(() => {
  if (allListIssues.value.length !== filteredListIssues.value.length) {
    return `${filteredListIssues.value.length} of ${allListIssues.value.length}`
  }
  return allListIssues.value.length
})

const dropPlaceholderOptions = {
  className: 'drop-preview',
  animationDuration: '150',
  showOnTop: true
}

const onDrop = (dropResult: DropResult) => {
  const arr = Object.values(IssueStatus)
  const to = arr.indexOf(props.status)
  emit('drop', { ...dropResult, to })
}

const getCardPayload = (index: number) => {
  const issuesByStatus = getSortedListIssues(filteredListIssues.value, props.status)
  return issuesByStatus[index]
}
</script>

<template>
  <div class="list mr-2 flex flex-col rounded-sm bg-secondary flex-shrink-0">
    <div class="px-3 pt-3 pb-4 uppercase truncate text-foreground text-[13px]">
      {{ IssueStatusCopy[status] }}
      <span class="lowercase text-[13px]">{{ formattedIssuesCount }}</span>
    </div>
    <div class="h-full px-2">
      <Container
        class="h-full"
        group-name="board"
        @drop="onDrop"
        drag-class="card-ghost"
        drop-class="card-ghost-drop"
        :get-child-payload="getCardPayload"
        :drop-placeholder="dropPlaceholderOptions"
      >
        <Draggable v-for="(issue, index) in filteredListIssues" :key="issue.id">
          <IssueComponent :issue="issue" :index="index" />
        </Draggable>
      </Container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list {
  width: calc(100% / 4 - 8px);
  min-height: 400px;
  min-width: 200px;
}
</style>

<style lang="scss">
.drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 5px;
}
.card-ghost {
  transition: transform 0.18s ease;
  transform: rotateZ(5deg);
}
.card-ghost-drop {
  transition: transform 0.18s ease-in-out;
  transform: rotateZ(0deg);
}
</style>
