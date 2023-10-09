import App from './App.vue'
import { createApp } from 'vue'
import './style.css'

import { router } from "./routes/routes.js";
import { Quasar, Dialog } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const app = createApp(App)

app.use(router)
app.use(Quasar, {
    plugins:{Dialog}
})

app.mount('#app')