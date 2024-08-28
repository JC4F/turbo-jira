<script setup lang="ts">
import { IssuePriority, IssuePriorityCopy } from '@/types'
import { issuePriorityColors } from '@/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@repo/ui'
import { ArrowDown, ArrowUp } from 'lucide-vue-next'

const props = defineProps<{
  value: IssuePriority
  updateIssue: (data: { priority: IssuePriority }) => Promise<void>
}>()

const updateIssuePriority = async (priority: IssuePriority) => {
  try {
    await props.updateIssue({ priority })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>
    <div class="mt-6 mb-1 uppercase text-foreground text-[13px] font-bold">Priority</div>
    <Select :modelValue="value" @update:modelValue="updateIssuePriority as any">
      <SelectTrigger>
        <SelectValue placeholder="Select a priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            v-for="priority in Object.values(IssuePriority)"
            :key="priority"
            :value="priority"
          >
            <div class="my-px mr-4 flex items-center">
              <component
                :style="{ color: issuePriorityColors[priority] }"
                :is="
                  [IssuePriority.LOW, IssuePriority.LOWEST].includes(priority) ? ArrowDown : ArrowUp
                "
              />

              <div class="pr-1 pl-2">
                {{ IssuePriorityCopy[priority] }}
              </div>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<style></style>
