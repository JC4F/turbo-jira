<script lang="ts" setup>
import xor from 'lodash.xor'
import { computed, ref } from 'vue'
import { debounce } from 'throttle-debounce'
import { Avatar, AvatarFallback, AvatarImage, Button, Input } from '@repo/ui'
import { Search } from 'lucide-vue-next'
import { getters } from '@/stores'
import type { Filters } from '@/types'

// Reactive Variables
const projectFilters = computed(getters.filters)
const project = computed(getters.project)

const filters = ref<Filters>(projectFilters.value || {})

// Emit Event
const emit = defineEmits<{
  (e: 'change', filters: Filters): void
}>()

// Methods
const newFilter = (filter: Partial<Filters> | Function) => {
  filters.value = { ...filters.value, ...filter }
  emit('change', filters.value)
}

const handleInput = debounce(500, (newValue: string) => {
  newFilter({ searchTerm: newValue })
})

const handleUser = (id: string) => newFilter({ userIds: xor(projectFilters.value.userIds, [id]) })

const handleOnlyMe = () => newFilter({ myOnly: !projectFilters.value.myOnly })

const handleRecent = () => newFilter({ recent: !projectFilters.value.recent })

const handleReset = () =>
  newFilter({
    searchTerm: '',
    userIds: [],
    myOnly: false,
    recent: false
  })

const areFiltersCleared = computed(() => {
  return (
    !projectFilters.value.searchTerm &&
    projectFilters.value.userIds.length === 0 &&
    !projectFilters.value.myOnly &&
    !projectFilters.value.recent
  )
})
</script>

<template>
  <div class="flex items-center mt-6">
    <div class="w-40 mr-4">
      <form autocomplete="off" novalidate>
        <div class="relative w-full max-w-sm items-center">
          <Input
            id="search"
            type="text"
            placeholder="Search..."
            class="pl-10"
            :value="projectFilters.searchTerm"
            @input="handleInput"
          />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Search class="size-6 text-muted-foreground" />
          </span>
        </div>
      </form>
    </div>
    <!-- Avatars -->
    <div class="flex flex-row mr-3">
      <div
        v-for="user in project.users"
        :key="user.id"
        :class="{ active: projectFilters.userIds.includes(user.id) }"
        class="flex -ml-1 transition-transform duration-100 rounded-full lift"
      >
        <Avatar
          class="cursor-pointer select-none shadow-outline-white"
          @click.enter="handleUser(user.id)"
        >
          <AvatarImage :src="user.avatarUrl" alt="avatar" />
          <AvatarFallback>{{ user.name }}</AvatarFallback>
        </Avatar>
      </div>
    </div>
    <Button
      :isActive="projectFilters.myOnly"
      :variant="projectFilters.myOnly ? 'secondary' : 'outline'"
      @click="handleOnlyMe"
      >Only My Issues</Button
    >
    <Button
      :variant="projectFilters.recent ? 'secondary' : 'outline'"
      class="ml-3"
      @click="handleRecent"
      >Recently Updated</Button
    >
    <div class="flex items-center ml-3" v-if="!areFiltersCleared">
      <div class="self-stretch w-px mr-3 bg-foreground"></div>
      <Button variant="secondary" @click="handleReset">Clear all</Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.active {
  box-shadow: 0 0 0 4px #1255b9;
}
.lift:hover {
  transform: translateY(-5px);
}
</style>
