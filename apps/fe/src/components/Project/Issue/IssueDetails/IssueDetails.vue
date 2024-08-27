<script lang="ts" setup>
import { ref, computed, onUnmounted, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { Button, Dialog, DialogContent } from '@repo/ui'
import { Clipboard, Expand, Trash, X } from 'lucide-vue-next'
import Comment from './Comment.vue'
import IssueDescription from './Description.vue'
import IssueTitle from './Title.vue'
import IssueType from './Type.vue'
import IssueStatus from './Status.vue'
import IssueAssigneesReporter from './AssigneesReporter.vue'
import IssuePriority from './Priority.vue'
import IssueLoader from '@/components/Project/IssueLoader.vue'
import {
  getIssueWithUsersAndComments,
  deleteIssue,
  getProjectIssues,
  updateIssueMutation
} from '@/graphql/queries/issue'
import type { Issue } from '@/types/issue'
import { useClipboard } from '@/hooks/useClipboard'
import { formatDateTimeConversational } from '@/utils/date'
import { getters, mutations } from '@/stores'
import { eventBus, sortByNewest, updateArrayItemById } from '@/utils'
import { deleteComment } from '@/graphql/queries/comment'

const emit = defineEmits(['close'])

// Define props
const props = defineProps<{
  issueId: string
  withCloseButton?: boolean
  withFullScreenButton?: boolean
}>()

// Component imports
defineComponent({
  components: {
    IssueLoader,
    Comment,
    IssueDescription,
    IssueTitle,
    IssueType,
    IssueStatus,
    IssueAssigneesReporter,
    IssuePriority
  }
})

// Reactive references
const issueCopy = ref<Issue>()
// const isDeleteConfirmOpen = ref<boolean>(false)

// Computed properties
const project = computed(getters.project)
const currentUser = computed(getters.currentUser)
const commentsSorted = computed(() => {
  if (!issueCopy.value) {
    return []
  }
  return sortByNewest(issueCopy.value.comments, 'createdAt')
})

// Vue Router
const router = useRouter()
const route = useRoute()

// Apollo queries and mutations
const {
  onResult,
  // loading,
  refetch: refetchIssue
} = useQuery<{
  getIssueWithUsersAndComments: Issue
}>(getIssueWithUsersAndComments, {
  id: props.issueId
})

onResult((res) => {
  if (res && res?.data && !res?.loading) {
    issueCopy.value = res.data.getIssueWithUsersAndComments
  }
})

const { mutate: mutateIssue } = useMutation<{
  updateIssue: Issue
}>(updateIssueMutation)

const { mutate } = useMutation<{ deleteIssue: boolean }>(deleteIssue)
const { refetch: fetchProjectIssues } = useQuery<{
  getProjectIssues: Issue[]
}>(getProjectIssues)

const { mutate: deleteMutation } = useMutation(deleteComment)

// Clipboard handling
const [, setClipboard] = useClipboard()

const copyIssueLink = async () => {
  const path =
    window.location.origin +
    router.resolve({
      name: 'issue',
      params: { issueId: `${props.issueId}` }
    }).href

  await setClipboard(path)
}

// Event handlers
const goFullScreen = () => {
  router.push({
    name: 'issue',
    params: { issueId: `${props.issueId}` }
  })
  emit('close')
}

const handleUpdateIssue = async (fields: Partial<Issue>) => {
  issueCopy.value = { ...issueCopy.value, ...fields } as Issue

  mutations.setProject({
    ...project.value,
    issues: updateArrayItemById(project.value.issues, props.issueId as string, fields)
  })
  await mutateIssue({
    issueId: props.issueId,
    issue: { ...fields }
  } as any)
  await refetchIssue()
}

// Issue and Comment Deletion
const triggerIssueDelete = () => {
  eventBus.emit('toggle-issue-delete', {
    isOpen: true,
    id: props.issueId
  })
}

const deleteIssueHandler = async () => {
  await mutate({ issueId: props.issueId } as any)
  const res = await fetchProjectIssues()
  if (res?.data) {
    mutations.setProject({
      ...project.value,
      issues: res?.data.getProjectIssues
    })
  }
  eventBus.emit('toggle-issue-delete', {
    isOpen: false,
    id: props.issueId
  })
  eventBus.emit('toggle-issue-details', {
    isOpen: false,
    id: props.issueId
  })
  eventBus.emit('toggle-issue-search', {
    isOpen: false,
    id: props.issueId
  })
  if (route.name !== 'board') {
    router.replace({ name: 'board' })
  }
}

const triggeCommentDelete = (id: string) => {
  eventBus.emit('toggle-comment-delete', {
    isOpen: true,
    id
  })
}

const deleteCommentHandler = async (id: string) => {
  await deleteMutation({ removeCommentId: `${id}` } as any)
  await refetchIssue()
  eventBus.emit('toggle-comment-delete', {
    isOpen: false,
    id
  })
}

// Event listeners
eventBus.on('confirm-issue-delete', deleteIssueHandler)
eventBus.on('confirm-comment-delete', deleteCommentHandler)

onUnmounted(() => {
  eventBus.off('confirm-issue-delete', deleteIssueHandler)
  eventBus.off('confirm-comment-delete', deleteCommentHandler)
})

const handleUpdateOpen = (value: boolean) => {
  if (!value) emit('close')
}
</script>

<template>
  <Dialog :open="true" @update:open="handleUpdateOpen">
    <DialogContent class="w-[700px]">
      <IssueLoader v-if="!issueCopy" />
      <div class="w-full h-full" v-else>
        <div class="flex items-center px-3 pt-4 text-foreground">
          <!-- Type -->
          <IssueType
            :updateIssue="handleUpdateIssue"
            :issueId="issueCopy.id"
            :value="issueCopy.type"
          />
          <div class="flex-auto"></div>
          <Button icon="feedback" variant="outline">Give Feedback</Button>
          <Button @click="copyIssueLink" variant="outline">
            <Clipboard class="h-4 w-4 xl:mr-2" />
            <span class="hidden xl:inline">Copy Link</span>
          </Button>
          <Button @click="triggerIssueDelete" variant="outline">
            <Trash class="h-4 w-4" />
            <span class="hidden xl:inline">Delete</span>
          </Button>
          <Button v-if="withFullScreenButton" @click="goFullScreen" variant="outline">
            <Expand class="h-4 w-4" />
          </Button>
          <Button v-if="withCloseButton" @click="$emit('close')" variant="outline">
            <X class="h-4 w-4" />
          </Button>
        </div>
        <div class="flex w-full flex-wrap pb-16 px-7">
          <!-- LEFT SECTION -->
          <div class="sm:w-full md:w-7/12 lg:w-4/6 pr-10">
            <!-- Title -->
            <IssueTitle :updateIssue="handleUpdateIssue" :value="issueCopy.title" />
            <!-- Description -->
            <IssueDescription
              :updateIssue="handleUpdateIssue"
              :initialValue="issueCopy.description ?? ''"
            />
            <!-- Comments -->
            <div class="pt-10">
              <div class="font-medium text-15">Comments</div>
              <Comment
                :refetchIssue="refetchIssue"
                isCreate
                :comment="
                  {
                    user: currentUser,
                    body: 'Add a comment...',
                    issueId: issueId as any
                  } as any
                "
              />
              <Comment
                @delete="triggeCommentDelete"
                :refetchIssue="refetchIssue"
                :comment="comment"
                v-for="comment in commentsSorted"
                :key="comment.id"
              />
            </div>
          </div>
          <!-- RIGHT SECTION -->
          <div class="sm:w-full md:w-5/12 lg:w-2/6 pt-1">
            <!-- STATUS -->
            <IssueStatus :updateIssue="handleUpdateIssue" :value="issueCopy.status" />
            <!-- AssigneesReporter -->
            <IssueAssigneesReporter
              :reporterId="issueCopy.reporterId"
              :userIds="issueCopy.userIds"
              :updateIssue="handleUpdateIssue"
            />
            <!-- PRIORITY -->
            <IssuePriority :value="issueCopy.priority" :updateIssue="handleUpdateIssue" />
            <!-- DATES -->
            <div class="mt-3 pt-3 leading-loose border-t border-border text-foreground text-[13px]">
              <div>Created - {{ formatDateTimeConversational(issueCopy.createdAt) }}</div>
              <div>Updated - {{ formatDateTimeConversational(issueCopy.updatedAt) }}</div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>
.formField {
  @apply mt-5;
}
.sep {
  @apply mt-5 border border-background;
}
.formFieldLabel {
  @apply block pb-[0.3125rem] text-foreground text-[13px] font-medium;
}
.formFieldTip {
  @apply pt-[0.375rem] text-foreground text-[13px];
}
</style>

<style lang="scss" scoped>
.error {
  position: absolute;
  right: 0;
  top: 0;
  padding: 2px 10px;
  background: #f53b57;
  color: white;
  font-size: 12px;
  border-bottom-left-radius: 3px;
  border-top-right-radius: 3px;
}
</style>
