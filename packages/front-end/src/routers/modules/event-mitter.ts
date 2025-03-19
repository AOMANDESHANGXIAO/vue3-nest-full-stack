import mitt from 'mitt'
import type { Router } from 'vue-router'

type Events = {
  noAuth: Router
  logout: Router
}
const routerMitter = mitt<Events>()

routerMitter.on('noAuth', (router: Router) => {
  router.push('/auth/login')
})

routerMitter.on('logout', (router: Router) => {
 router.push('/auth/login') 
})

export default routerMitter
