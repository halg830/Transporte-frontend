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


const opciones = [
  { nombre: "Buses", imagen: imgBuses },
  { nombre: "Ciudades", imagen: imgCiudades },
  { nombre: "Clientes", imagen: imgClientes },
  { nombre: "Conductores", imagen: imgConductores },
  { nombre: "Rutas", imagen: imgRutas },
  { nombre: "Tiquetes", imagen: imgTiquetes },
  { nombre: "Ventas", imagen: imgVentas },
  { nombre: "Vendedores", imagen: imgVendedores }
];
const primeraMayuscula = (cadena) =>
  cadena.charAt(0).toUpperCase() + cadena.slice(1);

const primeraMinuscula = (cadena) => cadena.charAt(0).toLowerCase() + cadena.slice(1);
</script>


<template>
  <div class="opcionescont">
    <router-link v-for="(opcion, i) in opciones" :key="i" class="opcioncont" :to="'/' + primeraMinuscula(opcion.nombre)">
      <button class="opcion" @click="pagina()">
        <div class="opcion-text">{{ opcion.nombre }}</div>
        <img :src="opcion.imagen" alt="Imagen" class="opcion-imagen" />
      </button>
    </router-link>
  </div>
</template>

<style scoped>
.opcionescont {
  padding: 30px;
  display: block;
}

.opcioncont {
  margin: 12px 10px;
  width: 300px;
  min-width: 200px;
  height: 200px;
  display: inline-block;
}

.opcion {
  border: none;
  width: 100%;
  height: 100%;
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
  height: 100px;
  margin: auto;
}

.opcion-text {
  font-size: 25px;
  text-align: center;
  margin: auto;
  font-weight: bold;
  text-decoration: underline;
  color: black;
}

.paleta {
  background-color: #3f497f #29a19c #a3f7bf;
}
</style>

