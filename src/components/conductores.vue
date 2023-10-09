
<script setup>
import axios from "axios";
import { ref } from "vue";

//esta funcion recoje dos valores, primero la url pricipal 🎯
//segundo el tipo de accion que deseas realizar 📝
async function obtener(url, type, id =''){
  //actualizamos la informacion del objeto "informacion"
  //crearjson()
  let info
  if (type == 'cargar') {
    info = await axios.get(url+'/cargar')
    rows.value = info.data.conductor
  } 
  if (type == 'buscar') {
    info = await axios.get(url+'/buscarID/'+id)
  }
  if (type == 'agregar') {
    info = await axios.post(url+'/agregar', informacion)
    obtener(url,'cargar')
  }
  if (type == 'eliminar') {
    info = await axios.delete(url+'/eliminar/'+id)
    obtener(url,'cargar')
  }
  if (type == 'editar'){
    info = await axios.put(url+'/modificar/'+id, informacion)
    obtener(url,'cargar')
  }
  if (type == 'activar') {
    info = await axios.put(url+'/activar/'+id)
    obtener(url,'cargar')
  }
  if (type == 'desactivar') {
    info = await axios.put(url+'/desactivar/'+id)
    obtener(url,'cargar')
  }
  //aqui muestra la respuesta del server en la consola 🛠
  console.log(info.data)
}

let url = 'https://transporte-el2a.onrender.com/api/conductor'
// aqui defino los datos que seran reactivos 🧨
let nombreform = ref('')
let cedulaform = ref('')
let estadoform = ref('')
let typeform = ref('- - -')
let rows = ref([]);

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
const boxform = ref(true);

obtener(url,'cargar')

function form(type, data = ''){
  typeform.value = type
  boxform.value = true
  if (type == 'agregar'){

  }
}

</script>

<template>
	<div>

		<q-dialog v-model="boxform">
			<q-card>
				<q-toolbar>
					<q-toolbar-title>Agregar cliente</q-toolbar-title>
					<q-btn class="botonv1" flat round dense icon="close" v-close-popup />
				</q-toolbar>

				<q-card-section class="q-gutter-md">
          <q-input outlined v-model="nombreform" label="Nombre"></q-input>
          <q-input outlined v-model="cedulaform" label="Cedula" :readonly="true"></q-input>
          <q-input outlined v-model="estadoform" label="Estado" :readonly="true"></q-input>
					<q-btn :color="typeform === 'agregar' ? 'primary' : 'warning'">{{typeform}}</q-btn>
				</q-card-section>
			</q-card>
		</q-dialog>

		
			<q-markup-table class="tabla">
				<thead>
					<tr>
						<th colspan="5">
							<h4 class="q-ma-xs text-left">
                conductores
                <q-btn class="q-ml-xs" label="Añadir" color="accent" @click="form('agregar')">
                  <q-icon name="style" color="white" right/>
                </q-btn>
              </h4>
						</th>
					</tr>
					<tr class="cosascont ">
						<th class="text-center encabezado">Nombre</th>
						<th class="text-center encabezado">Cedula</th>
						<th class="text-center encabezado">Estado</th>
						<th class="text-center encabezado">Opciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in rows" :key="row.id">
						<td class="text-center">{{ row.nombre }}</td>
						<td class="text-center">{{ row.cedula }}</td>
						<td class="text-center">
              <q-btn class="botonv1" label="activo"
              color="positive" v-if="row.estado == true"
              @click="obtener(url,'desactivar',row._id);row.estado = 'load'"/>

              <q-btn class="botonv1" label="no activo"
              color="negative" v-if="row.estado == false"
              @click="obtener(url,'activar',row._id);row.estado = 'load'"/>

              <q-btn class="botonv1" label=""
              color="grey" v-if="row.estado == 'load'">
                <q-circular-progress indeterminate color="white"/>
              </q-btn>
            </td>
						<td class="text-center">
              <q-btn-group>
                <q-btn color="negative" icon="delete" class="botonv1"
                @click="obtener(url,'eliminar',row._id)"/>

                <q-btn color="warning" icon="edit" class="botonv1"
                @click="form('editar',row)"/>
              </q-btn-group>
						</td>
					</tr>
				</tbody>
			</q-markup-table>
		</div>

</template>
<style scoped>
/* 
primary: Color principal del tema.
secondary: Color secundario del tema.
accent: Color de acento.
positive: Color para indicar una acción positiva o éxito.
negative: Color para indicar una acción negativa o error.
info: Color para información o mensajes neutrales.
warning: Color para advertencias o mensajes importantes. 
*/
*{
	margin: 0px;
  padding: 0px;
}

.tabla{
  margin: 10px;
  border: 3px solid black;
}

.encabezado{
  font-weight: bold;
  font-size: 15px;
}

.cosascont{
  background-color: black;
  color: white;
  text-align: center;
}

.botonv1{
  font-size: 10px;
  font-weight: bold;
}

</style>