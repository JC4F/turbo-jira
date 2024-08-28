<script setup lang="ts">
import { IssueStatus, IssueStatusCopy } from '@/types/issue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@repo/ui'

const props = defineProps<{
  value: IssueStatus
  updateIssue: (data: { status: IssueStatus }) => Promise<void>
}>()

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
    <Select :modelValue="value" @update:modelValue="updateIssueStatus as any">
      <SelectTrigger>
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="status in Object.values(IssueStatus)" :key="status" :value="status">
            <div class="flex items-center pr-1 pl-2">
              <div class="pr-1 pl-2">
                {{ IssueStatusCopy[status] }}
              </div>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<style></style>
