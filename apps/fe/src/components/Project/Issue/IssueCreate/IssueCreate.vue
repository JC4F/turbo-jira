<script lang="ts" setup>
import IssueTypeIcon from '@/components/shared/issue-type-icon/issue-type-icon.vue'
import { createIssue, getProjectIssues } from '@/graphql/queries/issue'
import { successToast } from '@/plugins'
import { getters, mutations } from '@/stores'
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
  SelectValue,
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText
} from '@repo/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ArrowDown, ArrowUp, X } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'

const emit = defineEmits(['close'])

const project = computed(getters.project)
const currentUser = computed(getters.currentUser)

const defaultIssueValues: Partial<IssueCreateDTO> = {
  type: IssueType.TASK,
  title: '',
  description: '',
  reporterId: currentUser.value.id,
  userIds: [],
  priority: IssuePriority.MEDIUM,
  status: IssueStatus.BACKLOG,
  projectId: project.value.id
  // users: values.userIds.map(getUserById)
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
    ...values
  }
  try {
    await mutate({ createIssueInput: issue } as any)
    const res = await fetchProjectIssues()
    if (res?.data) {
      mutations.setProject({
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
    <DialogContent class="w-[700px]" hide-close>
      <div class="flex items-center text-foreground">
        <div class="text-xl">Create issue</div>
        <div class="flex-auto"></div>
        <Button @click="$emit('close')" variant="outline">
          <X class="w-4 h-4" />
        </Button>
      </div>
      <form novalidate autocomplete="off" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="issuetype">
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

        <div class="sep"></div>

        <FormField v-slot="{ componentField }" name="summary">
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

        <FormField v-slot="{ field }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <j-text-editor :mode="`write`" v-bind="field" class="min-h-[110px]" />
            </FormControl>
            <FormDescription>Describe the issue in as much detail as you'd like.</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="reporter">
          <FormItem>
            <FormLabel>Reporter</FormLabel>

            <Select v-bind="componentField">
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
              <TagsInput :model-value="value">
                <TagsInputItem v-for="item in value" :key="item" :value="item">
                  <TagsInputItemText />
                  <TagsInputItemDelete />
                </TagsInputItem>

                <TagsInputInput placeholder="Assignees..." />
              </TagsInput>
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

        <div class="flex items-center justify-end formField">
          <Button type="submit" :disabled="isWorking" class="ml-3">Create</Button>
          <Button @click.prevent="$emit('close')" class="ml-3" variant="secondary">Cancel</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>
.formField {
  margin-top: 20px;
}
.sep {
  margin-top: 20px;
  background-color: rgb(244 245 247);
}
.formFieldLabel {
  display: block;
  padding-bottom: 5px;
  color: rgb(94 108 132);
  font-size: 13px;
  font-weight: 500;
}
.formFieldTip {
  padding-top: 6px;
  color: rgb(94 108 132);
  font-size: 13px;
}

.descriptionEditor .ql-editor {
  min-height: 110px;
}
</style>
