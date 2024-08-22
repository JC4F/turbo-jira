import { gql } from '@apollo/client/core'

export const getProjectWithUsersAndIssues = gql`
  {
    getProjectWithUsersAndIssues {
      id
      name
      url
      description
      category
      createdAt
      updatedAt
      users {
        id
        name
        avatarUrl
        projectId
      }
      issues {
        id
        title
        description
        type
        status
        priority
        listPosition
        createdAt
        updatedAt
        userIds
      }
    }
  }
`

export const updateProject = gql`
  mutation CreateIssue($updateProjectInput: UpdateProjectInput!) {
    updateProject(updateProjectInput: $updateProjectInput) {
      id
    }
  }
`
