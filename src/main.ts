import { createApp } from 'vue'
import './assets/css/index.css'
import App from './App.vue'
import router from '@/router';

const app = createApp(App)

// use router
app.use(router)
app.mount('#app')
