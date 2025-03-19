import { createApp } from 'vue'
import './styles/common.css'
import './styles/variates.css'
import './styles/transition.css'
import 'virtual:uno.css'
import 'animate.css'
import App from './App.vue'
import stores from './stores'
import router from './routers'
import { library } from '@fortawesome/fontawesome-svg-core'  
import { fas } from '@fortawesome/free-solid-svg-icons'  
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'  

console.log('环境变量', import.meta.env)

library.add(fas) 
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(stores).use(router).mount('#app')
