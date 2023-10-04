import buses from '../components/buses.vue'
import inicio from '../components/inicio.vue'
import rutas from '../components/rutas.vue'
import conductores from '../components/conductores.vue'
import usuarios from '../components/usuarios.vue'
import {createRouter, createWebHashHistory} from 'vue-router'

const routes =[
    {path: '/', component:inicio},
    {path: '/buses', component:buses},
    {path: '/rutas', component:rutas},
    {path: '/conductores', component:conductores},
    {path: '/usuarios', component:usuarios}
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})