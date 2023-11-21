import login from "../components/login.vue";
import home from "../components/home.vue";
import menu from "../components/menu.vue";
import buses from "../components/buses.vue";
import ciudad from "../components/ciudades.vue";
import cliente from "../components/clientes.vue";
import rutas from "../components/rutas.vue";
import conductores from "../components/conductores.vue";
import tiquete from "../components/tiquete.vue";
import ventas from "../components/ventas.vue";
import vendedor from "../components/vendedor.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const isAuthenticated = () => {
    const token = localStorage.getItem("x-token")

    if(token) return true

  return false;
};

// Guardia de navegación para verificar la autenticación
const authGuard = (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    next();
  }
};

const routes = [
  { path: "/", component: login },
  {
    path: "/home",
    meta: { requiresAuth: true },
    beforeEnter: authGuard,
    component: home,
    children: [
      { path: "", redirect: "/menu" },
      { path: "/menu", component: menu },
      { path: "/buses", component: buses },
      { path: "/ciudades", component: ciudad },
      { path: "/clientes", component: cliente },
      { path: "/rutas", component: rutas },
      { path: "/conductores", component: conductores },
      { path: "/tiquetes", component: tiquete },
      { path: "/ventas", component: ventas },
      { path: "/vendedores", component: vendedor },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
