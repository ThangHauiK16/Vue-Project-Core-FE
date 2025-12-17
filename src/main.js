import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification' 
import 'vue-toastification/dist/index.css'


import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { useLoginStore } from './stores/LoginStore'


const app = createApp(App)

app.use(createPinia())
app.use(Toast, { position: 'bottom-right', timeout: 1500 })

const loginStore = useLoginStore()
if (!sessionStorage.getItem('browser_alive')) {
    loginStore.logout()
}

sessionStorage.setItem('browser_alive', '1')
loginStore.init()


app.use(router)



app.mount('#app')
