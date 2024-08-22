<script lang="ts" setup>
import { computed } from 'vue'
import Omit from 'lodash.omit'
import { getters } from '@/stores'

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

// Computed project from store getters
const project = computed(getters.project)

// Map users to options for the dropdown
const userOptions = project.value.users.map((user) => ({
  label: user.name,
  value: user.id,
  user
}))

// Helper function to get user by ID, omitting '__typename'
const getUserById = (userId: string) =>
  Omit(
    project.value.users.find((user) => user.id === userId),
    ['__typename']
  )

// Function to update the issue's reporter
const updateIssueReporter = async (userId: string) => {
  try {
    await props.updateIssue({ reporterId: userId })
  } catch (error) {
    console.error(error)
  }
}

// Function to update the issue's assignees
const updateIssueAssignees = async (userIds: string[]) => {
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
    <div class="mt-6 mb-1 uppercase text-textMedium text-[13px] font-bold">Reporter</div>
    <j-select
      searchable
      variant="empty"
      :withClearValue="false"
      :dropdownWidth="300"
      :value="reporterId"
      :options="userOptions"
      customRender
      customRenderOption
      @change="updateIssueReporter"
    >
      <template v-slot:default="{ user }">
        <j-button variant="secondary">
          <div class="flex items-center">
            <j-avatar :size="20" :avatarUrl="user.avatarUrl" :name="user.name" />
            <div class="ml-1-5 mr-1">
              {{ user.name }}
            </div>
          </div>
        </j-button>
      </template>
      <template v-slot:option="{ user }">
        <div class="my-px mr-4 flex items-center">
          <j-avatar :size="20" :avatarUrl="user.avatarUrl" :name="user.name" />
          <div class="ml-1-5 mr-1">
            {{ user.name }}
          </div>
        </div>
      </template>
    </j-select>
    <!-- ASSIGNEES -->
    <div class="mt-6 mb-1 uppercase text-textMedium text-[13px] font-bold">Assignees</div>
    <j-select
      searchable
      variant="empty"
      isMulti
      :withClearValue="false"
      :dropdownWidth="300"
      :value="userIds"
      :options="userOptions"
      customRender
      customRenderOption
      @change="updateIssueAssignees"
    >
      <template v-slot:default="{ user, remove, optionValue }">
        <j-button variant="secondary">
          <div class="flex items-center">
            <j-avatar :size="20" :avatarUrl="user.avatarUrl" :name="user.name" />
            <div class="ml-1-5 mr-1.5">
              {{ user.name }}
            </div>
            <j-icon
              v-if="remove"
              @click="remove(optionValue)"
              class="text-textLight"
              :size="20"
              name="times"
            ></j-icon>
          </div>
        </j-button>
      </template>
      <template v-slot:option="{ user }">
        <div class="my-px mr-4 flex items-center">
          <j-avatar :size="20" :avatarUrl="user.avatarUrl" :name="user.name" />
          <div class="ml-1-5 mr-1">
            {{ user.name }}
          </div>
        </div>
      </template>
    </j-select>
  </div>
</template>

<style></style>
