<script setup lang="ts">
import { useAppStore } from '@/stores'
import { eventBus } from '@/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui'
import { Aperture, HelpCircle, Plus, Search } from 'lucide-vue-next'
import { computed } from 'vue'

const store = useAppStore()

const currentUser = computed(store.getCurrentUser)

const items = [
  {
    icon: Search,
    tooltip: 'Search issue',
    handler: () => {
      eventBus.emit('toggle-issue-search', {
        isOpen: true
      })
    }
  },
  {
    icon: Plus,
    tooltip: 'Create issue',
    handler: () => {
      eventBus.emit('toggle-issue-create', {
        isOpen: true
      })
    }
  }
]
</script>

<template>
  <aside class="navbarLeft">
    <div class="h-screen w-navbarLeft pt-6 pb-5 flex flex-col bg-secondary flex-shrink-0">
      <div class="relative pb-2 flex items-center justify-center">
        <Aperture class="w-7 h-7" />
      </div>

      <div
        v-for="(item, index) in items"
        :key="index"
        class="relative w-full flex items-center justify-center min-h-[42px]"
      >
        <div
          @click="item.handler"
          v-tippy="item.tooltip"
          class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 select-none transition-colors duration-100 cursor-pointer hover:bg-card"
        >
          <component :is="item.icon" />
        </div>
      </div>
      <div class="flex-auto"></div>
      <div class="relative w-full flex items-center justify-center min-h-[42px]">
        <div
          v-tippy="currentUser.name"
          class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 select-none transition-colors duration-100 cursor-pointer hover:bg-card"
        >
          <Avatar>
            <AvatarImage :src="currentUser.avatarUrl" alt="avatar" />
            <AvatarFallback>{{ currentUser.name }}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div class="relative w-full flex items-center justify-center min-h-[42px]">
        <div
          v-tippy="`About`"
          class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 select-none transition-colors duration-100 cursor-pointer"
        >
          <HelpCircle />
        </div>
      </div>
    </div>
  </aside>
</template>
