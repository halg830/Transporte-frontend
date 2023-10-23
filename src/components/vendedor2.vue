<script setup>
import axios from "axios";
import { ref } from "vue";
import {useVendedorStore} from '../stores/vendedor2.js'

const modelo = "Vendedor"
const useVendedor = useVendedorStore();

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
    name: "Apellido",
    label: "Apellido",
    align: "left",
    field: (row) => row.apellido,
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
    name: "Teléfono",
    label: "Teléfono",
    align: "left",
    field: (row) => row.telefono,
  },
  {
    name: "Usuario",
    label: "Usuario",
    align: "left",
    field: (row) => row.usuario,
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
  apellido: "",
  cedula: "",
  telefono: "",
  usuario: "",
  contrasena: ""
});

const obtenerInfo = async () => {
  try {
    const vendedor = await useVendedor.obtener();
    if (vendedor) {
      console.log(vendedor);
      rows.value = vendedor.vendedor;
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
      const response = await useVendedor.guardar(data.value);
      console.log(response);
      rows.value.push(response.vendedor)
      modal.value = false
    } catch (error) {
      console.log(error);
    }
  },
  editar: async () => {
    try {
        console.log(data.value);
    const response = await useVendedor.editar(data.value._id, data.value);
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
    const response = await useVendedor.activar(id)
    console.log(response);
    rows.value.splice(buscarIndexLocal(response._id), 1, response)
  },
  inactivar: async(id)=>{
    const response = await useVendedor.inactivar(id)
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
            v-model="data.apellido"
            label="Apellido"
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
            v-model="data.telefono"
            label="Teléfono"
            type="Number"
          ></q-input>
          <q-input
            outlined
            v-model="data.usuario"
            label="Usuario"
            type="text"
          ></q-input>
          <q-input
            outlined
            v-model="data.contrasena"
            label="Contraseña"
            type="password"
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
      <q-table :title="modelo" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:top-right>
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
