import { useAppStore } from '@/stores'
import type { Role } from '@/types'
import { apolloClient } from '../graphql/client'
import { fetchMe, login } from '../graphql/queries/auth'
import { storeAuthToken } from '../utils/authToken'

type LoginResponse = {
  login: {
    access_token: string
    email: string
    role: Role
  }
}

export const authenticate = async () => {
  const store = useAppStore()

  try {
    const result = await apolloClient.mutate<LoginResponse>({
      mutation: login,
      variables: {
        loginAuthInput: {
          email: import.meta.env.VITE_TEST_ACCOUNT_IN_DB
        }
      }
    })
    const {
      login: { access_token: authToken }
    } = result.data!
    storeAuthToken(authToken)
    store.setIsAuthenticated(true)
    const currentUser = await fetchMe()
    store.setCurrentUser(currentUser)
  } catch (error) {
    // toast.error(error);
    console.error(error)
  }
}
