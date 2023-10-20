<script setup>
import axios from "axios";
import { ref } from "vue";
import {useConductorStore} from '../stores/conductores2.js'

const modelo = "Conductores"
const useConductor = useConductorStore();

const columns = ref([
  {
    name: "Nombre",
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
    sort: true,
    sortOrder: 'da'
  },
  {
    name: "Cedula",
    label: "Cedula",
    align: "left",
    field: (row) => row.cedula,
  },
  {
    name: "Estado",
    label: "Estado",
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
  cedula: ""
});

const options = ref({
  conductor: [],
  bus: [],
});

const obtenerInfo = async () => {
  try {
    const conductor = await useConductor.obtener();
    if (conductor) {
      console.log(conductor);
      rows.value = conductor.conductor;
    } else {
      console.log("No se pudieron obtener los datos.");
    }
  } catch (error) {
    console.error(error);
  }
};

obtenerInfo();

const modal = ref(false);
function agregar() {
  modal.value = true;
}

const enviarInfo = {
  guardar: async () => {
    try {
      const response = await useConductor.guardar(data.value);
      console.log(response);
      rows.value.push(response.conductor)
      modal.value = false
    } catch (error) {
      console.log(error);
    }
  },
  editar: async () => {},
};

const activar = async (id) => {
  const response = await useConductor.activar(id);
  console.log("r", response);
  const buscar = rows.value.findIndex((r) => r._id == response.conductor._id);
  console.log(buscar);
  rows.value.splice(buscar, 1, response.conductor);
};

const inactivar = async (id) => {
  const response = await useConductor.inactivar(id);
  console.log("r", response);
  const buscar = rows.value.findIndex((r) => r._id == response.conductor._id);
  rows.value.splice(buscar, 1, response.conductor);
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
          <q-btn @click="enviarInfo.guardar()">Guardar</q-btn>

          <!-- <q-btn
          >
            <q-circular-progress indeterminate color="white" />
          </q-btn> -->
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-table :title="modelo" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:top-right="props">
          <q-tr>
            <q-td>
              <q-btn @click="agregar">➕</q-btn>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">
            <q-btn
              color="white"
              text-color="black"
              label="❌"
              @click="inactivar(props.row._id)"
              v-if="props.row.estado == 1"
            />
            <q-btn
              color="white"
              text-color="black"
              label="✅"
              @click="activar(props.row._id)"
              v-else
            />
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn
              color="white"
              text-color="black"
              label="🖋️"
              @click="Editar(props.row._id)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>
