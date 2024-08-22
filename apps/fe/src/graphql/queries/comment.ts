import { gql } from '@apollo/client/core'

export const createComment = gql`
  mutation CreateComment($createCommentInput: CreateCommentInput!) {
    createComment(createCommentInput: $createCommentInput) {
      id
      body
      issueId
      userId
      createdAt
      updatedAt
    }
  }
`

export const deleteComment = gql`
  mutation RemoveComment($removeCommentId: Int!) {
    removeComment(id: $removeCommentId) {
      body
    }
  }
`
export const updateComment = gql`
  mutation UpdateComment($updateCommentInput: UpdateCommentInput!) {
    updateComment(updateCommentInput: $updateCommentInput) {
      body
    }
  }
`
