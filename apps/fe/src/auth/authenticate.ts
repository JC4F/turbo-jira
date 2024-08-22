import { fetchMe, login } from '../graphql/queries/auth'
import { apolloClient } from '../graphql/client'
import { storeAuthToken } from '../utils/authToken'
import { mutations } from '@/stores'
import type { Role } from '@/types'

type LoginResponse = {
  login: {
    access_token: string
    email: string
    role: Role
  }
}

export const authenticate = async () => {
  try {
    const result = await apolloClient.mutate<LoginResponse>({
      mutation: login,
      variables: {
        loginAuthInput: {
          userId: '1d5732be-1dea-447e-b389-cc9b7e08a359'
        }
      }
    })
    const {
      login: { access_token: authToken }
    } = result.data!
    storeAuthToken(authToken)
    mutations.setIsAuthenticated(true)
    const currentUser = await fetchMe()
    mutations.setCurrentUser(currentUser)
  } catch (error) {
    // toast.error(error);
    console.error(error)
  }
}
