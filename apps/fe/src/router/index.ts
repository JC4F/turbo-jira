import { authenticate } from '@/auth/authenticate'
import { fetchMe } from '@/graphql/queries/auth'
import { useAppStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: 'project'
    },
    {
      path: '/project',
      meta: { requiresAuth: true },
      component: () => import('@/views/Project.vue'),
      children: [
        {
          path: '',
          name: 'board',
          component: () => import('@/views/Board.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/Settings.vue')
        },
        {
          path: 'issue/:issueId',
          name: 'issue',
          component: () => import('@/views/FullIIssueDetails.vue'),
          props: true
        }
      ]
    }
  ]
})

router.beforeEach(async (to, _, next) => {
  const store = useAppStore()

  if (to.matched.some((routeRecord) => routeRecord.meta.requiresAuth)) {
    if (!store.getIsAuthenticated()) {
      await authenticate()
      next({ name: to.name || 'root' })
    } else {
      try {
        const currentUser = await fetchMe()
        store.setCurrentUser(currentUser)
        next()
      } catch (error) {
        if (
          //@ts-ignore
          error?.message === 'Authentication token is invalid: User not found.' ||
          //@ts-ignore
          error?.message === 'Authentication token is invalid.'
        ) {
          await authenticate()
          next({ name: to.name || 'root' })
        }
      }
    }
  } else {
    next()
  }
})

export default router
