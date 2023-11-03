<script setup>
const opciones = [
    { nombre: "Buses", imagen: "./src/assets/bus.png" },
    { nombre: "Ciudades", imagen: "./src/assets/ciudad.png" },
    { nombre: "Clientes", imagen: "./src/assets/clientes.png" },
    { nombre: "Conductores", imagen: "./src/assets/conductores.png" },
    { nombre: "Rutas", imagen: "./src/assets/ruta.png" },
    { nombre: "Tiquetes", imagen: "./src/assets/tiquetes.png" },
    { nombre: "Ventas", imagen: "./src/assets/ventas.png" },
    { nombre: "Vendedores", imagen: "./src/assets/vendedores.png" }
];
const primeraMayuscula = (cadena) =>
  cadena.charAt(0).toUpperCase() + cadena.slice(1);

const primeraMinuscula = (cadena) => cadena.charAt(0).toLowerCase() + cadena.slice(1);
</script>


<template>
<div class="opcionescont">
                    
  <router-link v-for="(opcion, i) in opciones" :key="i" class="opcioncont" :to="'/' + primeraMinuscula(opcion.nombre)" >
    <button class="opcion" onclick="pagina()">
      <div class="opcion-text">{{opcion.nombre }}</div>
      <img :src="opcion.imagen" alt="Imagen" class="opcion-imagen" />
    </button>
  </router-link>
                    
</div>


</template>

<style scoped>

.opcionescont {
    padding: 30px;
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


.card__content {
  background: ;
  border-radius: 17px;
  width: 100%;
  height: 100%;
}


</style>