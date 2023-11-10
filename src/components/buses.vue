<script setup>
import axios from "axios";
import { ref } from "vue";
import { useBusStore } from "../stores/buses.js";
import { useConductorStore } from "../stores/conductores.js";
import { useQuasar } from "quasar";

const modelo = "Buses";
const useBus = useBusStore();
const useConductor = useConductorStore();
const loading = ref(false)
const loadingTable = ref(true)
const $q = useQuasar()

const columns = ref([
  {
    name: "Placa",
    label: "Placa",
    align: "left",
    field: (row) => row.placa,
    sort: true,
    sortOrder: "da",
  },
  {
    name: "Conductor",
    label: "Conductor",
    align: "left",
    field: (row) => row.conductor?.nombre || "-",
  },
  {
    name: "Empresa",
    label: "Empresa",
    align: "left",
    field: (row) => row.empresa,
  },
  {
    name: "Asientos",
    label: "Asientos",
    align: "left",
    field: (row) => row.asiento,
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
  placa: "",
  conductor: "",
  empresa: "",
  asiento: 0,
});

const obtenerInfo = async () => {
  try {
    const bus = await useBus.obtener();
    if (bus) {
      console.log(bus);
      rows.value = bus.busPopulate;
      loadingTable.value = false
    } else {
      console.log("No se pudieron obtener los datos.");
    }
  } catch (error) {
    console.error(error);
  }
};

obtenerInfo();

const options = ref({
  conductores: [],
});

const conductores = ref([]);

const obtenerOptions = async () => {
  const responseConductores = await useConductor.obtener();

  options.value.conductores = responseConductores.map((c) => c.nombre);
  conductores.value = responseConductores;
};

obtenerOptions();

const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    data.value = {
      placa: "",
      conductor: "",
      empresa: "",
      asiento: 0,
    };
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = { ...info, conductor: info.conductor.nombre }
    modal.value = true;
    estado.value = "editar";
  },
};

function idConductor(nombre) {
  const buscar = conductores.value.find((c) => c.nombre === nombre);
  if (buscar) return buscar._id;

  return nombre
}

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}

const enviarInfo = {
  guardar: async () => {
    try {
      loading.value=true

      console.log(data.value);

      const response = await useBus.guardar(data.value);
      loading.value=false
      console.log(response);
      if (response.error) {
        errorNotify(response.error)
        return
      }

      rows.value.push(response);
      modal.value = false;
    } catch (error) {
      console.log(error);
    }
  },
  editar: async () => {
    try {

      console.log(data.value);

      const response = await useBus.editar(data.value._id, data.value);
      console.log(response);

      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      modal.value = false
    } catch (error) {
      console.log(error);
    }
  },
};

const in_activar = {
  activar: async (id) => {
    const response = await useBus.activar(id)
    console.log(response);
    rows.value.splice(buscarIndexLocal(response._id), 1, response)
  },
  inactivar: async (id) => {
    const response = await useBus.inactivar(id)
    console.log(response);
    rows.value.splice(buscarIndexLocal(response._id), 1, response)
  }
}

function validarCampos() {

  const arrData = Object.entries(data.value)
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
    if (d[1] === null) {
      errorNotify("Por favor complete todos los campos")
      return
    }
    if (d[1].trim() === "") {
      errorNotify("Por favor complete todos los campos")
      return
    }

    if(d[0]==="placa" && d[1].length<6){
      errorNotify("La placa no debe tener más de 6 carácteres")
      return
    }    
  }

  data.value.conductor = idConductor(data.value.conductor);

  enviarInfo[estado.value]()
}

function errorNotify(msg) {
  $q.notify({
    type: 'negative',
    message: msg,
    position: "top"
  })
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
          <!-- <div class="text-negative">{{ errorform }}</div> -->

          <q-input outlined v-model="data.placa" label="Placa" type="text"></q-input>
          <q-select rounded standout v-model="data.conductor" :options="options.conductores" label="Conductor" />
          <q-input outlined v-model="data.empresa" label="Empresa" type="text"></q-input>
          <q-input outlined v-model="data.asiento" label="Asientos" type="number"></q-input>
          <q-btn @click="validarCampos" :loading="loading">Guardar</q-btn>

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
              <q-btn @click="opciones.agregar" label="Añadir" color="secondary">
                <q-icon name="style" color="white" right />
              </q-btn>
            </h4>
          </q-tr>
        </template>
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">

            <q-btn  class="botonv1" text-size="1px" padding="10px" :label="props.row.estado === 1 ? 'Activo' : (
              props.row.estado === 0 ? 'No activo' :
                '‎  ‎   ‎   ‎   ‎ ')
              " :color="props.row.estado === 1 ? 'positive' : 'accent'" :loading="props.row.estado === 'load'"
              loading-indicator-size="small" @click="
                props.row.estado === 1
                  ? in_activar.inactivar(props.row._id)
                  : in_activar.activar(props.row._id);
              props.row.estado = 'load'"  />

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
</style>../stores/conductores.js