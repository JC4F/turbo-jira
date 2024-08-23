import { gql } from '@apollo/client/core'

export const getIssueWithUsersAndComments = gql`
  query getIssue($id: String!) {
    getIssueWithUsersAndComments(issueId: $id) {
      id
      title
      description
      type
      status
      priority
      reporterId
      listPosition
      createdAt
      updatedAt
      userIds
      comments {
        id
        body
        updatedAt
        issueId
        userId
        createdAt
        user {
          id
          name
          avatarUrl
        }
      }
    }
  }
`

export const getProjectIssues = gql`
  query getProjectIssues($searchTerm: String) {
    getProjectIssues(searchTerm: $searchTerm) {
      id
      title
      description
      type
      reporterId
      status
      priority
      listPosition
      createdAt
      updatedAt
      userIds
    }
  }
`

export const createIssue = gql`
  mutation CreateIssue($createIssueInput: CreateIssueInput!) {
    createIssue(createIssueInput: $createIssueInput) {
      id
      title
      type
      reporterId
      status
      createdAt
      updatedAt
    }
  }
`

export const updateIssueMutation = gql`
  mutation updateIssue($issueId: String!, $issue: UpdateIssueInput!) {
    updateIssue(id: $issueId, updateIssueInput: $issue) {
      id
      title
      description
      type
      reporterId
      status
      priority
      listPosition
      createdAt
      updatedAt
      userIds
    }
  }
`

export const deleteIssue = gql`
  mutation deleteIssue($issueId: Float!) {
    deleteIssue(id: $issueId)
  }
`
