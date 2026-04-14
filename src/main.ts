import Layout from '@/components/Layout/index.vue'
import router from '@/router'
import '@/styles/global.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

// 使用插件
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 全局组件
app.component('Layout', Layout)

app.mount('#app')
