<script setup lang="ts">
import { Button } from '@repo/ui'
import IssueTypeIcon from '@/components/shared/issue-type-icon/issue-type-icon.vue'
import { IssueType, IssueTypeCopy } from '@/types/issue'

const props = defineProps<{
  value: IssueType
  issueId: string
  updateIssue: (data: { type: IssueType }) => Promise<void>
}>()

const issueTypeOptions = Object.values(IssueType).map((type) => ({
  value: type,
  label: IssueTypeCopy[type],
  icon: IssueTypeCopy[type].toLowerCase()
}))

const updateIssueType = async (type: IssueType) => {
  try {
    await props.updateIssue({ type })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <j-select
    searchable
    variant="empty"
    :dropdownWidth="150"
    :withClearValue="false"
    :options="issueTypeOptions"
    :value="value"
    @change="updateIssueType"
    customRender
    customRenderOption
  >
    <template v-slot:default="{ label, value }">
      <Button class="uppercase text-foreground text-[13px]" variant="outline">
        <IssueTypeIcon :issueType="value" />
        {{ `${label}-${issueId}` }}
      </Button>
    </template>
    <template v-slot:option="{ label, value }">
      <div class="pr-1 pl-2 flex items-center">
        <IssueTypeIcon :issueType="value" />

        <div class="text-15 pr-1 pl-2">
          {{ label }}
        </div>
      </div>
    </template>
  </j-select>
</template>

<style></style>
