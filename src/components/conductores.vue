<script setup>
import axios from "axios";
import { ref } from "vue";
import {useConductorStore} from '../stores/conductores.js'

const modelo = "Conductores"
const useConductor = useConductorStore();

const columns = ref([
  {
    name: "Nombre",
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
    sortable: true,
    sortOrder: 'da'
  },
  {
    name: "Cedula",
    label: "Cedula",
    align: "center",
    field: (row) => row.cedula,
  },
  {
    name: "Estado",
    label: "Estado",
    align: "center",
    field: (row) => row.estado,
  },
  {
    name: "opciones",
    label: "Opciones",
    align: "center",
    field: "opciones",
  },
]);
const rows = ref([]);

const data = ref({
  nombre: "",
  cedula: ""
});

const obtenerInfo = async () => {
  try {
    const conductor = await useConductor.obtener();
    if (conductor) {
      console.log(conductor);
      rows.value = conductor;
    } else {
      console.log("No se pudieron obtener los datos.");
    }
  } catch (error) {
    console.error(error);
  }
};

obtenerInfo();

const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    data.value = {
      nombre: "",
      cedula: "",
      email: ""
    };
    modal.value = true;
    estado.value="guardar";
  },
  editar: (info) => {
    data.value = info;
    modal.value = true;
    estado.value="editar";
  },
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}

const enviarInfo = {
  guardar: async () => {
    try {
      const response = await useConductor.guardar(data.value);
      console.log(response.conductor);
      rows.value.push(response.conductor)
      modal.value = false
    } catch (error) {
      console.log(error);
    }
  },
  editar: async () => {
    try {
    const response = await useConductor.editar(data.value._id, data.value);
      console.log(response);

      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      modal.value = false
    } catch (error) {
      console.log(error);
    }
  },
};

const in_activar={
  activar: async(id)=>{
    const response = await useConductor.activar(id)
    console.log(response);
    rows.value.splice(buscarIndexLocal(response._id), 1, response)
  },
  inactivar: async(id)=>{
    const response = await useConductor.inactivar(id)
    console.log(response);
    rows.value.splice(buscarIndexLocal(response._id), 1, response)
  }
}
</script>

<template>
  <div>
    <q-dialog v-model="modal">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <div class="text-negative">{{ errorform }}</div>

          <q-input
            outlined
            v-model="data.nombre"
            label="Nombre"
            type="text"
          ></q-input>
          <q-input
            outlined
            v-model="data.cedula"
            label="Cedula"
            type="number"
          ></q-input>
          <q-btn @click="enviarInfo[estado]()">Guardar</q-btn>

          <!-- <q-btn
          >
            <q-circular-progress indeterminate color="white" />
          </q-btn> -->
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-btn>prueba</q-btn>

    <div class="q-pa-md">
      <q-table :title="modelo" :rows="rows" :columns="columns" row-key="name" table-header-class="encabezado" table-class="tabla">
        <template v-slot:top-right>
          <q-tr>
            <q-td>
              <q-btn @click="opciones.agregar">➕</q-btn>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">

            <q-btn class="botonv1" label="Activo"
              color="positive" v-if="props.row.estado === 1"
              @click="in_activar.inactivar(props.row._id);props.row.estado = 'load'"/>

            <q-btn class="botonv1" label="No activo"
              color="accent" v-if="props.row.estado === 0"
              @click="in_activar.activar(props.row._id);props.row.estado = 'load'"/>

            <q-btn class="botonv1" label=""
              color="grey" v-if="props.row.estado === 'load'">
                <q-circular-progress indeterminate color="white"/>
              </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn
              color="white"
              text-color="black"
              label="🖋️"
              @click="opciones.editar(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
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
../stores/conductores.js