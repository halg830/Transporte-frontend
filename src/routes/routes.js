import login from "../components/login.vue"
import home from '../components/home.vue'
import menu from '../components/menu.vue'
import buses from '../components/buses2.vue'
import ciudad from '../components/ciudades2.vue'
import inicio from '../components/inicio.vue'
import rutas from '../components/rutas.vue'
import conductores from '../components/conductores2.vue'
import usuarios from '../components/usuarios.vue'
import tiquete from '../components/tiquete.vue'
import {createRouter, createWebHashHistory} from 'vue-router'

const routes =[
    {path: '/', component:login},
    {path: '/home', component: home, children:[
        {path: "", redirect: "/menu"},
        {path: "/menu", component:menu},
        {path: '/inicio', component:inicio},
        {path: '/buses', component:buses},
        {path: '/ciudades', component:ciudad},
        {path: '/rutas', component:rutas},
        {path: '/conductores', component:conductores},
        {path: '/usuarios', component:usuarios},
        {path: '/tiquete', component:tiquete}
    ] }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})