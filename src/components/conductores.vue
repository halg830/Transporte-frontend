
<script>
import axios from "axios";
import { ref } from "vue";

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

async function obtenerClientes() {
  console.log("Esperando datos");
  const clientes = await axios.get(
    "https://transporte-el2a.onrender.com/api/cliente/all"
  );

  rows.value = clientes.data.cliente;
}
obtenerClientes();

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
		<q-btn label="Añadir" color="primary" @click="toolbar = true" />
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

		<div class="q-pa-md">
			<q-markup-table>
				<thead>
					<tr>
						<th>
							<h4 class="q-ma-xs text-left">Clientes</h4>
						</th>
					</tr>
					<tr>
						<th class="text-left"><b>Nombre</b></th>
						<th class="text-right"><b>Cedula</b></th>
						<th class="text-right"><b>Email</b></th>
						<th class="text-right"><b>Estado</b></th>
						<th class="text-right"><b>Opciones</b></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in rows">
						<td class="text-left">{{ row.nombre }}</td>
						<td class="text-right">{{ row.cedula }}</td>
						<td class="text-right">{{ row.email }}</td>
						<td class="text-right">{{ row.estado }}</td>
						<td class="text-right">
							<q-btn label="Editar" color="primary" @click="editar(row)" />
						</td>
					</tr>
				</tbody>
			</q-markup-table>
		</div>
	</div>
</template>
<style scoped>
*{
	text-align: center;
}
</style>