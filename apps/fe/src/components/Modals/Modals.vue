<script setup lang="ts">
import { ref } from 'vue'
import ConfirmModal from './Confirm.vue'
import IssueCreateModal from '@/components/Project/Issue/IssueCreate/IssueCreate.vue'
import IssueSearchModal from '@/components/Project/Issue/IssueSearch/IssueSearch.vue'
import IssueDetailsModal from '@/components/Project/Issue/IssueDetails/IssueDetails.vue'
import { eventBus } from '@/utils'

// Refs to track the open state of various modals
const isIssueCreateOpen = ref(false)
const isIssueSearchOpen = ref(false)
const isIssueDetailsOpen = ref(false)
const isIssueDeleteOpen = ref(false)
const isCommentDeleteOpen = ref(false)
const issueId = ref<string | undefined>(undefined)
const commentId = ref<string | undefined>(undefined)

// Event listeners using the eventBus
eventBus.on('toggle-issue-details', ({ isOpen, id }) => {
  if (isOpen) {
    issueId.value = `${id}`
  }
  isIssueDetailsOpen.value = isOpen
})

eventBus.on('toggle-issue-search', ({ isOpen }) => {
  isIssueSearchOpen.value = isOpen
})

eventBus.on('toggle-issue-create', ({ isOpen }) => {
  isIssueCreateOpen.value = isOpen
})

eventBus.on('toggle-issue-delete', ({ isOpen }) => {
  isIssueDeleteOpen.value = isOpen
})

eventBus.on('toggle-comment-delete', ({ isOpen, id }) => {
  if (isOpen) {
    commentId.value = `${id}`
  }
  isCommentDeleteOpen.value = isOpen
})

// Props for the Confirm component
const issueDeleteProps = {
  title: 'Are you sure you want to delete this issue?',
  message: "Once you delete, it's gone for good.",
  confirmText: 'Delete issue'
}

const commentDeleteProps = {
  title: 'Are you sure you want to delete this comment?',
  message: "Once you delete, it's gone for good.",
  confirmText: 'Delete comment'
}

// Methods for confirming deletion
const confirmIssueDelete = () => {
  eventBus.emit('confirm-issue-delete')
}

const confirmCommentDelete = () => {
  eventBus.emit('confirm-comment-delete', commentId.value)
}
</script>

<template>
  <div>
    <IssueCreateModal v-if="isIssueCreateOpen" @close="isIssueCreateOpen = false" />

    <IssueSearchModal v-if="isIssueSearchOpen" @close="isIssueSearchOpen = false" />

    <IssueDetailsModal
      v-if="isIssueDetailsOpen"
      @close="isIssueDetailsOpen = false"
      :issueId="issueId || ''"
    />

    <ConfirmModal
      v-if="isIssueDeleteOpen"
      v-bind="issueDeleteProps"
      @confirm="confirmIssueDelete"
      @close="isIssueDeleteOpen = false"
    />

    <ConfirmModal
      v-if="isCommentDeleteOpen"
      v-bind="commentDeleteProps"
      @confirm="confirmCommentDelete"
      @close="isCommentDeleteOpen = false"
    />
  </div>
</template>
