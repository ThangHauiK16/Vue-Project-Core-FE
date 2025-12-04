import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification' 
import 'vue-toastification/dist/index.css'


import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// import axios from "axios"
// import { useLoginStore } from "@/stores/LoginStore"

// axios.interceptors.response.use(
//   res => res,
//   async err => {
//     const store = useLoginStore()

  
//     if (err.response?.status === 401 && store.refreshToken) {
         
//       try {
//         const res = await axios.post("/api/auth/refresh", {
//           refreshToken: store.refreshToken
//         })

//         const newToken = res.data.token
         
       
//         store.accessToken = newToken
//         localStorage.setItem("accessToken", newToken)

     
//         axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`

      
//         err.config.headers["Authorization"] = `Bearer ${newToken}`
       
//         return axios(err.config)

//       } catch (refreshErr) {
       
//         await store.logout()
//         return Promise.reject(err)
//       }
//     }

//     return Promise.reject(err)
//   }
// )


const app = createApp(App)

app.use(createPinia())
app.use(Toast, { position: 'bottom-right', timeout: 1500 })
app.use(router)

app.mount('#app')
