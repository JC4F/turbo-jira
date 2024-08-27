<script setup lang="ts">
import IssueTypeIcon from '@/components/shared/issue-type-icon/issue-type-icon.vue'
import { IssueType, IssueTypeCopy } from '@/types/issue'

const props = defineProps<{
  value: IssueType
  issueId: string
  updateIssue: (data: { type: IssueType }) => Promise<void>
}>()

const updateIssueType = async (type: IssueType) => {
  try {
    await props.updateIssue({ type })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <Select :modelValue="value" @update:modelValue="updateIssueType as any">
    <SelectTrigger>
      <SelectValue placeholder="Select a status" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-for="type in Object.values(IssueType)" :key="type" :value="type">
          <div class="pr-1 pl-2 flex items-center">
            <IssueTypeIcon :issueType="value" />

            <div class="text-15 pr-1 pl-2">
              {{ IssueTypeCopy[type] }}
            </div>
          </div>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<style></style>
