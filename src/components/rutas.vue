<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRutasStore } from "../stores/rutas.js";
import { useCiudadStore } from "../stores/ciudad2.js";
import { useBusStore } from "../stores/buses2.js";

const useRutas = useRutasStore();
const useCiudad = useCiudadStore();
const useBus = useBusStore();
const columns = ref([
  {
    name: "Ciudad origen",
    label: "Ciudad origen",
    align: "left",
    field: (row) => row.ciudad_origen.nombre,
  },
  {
    name: "Ciudad destino",
    label: "Ciudad destino",
    align: "left",
    field: (row) => row.ciudad_destino.nombre,
  },
  {
    name: "Bus",
    label: "Bus",
    align: "left",
    field: (row) => row.bus.placa,
  },
  {
    name: "Hora salida",
    label: "Hora salida",
    field: (row) => convertirHora(row.hora_salida),
  },
  {
    name: "Valor",
    label: "Valor",
    field: (row) => row.valor,
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
    estado.value="guardar";
  },
  editar: (info) => {
    time.value = info.hora_salida
    data.value = info;
    data.value.bus = info.bus.placa
    data.value.ciudad_destino = info.ciudad_destino.nombre
    data.value.ciudad_origen = info.ciudad_origen.nombre
    modal.value = true;
    estado.value="editar";
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
    try {
      data.value.ciudad_origen = idCiudad(data.value.ciudad_origen)
      data.value.ciudad_destino = idCiudad(data.value.ciudad_destino)
      data.value.bus = idBus(data.value.bus)
      data.value.hora_salida = convertirHora_Fecha(time.value)
      console.log(data.value);

      const response = await useRutas.guardar(data.value);
      console.log(response);

      rows.value.push(response.RutasPopulate);
      modal.value = false;
    } catch (error) {
      console.log(error);
    }
  },
  editar: async () => {
    try {
      
      data.value.ciudad_origen = idCiudad(data.value.ciudad_origen)
      data.value.ciudad_destino = idCiudad(data.value.ciudad_destino)
      data.value.bus = idBus(data.value.bus)
      data.value.hora_salida = convertirHora_Fecha(time.value)

      console.log(data.value);
      const response = await useRutas.editar(data.value._id, data.value);
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
    const response = await useRutas.activar(id)
    console.log(response);
    rows.value.splice(buscarIndexLocal(response._id), 1, response)
  },
  inactivar: async(id)=>{
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
          <!-- <div class="text-negative">{{ errorform }}</div> -->
          <q-select
            rounded
            standout
            v-model="data.ciudad_origen"
            :options="options.ciudad"
            label="Ciudad origen"
          />
          <q-select
            rounded
            standout
            v-model="data.ciudad_destino"
            :options="options.ciudad"
            label="Ciudad destino"
          />
          <q-select
            rounded
            standout
            v-model="data.bus"
            :options="options.bus"
            label="Bus"
          />
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

          <q-input
            outlined
            v-model="data.valor"
            label="Valor"
            type="number"
          ></q-input>
          <q-btn @click="enviarInfo[estado]()">Guardar</q-btn>

          <!-- <q-btn
            :color="typeform === 'agregar' ? 'primary' : 'warning'"
            v-if="boxform.estado == 'load'"
          >
            <q-circular-progress indeterminate color="white" />
          </q-btn> -->
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="name">
        <template v-slot:top-left>
          <q-tr>
            <h4 class="q-ma-xs">
              {{ modelo }}
              <q-btn @click="opciones.agregar" label="Añadir" color="primary" glossy>
                <q-icon name="style" color="white" right/>
              </q-btn>
            </h4>
          </q-tr>
        </template>
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">

            <q-btn
              class="botonv1" glossy  text-size="1px" padding="10px"
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
              class="botonv1" glossy
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
