import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin, defaultConfig } from '@formkit/vue'
import { useToast } from 'vue-toast-notification'
import config from '../formkit.config'

import App from './App.vue'
import router from './router'

import "vue-toast-notification/dist/theme-default.css"
// import "vue-toast-notification/dist/theme-sugar.css"
// import "vue-toast-notification/dist/theme-bootstrap.css"

const $toast = useToast({
    duration: 2000,
    position: 'top-right'
})

// toast.open({
//     message: "Hola",
//     type: "success"
// })

const app = createApp(App)

app.provide('toast',$toast) // Esto se invoca con un inject dentro de un componente. Puede ser cualqueir contenido a la derecha
app.use(createPinia())
app.use(plugin, defaultConfig(config))
app.use(router)

app.mount('#app')
