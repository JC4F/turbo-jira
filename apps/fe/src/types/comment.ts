import type { User } from './user'
import type { Issue } from './issue'

export interface Comment {
  id: string
  body: string
  createdAt: Date
  updatedAt: Date
  userId: string
  issueId: string
  user: User
  issue: Issue
}
