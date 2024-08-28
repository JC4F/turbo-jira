<script lang="ts" setup>
import { computed } from 'vue'
import { FolderDot } from 'lucide-vue-next'
import { navLinks } from './Sidebar'
import { ProjectCategoryCopy } from '@/types'
import { getters } from '@/stores'

const props = defineProps({
  expanded: {
    type: Boolean,
    required: true
  }
})

const project = computed(getters.project)
const sidebarWidth = computed(() => (props.expanded ? 240 : 20))

// You can now return or use the variables as needed directly
</script>

<template>
  <div :style="{ width: `${sidebarWidth}px` }" class="sidebar h-full relative">
    <div class="sidebar-content px-4 bg-background">
      <div class="flex py-6 px-1 items-center">
        <FolderDot class="w-6 h-6" />
        <div class="pt-1 pl-2">
          <div class="mb-1 text-foreground font-medium">
            {{ project.name }}
          </div>
          <div class="text-foreground text-[13px]">
            {{ ProjectCategoryCopy[project.category] }} project
          </div>
        </div>
      </div>

      <div v-for="(link, index) in navLinks" :key="index">
        <component
          :is="link.to ? 'router-link' : 'div'"
          :to="link.to ? link.to : '/not-implemented'"
          exact
          exact-active-class="active"
          tag="a"
          class="link flex items-center relative py-2 px-3 rounded-sm text-foreground"
          :class="`${!link.to ? 'not-allowed' : 'allowed'}`"
        >
          <component :is="link.icon" class="mr-4 w-4 h-4" />

          <div class="pt-px">{{ link.name }}</div>
          <div
            v-if="!link.to"
            class="not-implemented bg-foreground text-background inline-block absolute rounded-sm uppercase opacity-0 text-xs font-bold"
          >
            Not implemented
          </div>
        </component>
        <div v-if="index == 1" class="mt-4 pt-4 border-t border-border"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  will-change: width;
  transition: width 300ms cubic-bezier(0.2, 0, 0, 1) 0s;
}
.sidebar-content {
  height: 100%;
  left: 0px;
  min-width: 240px;
  overflow-x: hidden;
  position: absolute;
  top: 0px;
  width: 100%;
}

.sidebar.mini {
  width: 20px;
}
.sidebar.mini .sidebar-content {
  z-index: -1;
}

.link:hover .not-implemented {
  @apply opacity-100;
}
.active {
  @apply text-foreground bg-background;
}
.allowed:hover {
  @apply bg-background;
}
.not-allowed {
  cursor: not-allowed;
}

.not-implemented {
  top: 7px;
  left: 40px;
  width: 140px;
  padding: 5px 0 5px 8px;
}
</style>
