import { gql } from '@apollo/client/core'
import { apolloClient } from '../client'
import type { User } from '@/types'

export const createGuestAccount = gql`
  query createGuestAccount {
    createGuestAccount
  }
`

export const currentUser = gql`
  query currentUser {
    currentUser {
      id
      name
      avatarUrl
    }
  }
`

export const login = gql`
  mutation Login($loginAuthInput: LoginAuthInput!) {
    login(LoginAuthInput: $loginAuthInput) {
      access_token
      email
      role
    }
  }
`

export const fetchMe = async (): Promise<User> => {
  try {
    const res = await apolloClient.query<{ currentUser: User }>({
      query: currentUser
    })
    return Promise.resolve(res.data.currentUser)
  } catch (error) {
    return Promise.reject(error)
  }
}
