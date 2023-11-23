import { createRouter, createWebHashHistory } from "vue-router";
import Cookies from "js-cookie";
import axios from "axios";

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

const isAuthenticated = () => {
  const token = Cookies.get("x-token");

  if (token) return true;

  return false;
};

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
      { path: "/menu",  meta: { requiresAuth: true },
      beforeEnter: authGuard, component: menu },
      { path: "/buses",  meta: { requiresAuth: true },
      beforeEnter: authGuard, component: buses },
      { path: "/ciudades",  meta: { requiresAuth: true },
      beforeEnter: authGuard, component: ciudad },
      { path: "/clientes",  meta: { requiresAuth: true },
      beforeEnter: authGuard, component: cliente },
      { path: "/rutas",  meta: { requiresAuth: true },
      beforeEnter: authGuard, component: rutas },
      { path: "/conductores",  meta: { requiresAuth: true },
      beforeEnter: authGuard, component: conductores },
      { path: "/tiquetes",  meta: { requiresAuth: true },
      beforeEnter: authGuard, component: tiquete },
      { path: "/ventas",  meta: { requiresAuth: true },
      beforeEnter: authGuard, component: ventas },
      { path: "/vendedores",  meta: { requiresAuth: true },
    beforeEnter: authGuard, component: vendedor },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
