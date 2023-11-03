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
            <!-- 🍻menu desplegable🍻 -->
            <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" bordered class="menudesplegable bg-primary" >
                <div class="opcionescont">
                    
                    <router-link v-for="(opcion, i) in opciones" :key="i" class="opcioncont" :to="'/' + primeraMinuscula(opcion.nombre)" >
                        <button class="opcion" onclick="pagina()">
                        <img :src="opcion.imagen" alt="Imagen" class="opcion-imagen" />
                        <div class="opcion-text">{{opcion.nombre }}</div>
                        </button>
                    </router-link>
                    
                </div>
            </q-drawer>

            <q-page-container>
                <router-view />
            </q-page-container>
        </q-layout>
    </div>
</template>
  

<style scoped>
.paleta {
  background-color:
    #3f497f
    #29a19c
    #a3f7bf
;}
* {
    margin: 0;
    padding: 0;
    font-size: large;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
        "Lucida Sans", Arial, sans-serif;
    text-align: center;
}

.menu-header {
    background-color: #3f497f;
}

.menudesplegable {
}

.opcionescont {
    height: 100%;
    padding: 30px;
    display: grid;
    grid-template-columns: 100%;
    justify-content: center;
    align-items: center;

}

.opcioncont {
    margin: 12px 0px;
}

.opcion {
    border: none;
    width: 100%;
    padding: 5px;
    display: grid;
    justify-content: center;
    transition: transform 0.1s ease;
}

.opcion:hover {
    background: #a3f7bf;
    transform: scale(1.05);
}

.opcion-imagen {
    height: 30px;
    margin: auto;
}

.opcion-text{
    text-align: center;
    margin: auto;
    font-weight: bold; 
    text-decoration: underline;
    color: black;

}

.paleta {
  background-color:
    #3f497f
    #29a19c
    #a3f7bf
;}


</style>

