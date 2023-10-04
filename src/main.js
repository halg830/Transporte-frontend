import App from './App.vue'
import { createApp } from 'vue'
import './style.css'
import { router } from "./routes/routes.js";

const app = createApp(App)

app.use(router)

app.mount('#app')
