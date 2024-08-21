import type { User } from './user'
import type { Issue } from './issue'

export interface Comment {
  id: number
  body: string
  createdAt: Date
  updatedAt: Date
  userId: string
  issueId: number
  user: User
  issue: Issue
}
