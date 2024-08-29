<script lang="ts" setup>
import { useAppStore } from '@/stores'
import type { User } from '@/types'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@repo/ui'
import Omit from 'lodash.omit'
import { computed } from 'vue'
import IssueAssignee from '../components/IssueAssignee/IssueAssignee.vue'

// Props definition
const props = defineProps({
  reporterId: {
    type: String,
    required: true
  },
  userIds: {
    type: Array as () => Array<string>,
    required: true
  },
  updateIssue: {
    type: Function,
    required: true
  }
})

const store = useAppStore()
const project = computed(store.getProject)

const userNameModels = computed(() => {
  return props.userIds
    .map(getUserById)
    .filter((item): item is User => Boolean(item))
    .map((item) => item.name)
})

const getUserById = (userId: string) =>
  Omit(
    project.value.users.find((user) => user.id === userId),
    ['__typename']
  )

const updateIssueReporter = async (userId: string) => {
  try {
    await props.updateIssue({ reporterId: userId })
  } catch (error) {
    console.error(error)
  }
}

const updateIssueAssignees = async (userNames: string[]) => {
  const userIds = userNames
    .map((name) => project.value.users.find((user) => user.name === name)?.id)
    .filter((item): item is string => Boolean(item))

  try {
    await props.updateIssue({
      userIds,
      users: userIds.map(getUserById)
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>
    <div class="mt-6 mb-1 uppercase text-foreground text-[13px] font-bold">Reporter</div>
    <Select :modelValue="reporterId" @update:modelValue="updateIssueReporter">
      <SelectTrigger>
        <SelectValue placeholder="Select a reporter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="(user, index) in project.users" :key="index" :value="user.id">
            <div class="flex items-center">
              <Avatar class="w-5 h-5">
                <AvatarImage :src="user.avatarUrl" alt="avatar" />
                <AvatarFallback>{{ user.name }}</AvatarFallback>
              </Avatar>
              <div class="ml-[0.375rem] mr-1">
                {{ user.name }}
              </div>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <!-- ASSIGNEES -->
    <div class="mt-6 mb-1 uppercase text-foreground text-[13px] font-bold">Assignees</div>
    <IssueAssignee :model-values="userNameModels" @update:model-values="updateIssueAssignees" />
  </div>
</template>

<style></style>
