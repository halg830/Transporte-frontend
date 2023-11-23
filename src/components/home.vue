<script setup>
import { ref } from "vue";
import imgMenu from '../assets/menu.png'
import imgBuses from '../assets/buses.png'
import imgCiudades from '../assets/ciudades.png'
import imgClientes from '../assets/clientes.png'
import imgConductores from '../assets/conductores.png'
import imgRutas from '../assets/rutas.png'
import imgTiquetes from '../assets/tiquetes.png'
import imgVentas from '../assets/ventas.png'
import imgVendedores from '../assets/vendedores.png'
import {useRouter} from 'vue-router'
import Cookies from 'js-cookie'

const router = useRouter()

const opciones = [
    { nombre: "Menu", imagen: imgMenu },
    { nombre: "Buses", imagen: imgBuses },
    { nombre: "Ciudades", imagen: imgCiudades },
    { nombre: "Clientes", imagen: imgClientes },
    { nombre: "Conductores", imagen: imgConductores },
    { nombre: "Rutas", imagen: imgRutas },
    { nombre: "Tiquetes", imagen: imgTiquetes },
    { nombre: "Ventas", imagen: imgVentas },
    { nombre: "Vendedores", imagen: imgVendedores }
];

const ocultar = ref(true);

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}

const opcionesConImagenes = opciones;

const primeraMinuscula = (cadena) => cadena.charAt(0).toLowerCase() + cadena.slice(1);

function cerrarCesion(){
    Cookies.remove('x-token');
    Cookies.remove('vendedor');
    router.push("/")
}
</script>



<template>
    <div>
        <q-layout view="lHr lpR lFr">
            <q-header elevated class="bg-primary text-white menu-header">
                <q-toolbar>
                    <q-btn dense flat icon="menu" @click="toggleLeftDrawer" />

                    <q-toolbar-title>
                        EMPRESA DE BUSES
                    </q-toolbar-title>
                    <q-btn dense flat @click="cerrarCesion">
                        <q-icon size="md" name="logout" color="white" right/>
                    </q-btn>
                    
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
.imagencerrar{
    width: 30px;
}
.menu-header {
    background-color: #3f497f;
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

