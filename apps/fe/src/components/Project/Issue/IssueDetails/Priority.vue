<script setup lang="ts">
import { Button } from '@repo/ui'
import { ArrowDown, ArrowUp } from 'lucide-vue-next'
import { IssuePriority, IssuePriorityCopy } from '@/types'
import { issuePriorityColors } from '@/utils'

const props = defineProps<{
  value: IssuePriority
  updateIssue: (data: { priority: IssuePriority }) => Promise<void>
}>()

const issuePriorityOptions = Object.values(IssuePriority).map((priority) => ({
  value: priority,
  label: IssuePriorityCopy[priority],
  icon: [IssuePriority.LOW, IssuePriority.LOWEST].includes(priority) ? ArrowDown : ArrowUp,
  color: issuePriorityColors[priority]
}))

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
    <j-select
      searchable
      variant="empty"
      :dropdownWidth="300"
      :value="value"
      :options="issuePriorityOptions"
      customRender
      customRenderOption
      @change="updateIssuePriority"
    >
      <template v-slot:default="{ label, icon, color }">
        <Button variant="secondary">
          <div class="flex items-center">
            <component :style="{ color }" :is="icon" />

            <div class="pr-1 pl-2">
              {{ label }}
            </div>
          </div>
        </Button>
      </template>
      <template v-slot:option="{ label, icon, color }">
        <div class="my-px mr-4 flex items-center">
          <component :style="{ color }" :is="icon" />

          <div class="pr-1 pl-2">
            {{ label }}
          </div>
        </div>
      </template>
    </j-select>
  </div>
</template>

<style></style>
