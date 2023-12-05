import App from "./App.vue";
import { createApp } from "vue";
import "./style.css";
import { createPinia } from "pinia";
import { router } from "./routes/routes.js";
import { Quasar, Dialog, Notify } from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";
import axios from "axios";

// axios.defaults.baseURL = "http://localhost:3000/api/";
axios.defaults.baseURL = "https://transporte-el2a.onrender.com/api/";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(Quasar, {
  plugins: { Dialog, Notify },
  config: {
    notify: {}/* look at QuasarConfOptions from the API card */
  }
});

app.mount("#app");
