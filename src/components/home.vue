<script setup>
import { ref } from "vue";

const opciones = [
    { nombre: "Menu", imagen: "./src/assets/menu.png" },
    { nombre: "Buses", imagen: "./src/assets/bus.png" },
    { nombre: "Ciudades", imagen: "./src/assets/ciudad.png" },
    { nombre: "Clientes", imagen: "./src/assets/clientes.png" },
    { nombre: "Conductores", imagen: "./src/assets/conductores.png" },
    { nombre: "Rutas", imagen: "./src/assets/ruta.png" },
    { nombre: "Tiquetes", imagen: "./src/assets/tiquetes.png" },
    { nombre: "Vendedores", imagen: "./src/assets/vendedores.png" }
];

const ocultar = ref(true);

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}

const opcionesConImagenes = opciones;

const primeraMinuscula = (cadena) => cadena.charAt(0).toLowerCase() + cadena.slice(1);
</script>



<template>
    <div>
        <q-layout view="lHr lpR lFr">
            <q-header elevated class="bg-primary text-white menu-header">
                <q-toolbar>
                    <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

                    <q-toolbar-title>
                        <q-avatar>
                            <div>
                                <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
                            </div>
                        </q-avatar>
                        EMPRESA DE BUSES
                    </q-toolbar-title>
                </q-toolbar>
            </q-header>

            <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" bordered class="menudesplegable">
                <div class="opcionescont">
                    <p class="menutitle">= Menú Desplegable =</p>
                    <div v-for="(opcion, i) in opciones" :key="i" class="opcion-container">
                        <router-link :to="'/' + primeraMinuscula(opcion.nombre)" class="opcioncont">
                            <img :src="opcion.imagen" alt="Imagen" class="imagen" />
                            <div class="opcion-text">{{opcion.nombre }}</div>
                        </router-link>
                    </div>
                </div>
            </q-drawer>

            <q-page-container>
                <router-view />
            </q-page-container>
        </q-layout>
    </div>
</template>
  

<style scoped>
* {
    margin: 0;
    padding: 0;
    font-size: large;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
        "Lucida Sans", Arial, sans-serif;
    text-align: center;
}

.opcion-button {
    display: inline-block;
    padding: 8px 16px;
    background-color: #0078d4;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    margin: 5px;
}

.opcion-button:hover {
    background-color: #005a9e;
}

.imagen {
    height: 30px;
}

.menudesplegable {
    border: solid 2px black;
}

.menutitle {
    font-size: 25px;
    text-align: center;
    font-weight: bold;
    margin: 30px 0px;
    align-items: center;
}

.opcionescont {
    background-color: white;
    padding: 10px;
    display: grid;
    grid-column: 100%;
    justify-content: left;
}

.opcion {
    width: 100%;
    padding: 5px;
}

.opcioncont {
    margin: 20px;
}

* {
    margin: 0;
    padding: 0;
    font-size: large;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
        "Lucida Sans", Arial, sans-serif;
    text-align: center;
}

.opcion-button {
    display: inline-block;
    padding: 8px 16px;
    background-color: #0078d4;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    margin: 5px;
}

.opcion-button:hover {
    background-color: #005a9e;
}

.imagen {
    height: 30px;
}

.menudesplegable {
    border: solid 2px black;
}

.menutitle {
    font-size: 25px;
    text-align: center;
    font-weight: bold;
    margin: 30px 0px;
}

.opcionescont {
    background-color: white;
    padding: 10px;
    display: grid;
    grid-column: 100%;
    justify-content: left;
}

.opcion-text {
    margin-left: 10px; 
    font-weight: bold; 
    color: black;
}

.opcioncont {
    margin: 20px;
}
</style>

