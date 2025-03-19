import { createRouter, createWebHashHistory } from 'vue-router'
//@ts-ignore
import { routes } from 'vue-router/auto-routes'
import { useUserStore } from '@/stores/modules/use-user-store'
import { message } from 'ant-design-vue'
import routerMitter from './modules/event-mitter'

console.log('routes\n', routes)

const getRedirectRoutes = () => {
  return [
    {
      path: '/',
      redirect: () => {
        const { isAuthenticated } = useUserStore()
        if (isAuthenticated) {
          return '/home'
        } else {
          return '/auth/login'
        }
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ]
}

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...routes, ...getRedirectRoutes()],
})
// TODO: 有时间重构，根据权限来判断
router.beforeEach((to, _, next) => {
  if (to.path === '/auth/login' || to.path === '/auth/register') {
    next()
    return
  }
  const userStore = useUserStore()
  if (!userStore.isAuthenticated) {
    next({ path: '/auth/login' })
    message.info('请先登录')
  } else {
    next()
  }
})
export { routes, routerMitter }
export default router
