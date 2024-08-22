<script setup lang="ts">
import { IssueStatusCopy, IssueStatus } from '@/types/issue'
import { issueStatusVariants } from '@/utils/colors'

const props = defineProps<{
  value: IssueStatus
  updateIssue: (data: { status: IssueStatus }) => Promise<void>
}>()

const issueStatusOptions = Object.values(IssueStatus).map((status) => ({
  value: status,
  label: IssueStatusCopy[status]
}))

const updateIssueStatus = async (status: IssueStatus) => {
  try {
    await props.updateIssue({ status })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>
    <div class="mt-6 mb-1 uppercase text-foreground text-[13px] font-bold">status</div>
    <j-select
      searchable
      variant="empty"
      :dropdownWidth="300"
      :withClearValue="false"
      :options="issueStatusOptions"
      :value="value"
      @change="updateIssueStatus"
      customRender
      customRenderOption
    >
      <template v-slot:default="{ label }">
        <j-button
          class="uppercase text-foreground text-[13px]"
          :variant="issueStatusVariants[value]"
        >
          {{ label }}
        </j-button>
      </template>
      <template v-slot:option="{ label }">
        <div class="flex items-center pr-1 pl-2">
          <div class="text-15 pr-1 pl-2">
            {{ label }}
          </div>
        </div>
      </template>
    </j-select>
  </div>
</template>

<style></style>
