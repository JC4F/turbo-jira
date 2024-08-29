<script lang="ts" setup>
import { useAppStore } from '@/stores'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText
} from '@repo/ui'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot
} from 'radix-vue'
import { computed, ref } from 'vue'

const emit = defineEmits(['update:modelValues'])

defineProps<{
  modelValues: string[]
}>()

const store = useAppStore()

const project = computed(store.getProject)

const open = ref(false)
const searchTerm = ref('')

const onUpdateModelValues = (modelValues: string[]) => {
  emit('update:modelValues', modelValues)
}
</script>

<template>
  <TagsInput
    :model-value="modelValues"
    class="px-0"
    @update:modelValue="onUpdateModelValues as any"
  >
    <div class="flex gap-2 flex-wrap items-center px-3" v-if="modelValues.length > 0">
      <TagsInputItem v-for="item in modelValues" :key="item" :value="item">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
    </div>

    <ComboboxRoot
      :v-model="modelValues"
      :v-model:open="open"
      :v-model:searchTerm="searchTerm"
      class="w-full"
    >
      <ComboboxAnchor as-child>
        <ComboboxInput placeholder="Assignees..." as-child>
          <TagsInputInput
            class="w-full px-3"
            :class="modelValues.length > 0 ? 'mt-2' : ''"
            @keydown.enter.prevent
          />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent>
          <CommandList
            position="popper"
            class="w-[--radix-popper-anchor-width] z-50 rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <CommandEmpty />
            <CommandGroup>
              <CommandItem
                v-for="user in project.users"
                :key="user.id"
                :value="user.name"
                @select.prevent="
                  (ev: any) => {
                    console.log(modelValues)
                    if (typeof ev.detail.value === 'string') {
                      searchTerm = ''
                      // eslint-disable-next-line vue/no-mutating-props
                      modelValues.push(ev.detail.value)
                      onUpdateModelValues(modelValues)
                    }

                    if (project.users.length === 0) {
                      open = false
                    }
                  }
                "
              >
                <div class="flex items-center my-px mr-4">
                  <Avatar class="w-5 h-5">
                    <AvatarImage :src="user.avatarUrl" alt="avatar" />
                    <AvatarFallback>{{ user.name }}</AvatarFallback>
                  </Avatar>
                  <div class="pl-2 pr-1">
                    {{ user.name }}
                  </div>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>
