<script setup>
import axios from "axios";
import { ref, computed } from "vue";
import { useRutasStore } from "../stores/rutas.js";
import { useCiudadStore } from "../stores/ciudad.js";
import { useBusStore } from "../stores/buses.js";
import { useQuasar } from "quasar";

const modelo = "Rutas"

const useRutas = useRutasStore();
const useCiudad = useCiudadStore();
const useBus = useBusStore();

const $q = useQuasar()
const loading = ref(false);
const loadingTable = ref(true)
/* loadingTable.value = false */
/* :loading="loadingTable" */


const columns = ref([
  {
    name: "Ciudad origen",
    label: "Ciudad origen",
    align: "center",
    field: (row) => row.ciudad_origen.nombre,
  },
  {
    name: "Ciudad destino",
    label: "Ciudad destino",
    align: "center",
    field: (row) => row.ciudad_destino.nombre,
  },
  {
    name: "Bus",
    label: "Bus",
    align: "center",
    field: (row) => row.bus.placa,
  },
  {
    name: "Hora salida",
    label: "Hora salida",
    align: "center",
    field: (row) => convertirHora(row.hora_salida),
  },
  {
    name: "Valor",
    label: "Valor",
    align: "center",
    field: (row) => row.valor,
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
  ciudad_origen: "",
  ciudad_destino: "",
  bus: "",
  hora_salida: "",
  valor: "",
});
const time = ref('')

const options = ref({
  ciudad: [],
  bus: [],
});

const models = ref({
  ciudades: [],
  buses: []
})

const obtenerInfo = async () => {
  console.log("Esperando datos...");
  try {
    const rutas = await useRutas.obtener();
    if (rutas) {
      loadingTable.value = false
      console.log(rutas);
      rows.value = rutas;
    } else {
      console.log("No se pudieron obtener los datos.");
    }
  } catch (error) {
    console.error(error);
  }
};

obtenerInfo();

const obtenerOptions = async () => {
  const responseCiudad = await useCiudad.obtener();
  const responseBus = await useBus.obtener();

  options.value.ciudad = responseCiudad.map((c) => c.nombre);
  models.value.ciudades = responseCiudad
  options.value.bus = responseBus.busPopulate.map((b) => b.placa);
  models.value.buses = responseBus.busPopulate
};

obtenerOptions();

const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    data.value = {
      ciudad_origen: "",
      ciudad_destino: "",
      bus: "",
      hora_salida: "",
      valor: "",
    };
    time.value = ""
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = {...info,
      bus:info.bus.placa, ciudad_destino:info.ciudad_destino.nombre, ciudad_origen:info.ciudad_origen.nombre
    }
    time.value = convertirHora(info.hora_salida)
   /*  data.value = info;
    data.value.bus = info.bus.placa
    data.value.ciudad_destino = info.ciudad_destino.nombre
    data.value.ciudad_origen = info.ciudad_origen.nombre */
    modal.value = true;
    estado.value = "editar";
  },
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}

function convertirHora_Fecha(hora) {
  const [horas, minutos] = hora.split(':');

  const fecha = new Date('1970-01-01T00:00:00.000Z');

  fecha.setHours(horas);
  fecha.setMinutes(minutos);

  return fecha.toISOString();
}

function idBus(placa) {
  console.log(models.value);
  const buscar = models.value.buses.find((c) => c.placa === placa);
  if (buscar) return buscar._id;

  return placa
}
function idCiudad(nombre) {
  const buscar = models.value.ciudades.find((c) => c.nombre === nombre);
  if (buscar) return buscar._id;

  return nombre
}

const enviarInfo = {
  guardar: async () => {
    loading.value = true;
    try {
      console.log(data.value);

      const response = await useRutas.guardar(data.value);
      loading.value = false
      
      console.log(response);

      rows.value.push(response);
      modal.value = false;
      $q.notify({
        type: 'positive',
        message: 'Guardado con exito',
        position: "top"
      })
    } catch (error) {
      console.log(error);
    }
  },
  editar: async () => {
    loading.value = true;
    try {
      console.log(data.value);
      const response = await useRutas.editar(data.value._id, data.value);
      loading.value = false
      console.log(response);

      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      modal.value = false
      $q.notify({
        type: 'positive',
        message: 'Editado con exito',
        position: "top"
      })
    } catch (error) {
      console.log(error);
    }
  },
};

const in_activar = {
  activar: async (id) => {
    const response = await useRutas.activar(id)
    console.log(response);
    rows.value.splice(buscarIndexLocal(response._id), 1, response)
  },
  inactivar: async (id) => {
    const response = await useRutas.inactivar(id)
    console.log(response);
    rows.value.splice(buscarIndexLocal(response._id), 1, response)
  }
}

function convertirHora(cadenaFecha) {
  const fecha = new Date(cadenaFecha);
  const horas = fecha.getUTCHours().toString().padStart(2, "0");
  const minutos = fecha.getUTCMinutes().toString().padStart(2, "0");

  const horaFormateada = `${horas}:${minutos}`;
  return horaFormateada;
}

function validarCampos() {

  if (time.value.trim() === "") {
    errorNotify("Por favor complete todos los campos")
    return
  }
  console.log(time.value);
  data.value.hora_salida = convertirHora_Fecha(time.value)

  const arrData = Object.values(data.value)
  console.log(arrData);
  for (const d of arrData) {
    if(d===null){
      errorNotify("Por favor complete todos los campos")
      return
    }
    if (d.trim() === "") {
      errorNotify("Por favor complete todos los campos")
      return
    }
  }

  data.value.ciudad_origen = idCiudad(data.value.ciudad_origen)
  data.value.ciudad_destino = idCiudad(data.value.ciudad_destino)
  data.value.bus = idBus(data.value.bus)

  enviarInfo[estado.value]()
}

function errorNotify(msg){
  $q.notify({
        type: 'negative',
        message: msg,
        position: "top"
      })
}

const validarCiudad = computed(() => {
  return options.value.ciudad.map(c => { if (c != data.value.ciudad_origen && c != data.value.ciudad_destino) return c })
})
</script>

<template>
  <div>
    <q-dialog v-model="modal">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>Agregar ruta</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-select rounded standout v-model="data.ciudad_origen" :options="validarCiudad" label="Ciudad origen" />
          <q-select rounded standout v-model="data.ciudad_destino" :options="validarCiudad" label="Ciudad destino" />
          <q-select rounded standout v-model="data.bus" :options="options.bus" label="Bus" />
          <q-input filled v-model="time" mask="time" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="time">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input outlined v-model="data.valor" label="Valor" type="number"></q-input>
          <q-btn @click="validarCampos" :loading="loading">Guardar</q-btn>
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
              props.row.estado === 0 ? 'Inactivo' :
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
