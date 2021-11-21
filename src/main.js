import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'
import $getAuthorizationHeader from './methods/getAuthorizationHeader'
import { formatDate, middleArray } from './methods/filters'
// createApp(App).use(router).mount('#app')
const app = createApp(App)
app.config.globalProperties.$getAuthorizationHeader = $getAuthorizationHeader
app.config.globalProperties.$filters = {
  formatDate,
  middleArray
}
app.use(VueAxios, axios)
app.use(router)

app.mount('#app')
