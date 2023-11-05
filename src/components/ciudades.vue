<script setup>
import axios from "axios";
import { ref } from "vue";
import { useCiudadStore } from "../stores/ciudad.js";

const useCiudad = useCiudadStore();

const columns = ref([
  {
    name: "Nombre",
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
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
});

const obtenerInfo = async () => {
  try {
    const ciudad = await useCiudad.obtener();
    if (ciudad) {
      console.log(ciudad);
      rows.value = ciudad;
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
      nombre: ""
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
      const response = await useCiudad.guardar(data.value);
      console.log(response);
      rows.value.push(response)
      modal.value = false
    } catch (error) {
      console.log(error);
    }
  },
  editar: async () => {
    try {
    const response = await useCiudad.editar(data.value._id, data.value);
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
    const response = await useCiudad.activar(id)
    console.log(response);
    rows.value.splice(buscarIndexLocal(response._id), 1, response)
  },
  inactivar: async(id)=>{
    const response = await useCiudad.inactivar(id)
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
          <q-toolbar-title>Agregar ciudad</q-toolbar-title>
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
          <q-btn @click="enviarInfo[estado]()">Guardar</q-btn>

          <!-- <q-btn
          >
            <q-circular-progress indeterminate color="white" />
          </q-btn> -->
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-table title="Ciudades" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:top-right="props">
          <q-tr>
            <q-td>
              <q-btn @click="opciones.agregar">➕</q-btn>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">
            <q-btn
              color="white"
              text-color="black"
              :label="props.row.estado === 1 ? '❌' : '✅'"
              @click="props.row.estado === 1 ? in_activar.inactivar(props.row._id) : in_activar.activar(props.row._id)"
            />
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
