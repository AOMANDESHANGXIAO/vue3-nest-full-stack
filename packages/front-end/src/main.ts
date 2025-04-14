import { createApp } from 'vue'
import './styles/common.css'
import './styles/variates.css'
import './styles/transition.css'
// import './styles/a-table.scss'
import 'virtual:uno.css'
import 'animate.css'
import App from './App.vue'
import stores from './stores'
import router from './routers'
import { library } from '@fortawesome/fontawesome-svg-core'  
import { fas } from '@fortawesome/free-solid-svg-icons'  
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'  
import { vRole } from './directives/v-role'
import { vPermissions } from './directives/v-permissions'

console.log('环境变量', import.meta.env)

declare module 'vue' {
  interface GlobalComponents {
    FontAwesomeIcon: typeof FontAwesomeIcon
  }
  interface ComponentCustomProperties {
    $permissions: (permissions: string[]) => void
    $role: (role: string) => void
  }
}

library.add(fas) 
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.directive('role', vRole)
app.directive('permissions', vPermissions)
app.use(stores).use(router).mount('#app')
