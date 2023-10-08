<script setup>
import { ref } from 'vue';
import axios from 'axios'


//esta funcion recoje dos valores, primero la url pricipal 🎯
//segundo el tipo de accion que deseas realizar 📝
async function obtener(url, type){
  //actualizamos la informacion del objeto "informacion"
  crearjson()

  let info
  if (type == 'cargar') {
    info = await axios.get(url+'/cargar')
  } 
  if (type == 'buscar') {
    info = await axios.get(url+'/buscarID/'+id.value)
  }
  if (type == 'agregar') {
    info = await axios.post(url+'/agregar', informacion)
  }
  if (type == 'eliminar') {
    info = await axios.delete(url+'/eliminar/'+id.value)
  }
  if (type == 'editar'){
    info = await axios.put(url+'/modificar/'+id.value, informacion)
  }
  if (type == 'activar') {
    info = await axios.put(url+'/activar/'+id.value)
  }
  if (type == 'desactivar') {
    info = await axios.put(url+'/desactivar/'+id.value)
  }

  //aqui muestra la respuesta del server en la consola 🛠
  console.log(info)
  console.log(info.data)
}

// aqui defino los datos que seran reactivos 🧨
let id = ref('6522bc173dd6de6d0c2d6dd5')
let nombre = ref('')
let cedula = ref('')
let estado = ref('')
let casilla = ref('http://localhost:3000/api/conductor')

//IMPORTANTE❗❗ aqui hay que agregar en "informacion"
//todos los datos que queremos enviar al back-end 🍁
//la funcion se llamara cada que se ejecute "optener()"
let informacion
function crearjson(){
  informacion = {
      nombre:nombre.value,
      cedula:cedula.value
    }
}

</script>
<template>
<div class="cont">COMFIGURACIONES</div>

<!-- esta casilla debe contener la ruta principal 🎯 -->
<input class="npc input1" v-model="casilla"> 

<!-- botones con todas las formas de ejecutar mi funcion 🔑🔓 -->
<button @click="obtener(casilla, 'cargar')" class="npc">cargar</button>
<button @click="obtener(casilla, 'buscar')" class="npc">buscar</button>
<button @click="obtener(casilla, 'agregar')" class="npc">agregar</button>
<button @click="obtener(casilla, 'eliminar')" class="npc">eliminar</button>
<button @click="obtener(casilla, 'editar')" class="npc">editar</button>
<button @click="obtener(casilla, 'activar')" class="npc">activar</button>
<button @click="obtener(casilla, 'desactivar')" class="npc">desactivar</button>

<!-- campos que algunas peticiones nesecitan para hacerse 🎲 -->
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