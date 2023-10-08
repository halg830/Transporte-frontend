<script setup>
import { ref } from 'vue';
import axios from 'axios'

//http://localhost:3000/api/conductor/cargar

async function obtener(url, type){
  let r
  if (type == 'cargar') {
    r = await axios.get(url+'/cargar')
  } 
  if (type == 'buscar') {
    r = await axios.get(url+'/buscarID/'+id.value)
  }
  if (type == 'agregar') {}
  console.log(r.data)
}


let id = ref('64dea3538d308b1fa1431deb')
let nombre = ref('')
let cedula = ref('')
let estado = ref('')
let casilla = ref('http://localhost:3000/api/conductor')
let casilla2 = ref('http://localhost:3000/api/conductor/buscarId')

</script>
<template>
<div class="cont">COMFIGURACIONES</div>
<input class="npc input1" v-model="casilla">
<button @click="obtener(casilla, 'cargar')" class="npc">cargar</button>
<button @click="obtener(casilla, 'buscar')" class="npc">buscar</button>
<button @click="obtener(casilla, 'agregar')" class="npc">agregar</button>
<button @click="obtener(casilla, 'eliminar')" class="npc">eliminar</button>
<button @click="obtener(casilla, 'editar')" class="npc">editar</button>
<p>ID:</p>
<input class="npc input1" v-model="id" placeholder="ID">
<p>nombre:</p>
<input class="npc input1" v-model="nombre" placeholder="nombre">
<p>cedula:</p>
<input class="npc input1" v-model="cedula" placeholder="cedula">
<p>estado:</p>
<input class="npc input1" v-model="estado" placeholder="estado">
</template>

<!-- scoped sirve para evitar que los estilos afecte a los
demas componentes  -->
<style scoped>
*{
  font-size: large;
  font-weight: bold;
  font-family:Verdana, Geneva, Tahoma, sans-serif;
}

p{
  margin-top: 20px;
}
.cont {
  color: rgb(69, 255, 125);
}
.npc{
  padding: 10px;
  margin: 5px;
}

.input1{
  font-size: 12px;
  width: 90vw;
  max-width: 500px;
}
</style>