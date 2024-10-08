<script lang="ts" setup>
import IssueTypeIcon from '@/components/shared/IssueTypeIcon/IssueTypeIcon.vue'
import TextEditor from '@/components/shared/TextEditor/TextEditor.vue'
import { createIssue, getProjectIssues } from '@/graphql/queries/issue'
import { successToast } from '@/plugins'
import { useAppStore } from '@/stores'
import {
  IssuePriority,
  IssuePriorityCopy,
  IssueStatus,
  IssueType,
  IssueTypeCopy,
  issueCreateSchema,
  type Issue,
  type IssueCreateDTO
} from '@/types'
import { issuePriorityColors } from '@/utils/colors'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@repo/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ArrowDown, ArrowUp, X } from 'lucide-vue-next'

import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import IssueAssignee from '../components/IssueAssignee/IssueAssignee.vue'

const emit = defineEmits(['close'])

const store = useAppStore()

const project = computed(store.getProject)
const currentUser = computed(store.getCurrentUser)

const defaultIssueValues: Partial<IssueCreateDTO> = {
  type: IssueType.TASK,
  title: '',
  description: '',
  reporterId: currentUser.value.id,
  userIds: [],
  priority: IssuePriority.MEDIUM,
  status: IssueStatus.BACKLOG,
  projectId: project.value.id,
  users: []
}

const loading = ref<boolean>(false)

const { mutate, loading: isMutationLoading } = useMutation(createIssue)
const { refetch: fetchProjectIssues, loading: isFetchIssuesLoading } = useQuery<{
  getProjectIssues: Issue[]
}>(getProjectIssues)

const isWorking = computed(() => loading.value && isFetchIssuesLoading && isMutationLoading)

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(issueCreateSchema),
  initialValues: defaultIssueValues
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  const issue: IssueCreateDTO = {
    ...values,
    userIds: values.userIds
      .map((name) => project.value.users.find((user) => user.name === name)?.id)
      .filter((item): item is string => Boolean(item))
  }
  try {
    await mutate({ createIssueInput: issue } as any)
    const res = await fetchProjectIssues()
    if (res?.data) {
      store.setProject({
        ...project.value,
        issues: res.data.getProjectIssues
      })
    }
    loading.value = false
    emit('close')
    successToast('Issue has been successfully created').showToast()
  } catch (error) {
    console.error(error)
    emit('close')
  }
})

const handleUpdateOpen = (value: boolean) => {
  if (!value) emit('close')
}
</script>

<template>
  <Dialog :open="true" @update:open="handleUpdateOpen">
    <DialogContent class="w-[700px] max-w-none" hide-close>
      <div class="flex items-center text-foreground">
        <div class="text-xl">Create issue</div>
        <div class="flex-auto"></div>
        <Button @click="$emit('close')" variant="outline">
          <X class="w-4 h-4" />
        </Button>
      </div>
      <form novalidate autocomplete="off" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="type">
          <FormItem>
            <FormLabel>Issue type</FormLabel>

            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an issue type to display" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="(issueType, index) in Object.values(IssueType)"
                    :key="index"
                    :value="issueType"
                  >
                    <div class="flex items-center my-px mr-4">
                      <IssueTypeIcon :issueType="issueType" class="w-4 h-4 mr-1" />
                      <div class="pl-2 pr-1">
                        {{ IssueTypeCopy[issueType] }}
                      </div>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormDescription> Start typing to get a list of possible matches. </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel>Short Summary</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Short Summary" v-bind="componentField" />
            </FormControl>
            <FormDescription>
              Concisely summarize the issue in one or two sentences
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, handleChange }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <TextEditor
                :mode="`write`"
                :value="value"
                @input="handleChange"
                class="min-h-[110px]"
              />
            </FormControl>
            <FormDescription>Describe the issue in as much detail as you'd like.</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="reporterId">
          <FormItem>
            <FormLabel>Reporter</FormLabel>

            <Select v-bind="componentField" opm>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reporter" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="(user, index) in project.users" :key="index" :value="user.id">
                    <div class="flex items-center my-px mr-4">
                      <Avatar class="w-5 h-5">
                        <AvatarImage :src="user.avatarUrl" alt="avatar" />
                        <AvatarFallback>{{ user.name }}</AvatarFallback>
                      </Avatar>
                      <div class="pl-2 pr-1">
                        {{ user.name }}
                      </div>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value }" name="userIds">
          <FormItem>
            <FormLabel>Assignees</FormLabel>
            <FormControl>
              <IssueAssignee :model-values="value" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="priority">
          <FormItem>
            <FormLabel>Priority</FormLabel>

            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="(isssuPriority, index) in Object.values(IssuePriority)"
                    :key="index"
                    :value="isssuPriority"
                  >
                    <div class="flex items-center my-px mr-4">
                      <component
                        :is="parseInt(isssuPriority) < 3 ? ArrowDown : ArrowUp"
                        class="w-4 h-4"
                        :style="{ color: issuePriorityColors[isssuPriority] }"
                      ></component>

                      <div class="pl-2 pr-1">
                        {{ IssuePriorityCopy[isssuPriority] }}
                      </div>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormDescription>Priority in relation to other issues.</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex items-center justify-end mt-5">
          <Button type="submit" :disabled="isWorking" class="ml-3">Create</Button>
          <Button @click.prevent="$emit('close')" class="ml-3" variant="secondary">Cancel</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped></style>
