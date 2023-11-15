<script setup>
import axios from "axios";
import { ref } from "vue";
import { useClienteStore } from "../stores/clientes.js";
import { useQuasar } from 'quasar'

const modelo = "Clientes";
const useCliente = useClienteStore();
const loadingTable = ref(true)
const $q = useQuasar()
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
    data.value = { ...info }
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
      if(response.error){
        notificar('negative', response.error)
        return
      }

      rows.value.push(response.cliente);
      notificar('positive', 'Guardado exitosamente')
      modal.value = false;
    } catch (error) {
      console.log(error);
    }
  },
  editar: async () => {
    try {
      const response = await useCliente.editar(data.value._id, data.value);
      console.log(response);
      if(response.error){
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      notificar('positive', 'Editado exitosamente')
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

function validarCampos() {

  const arrData = Object.entries(data.value)
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
    if (d[1] === null) {
      notificar('negative', "Por favor complete todos los campos")
      return
    }
    if (d[1].trim() === "") {
      notificar('negative', "Por favor complete todos los campos")
      return
    }

    if (d[0] === "nombre" && d[1].length > 15) {
      notificar('negative', 'El nombre no puede tener más de 15 caracteres')
      return
    }

    if (d[0] === "cedula" && d[1].toString().length < 8) {
      notificar('negative', "La cedula debe tener más de 8 digitos")
      return
    }

    if (d[0] === "email" && !d[1].includes('@')) {
      notificar('negative', 'Email no válido')
      return
    }
  }
  enviarInfo[estado.value]()
}

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top"
  })
}
</script>

<template>
  <div>
    <q-dialog v-model="modal">
      <q-card class="hola">
        <q-toolbar>
          <q-toolbar-title>Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-input class="input1" outlined v-model="data.nombre" label="Nombre" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un nombre']"></q-input>
          <q-input class="input2" outlined v-model="data.cedula" label="Cedula" type="number" :disable="estado === 'editar'" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese una cedula', val => val.length < 11 || 'Cedula debe tener 10 o menos carácteres']"></q-input>
          <q-input class="input3" outlined v-model="data.email" label="Email" type="email" :disable="estado==='editar'" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un email']"></q-input>
          <q-btn class="boton" @click="validarCampos">Guardar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadingTable">
        <template v-slot:top-left>
          <q-tr>
            <h4 class="q-ma-xs">
              {{ modelo }}
              <q-btn @click="opciones.agregar" label="Añadir" color="secondary">
                <q-icon name="style" color="white" right />
              </q-btn>
            </h4>
          </q-tr>
        </template>
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">

            <q-btn class="botonv1" text-size="1px" padding="10px" :label="props.row.estado === 1 ? 'Activo' : (
              props.row.estado === 0 ? 'No activo' :
                '‎  ‎   ‎   ‎   ‎ ')
              " :color="props.row.estado === 1 ? 'positive' : 'accent'" :loading="props.row.estado === 'load'"
              loading-indicator-size="small" @click="
                props.row.estado === 1
                  ? in_activar.inactivar(props.row._id)
                  : in_activar.activar(props.row._id);
              props.row.estado = 'load'" />

          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="warning" icon="edit" class="botonv1" @click="opciones.editar(props.row)" />
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
.input1{
  margin-top: 20px;
}
.input2{
  margin-top: 20px;
}

.input3{
  margin-top: 20px;
}
.boton{
  margin-top: 50px;
}

.tabla {
  margin: 10px;
  border: 3px solid black;
}
.hola{
  width: 100%;
  height: 450px;
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
}</style>
