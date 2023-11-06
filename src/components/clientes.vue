<script setup>
import axios from "axios";
import { ref } from "vue";
import { useClienteStore } from "../stores/clientes.js";

const modelo = "Clientes";
const useCliente = useClienteStore();
const loadingTable = ref(true)
/* loadingTable.value = false */
/* :loading="loadingTable" */

const columns = ref([
  {
    name: "Nombre",
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
    sort: true,
    sortOrder: "da",
  },
  {
    name: "Cedula",
    label: "Cedula",
    align: "left",
    field: (row) => row.cedula,
  },
  {
    name: "Email",
    label: "Email",
    align: "left",
    field: (row) => row.email,
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
    field: "opciones",
  },
]);
const rows = ref([]);

const data = ref({
  nombre: "",
  cedula: "",
  email: "",
});

const obtenerInfo = async () => {
  try {
    const cliente = await useCliente.obtener();
    if (cliente) {
      console.log(cliente);
      rows.value = cliente.cliente;
      loadingTable.value = false
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
      email: "",
    };
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = {...info}
    modal.value = true;
    estado.value = "editar";
  },
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}

const enviarInfo = {
  guardar: async () => {
    try {
      const response = await useCliente.guardar(data.value);
      console.log(response);
      rows.value.push(response.cliente);
      modal.value = false;
    } catch (error) {
      console.log(error);
    }
  },
  editar: async () => {
    try {
      const response = await useCliente.editar(data.value._id, data.value);
      console.log(response);

      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      modal.value = false;
    } catch (error) {
      console.log(error);
    }
  },
};

const in_activar = {
  activar: async (id) => {
    const response = await useCliente.activar(id);
    console.log(response);
    rows.value.splice(buscarIndexLocal(response._id), 1, response);
  },
  inactivar: async (id) => {
    const response = await useCliente.inactivar(id);
    console.log(response);
    rows.value.splice(buscarIndexLocal(response._id), 1, response);
  },
};
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
          <q-input
            outlined
            v-model="data.email"
            label="Email"
            type="email"
          ></q-input>
          <q-btn @click="enviarInfo[estado]()">Guardar</q-btn>

<!--           <q-btn :color="typeform === 'agregar' ? 'primary' : 'warning'"
          @click="enviarinformacion(typeform)" v-if="boxform.estado !== 'load'">{{typeform}}</q-btn>
          
          <q-btn :color="typeform === 'agregar' ? 'primary' : 'warning'" v-if="boxform.estado == 'load'">
            <q-circular-progress indeterminate color="white"/>
          </q-btn> -->
          

          <!-- <q-btn
          >
            <q-circular-progress indeterminate color="white" />
          </q-btn> -->
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadingTable">
        <template v-slot:top-left>
          <q-tr>
            <h4 class="q-ma-xs">
              {{ modelo }}
              <q-btn @click="opciones.agregar" label="Añadir" color="secondary" >
                <q-icon name="style" color="white" right/>
              </q-btn>
            </h4>
          </q-tr>
        </template>
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">

            <q-btn
              class="botonv1"   text-size="1px" padding="10px"
              :label="props.row.estado === 1 ? 'Activo' : (
                props.row.estado === 0 ? 'No activo' :
                '‎  ‎   ‎   ‎   ‎ ')
                "
              :color="props.row.estado === 1 ? 'positive' : 'accent'"
              :loading="props.row.estado === 'load'"
              loading-indicator-size="small"
              @click="
                props.row.estado === 1
                  ? in_activar.inactivar(props.row._id)
                  : in_activar.activar(props.row._id);
                props.row.estado = 'load'"
            />

          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="warning" icon="edit"
              class="botonv1" 
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

* {
  margin: 0px;
  padding: 0px;
}

.tabla {
  margin: 10px;
  border: 3px solid black;
}

.encabezado {
  font-weight: bold;
  font-size: 15px;
}

.cosascont {
  background-color: black;
  color: white;
  text-align: center;
}

.botonv1 {
  font-size: 10px;
  font-weight: bold;
}
</style>
