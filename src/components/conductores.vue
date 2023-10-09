
<script>
import axios from "axios";
import { ref } from "vue";

//esta funcion recoje dos valores, primero la url pricipal 🎯
//segundo el tipo de accion que deseas realizar 📝
async function obtener(url, type){
  //actualizamos la informacion del objeto "informacion"
  //crearjson()

  let info
  if (type == 'cargar') {
    info = await axios.get(url+'/cargar')
    rows.value = info.data.conductor
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

let url = 'https://transporte-el2a.onrender.com/api/conductor'
/* // aqui defino los datos que seran reactivos 🧨
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
} */



const columns = ref([
  {
    name: "Nombre",
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
  },
  {
    name: "Cedula",
    label: "Cedula",
    field: (row) => row.cedula,
  },
  {
    name: "Email",
    label: "Email",
    field: (row) => row.email,
  },
  {
    name: "Estado",
    label: "Estado",
    field: (row) => row.estado,
  },
  {
    name: "Opciones",
    label: "Opciones",
    field: "actions",
  },
]);

const rows = ref([]);
const id=ref("")
const nombre = ref("");
const cedula = ref("");
const email = ref("");
const estado = ref(1)
const toolbar = ref(false);
const cambiar = ref(false);

obtener(url,'cargar')

const agregarcliente = async () => {
  

  if (cambiar.value == true) {
    const data = {
    id: id.value,
    nombre: nombre.value,
  };
    const buscar = rows.value.findIndex(r=>r._id==id.value)
    
    console.log(data);
    const cliente = await axios.put(
      `https://transporte-el2a.onrender.com/api/cliente/editar`,
      data
    ).then((response)=>{
      console.log("r", response);
      rows.value.splice(buscar, 1,response.data.cliente)
    }).catch((error)=>{
      console.log("e", error);
    })

    
  } else {
    const data = {
    nombre: nombre.value,
    cedula: cedula.value,
    email: email.value,
  };
    const cliente = await axios.post(
      "https://transporte-el2a.onrender.com/api/cliente/guardar",
      data
    );

    rows.value.push(cliente.data.cliente);
  }

  toolbar.value = false;
};

const editar = (row) => {
  console.log(row);
  toolbar.value = true;
  id.value=row._id
  cambiar.value=true
  nombre.value=row.nombre
  cedula.value=row.cedula
  email.value=row.email
  estado.value=row.estado
};

export default {
  setup() {
    return {
      toolbar,
      selected: ref([]),
      columns,
      rows,
      id,
      nombre,
      cedula,
      email,
      estado,
      agregarcliente,
      editar,
    };
  },
};
</script>

<template>
	<div>
		<q-dialog v-model="toolbar">
			<q-card>
				<q-toolbar>
					<q-avatar>
						<img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
					</q-avatar>

					<q-toolbar-title>Agregar cliente</q-toolbar-title>

					<q-btn flat round dense icon="close" v-close-popup />
				</q-toolbar>

				<q-card-section>
					<label for="">Nombre: </label><br />
					<input type="text" v-model="nombre" />
					<br />
					<label for="">Cedula: </label><br />
					<input type="number" v-model="cedula" />
					<br />
					<label for="">Email: </label><br />
					<input type="text" v-model="email" /><br />
					<label for="">Estado: </label><br />
					<input type="number" v-model="estado" /><br />
					<button @click="agregarcliente()">Enviar</button>
				</q-card-section>
			</q-card>
		</q-dialog>

		
			<q-markup-table>
				<thead>
					<tr>
						<th colspan="
            
            5">
							<h4 class="q-ma-xs text-left">conductores
                <q-btn label="Añadir" color="green" @click="toolbar = true" />
              </h4>
						</th>
					</tr>
					<tr class="cosascont">
						<th class="text-center">Nombre</th>
						<th class="text-center">Cedula</th>
						<th class="text-center">Email</th>
						<th class="text-center">Estado</th>
						<th class="text-center">Opciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in rows">
						<td class="text-center">{{ row.nombre }}</td>
						<td class="text-center">{{ row.cedula }}</td>
						<td class="text-center">{{ row.email }}</td>
						<td class="text-center">{{ row.estado }}</td>
						<td class="text-center">
							<q-btn label="Editar" color="primary" @click="editar(row)" />
						</td>
					</tr>
				</tbody>
			</q-markup-table>
		</div>

</template>
<style scoped>
*{
	margin: 0px;
  padding: 0px;
}

.cosascont{
  background-color: black;
  color: white;
  text-align: center;
}
</style>