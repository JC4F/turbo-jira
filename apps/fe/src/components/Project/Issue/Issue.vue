<script setup lang="ts">
import IssueTypeIcon from '@/components/shared/IssueTypeIcon/IssueTypeIcon.vue'
import { useAppStore } from '@/stores'
import { IssuePriority, type Issue } from '@/types/issue'
import { issuePriorityColors } from '@/utils/colors'
import { eventBus } from '@/utils/eventBus'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui'
import { ArrowDown, ArrowUp } from 'lucide-vue-next'
import { computed } from 'vue'

// Props
const props = defineProps<{
  issue: Issue
  index: number
}>()

const store = useAppStore()

// Computed properties
const project = computed(store.getProject)
const assignees = computed(() =>
  props.issue.userIds.map((userId) => project.value.users.find((user) => user.id === userId))
)

const issuePriorityStyles = computed(() => ({
  icon: [IssuePriority.LOW, IssuePriority.LOWEST].includes(props.issue.priority)
    ? ArrowDown
    : ArrowUp,
  color: issuePriorityColors[props.issue.priority]
}))

// Methods
const openIssueDetails = () => {
  eventBus.emit('toggle-issue-details', {
    isOpen: true,
    id: props.issue.id
  })
}
</script>

<template>
  <div class="issue-wrap">
    <div
      @click="openIssueDetails"
      class="issue rounded-sm bg-white transition-all duration-100 select-none hover:bg-background"
    >
      <p class="pb-3 text-foreground">
        {{ issue.title }}
      </p>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <IssueTypeIcon :issueType="issue.type" class="mr-1 text-foreground" />

          <component
            :is="issuePriorityStyles.icon"
            :style="{ color: issuePriorityStyles.color }"
            class="h-4 w-4"
          />
        </div>
        <div class="flex flex-row-reverse ml-1">
          <Avatar class="-ml-1 shadow" v-for="user in assignees" :key="user?.id">
            <AvatarImage :src="user?.avatarUrl || ''" alt="avatar" />
            <AvatarFallback>{{ user?.name }}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.issue-wrap {
  touch-action: manipulation;
  cursor: grab;
  margin-bottom: 5px;
}
.issue {
  padding: 10px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 2px 0px;
}
</style>
