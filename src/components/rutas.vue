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
const loadingTable = ref(true)
const filter = ref("");
const loadingmodal = ref(false);
const selectLoad = ref(true)

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
    loadingTable.value = false
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

  options.value.ciudad = responseCiudad.map((c) => { return { label: c.nombre, value: c._id, disable: false } });
  models.value.ciudades = responseCiudad
  options.value.bus = responseBus.busPopulate.map((b) => { return { label: b.placa, value: b._id } });
  models.value.buses = responseBus.busPopulate

  selectLoad.value = false
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
    data.value = {
      ...info,
      bus: info.bus.placa, ciudad_destino: info.ciudad_destino.nombre, ciudad_origen: info.ciudad_origen.nombre
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

  fecha.setHours(horas - 5);
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
    loadingmodal.value = true;
    try {
      const response = await useRutas.guardar(data.value);
      loadingmodal.value = false;
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      console.log(response);
      rows.value.push(response);
      modal.value = false;
      notificar('positive', 'Guardado exitosamente')
    } catch (error) {
      console.log(error);
    }

  },
  editar: async () => {
    loadingmodal.value = true;
    try {
      const response = await useRutas.editar(data.value._id, data.value);
      console.log(response);
      loadingmodal.value = false;
      if (response.error) {
        notificar('negative', response.error)
        return
      }

      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      notificar('positive', 'Editado exitosamente')
      modal.value = false
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
    notificar('negative', "Por favor complete todos los campos")
    return
  }

  const hora = time.value.split(':')
  if (hora[0] > 23) {
    notificar('negative', 'Hora invalida')
    return
  }
  if (hora[1] > 59) {
    notificar('negative', 'Hora invalida')
    return
  }

  console.log(time.value);
  data.value.hora_salida = convertirHora_Fecha(time.value)

  const arrData = Object.entries(data.value)
  console.log(arrData);
  for (const d of arrData) {
    if (d[0] === null) {
      notificar('negative', "Por favor complete todos los campos")
      return
    }

    if (typeof d[0] === "string") {
      if (d[0].trim() === "") {
        notificar('negative', "Por favor complete todos los campos")
        return
      }
    }

    if (d[0] === 'valor' && d[1] < 0) {
      notificar('negative', 'El valor es invalido')
      return
    }
  }

  data.value.ciudad_origen = data.value.ciudad_origen.value
  data.value.ciudad_destino = data.value.ciudad_destino.value
  data.value.bus = data.value.bus.value

  enviarInfo[estado.value]()
}

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top"
  })
}

/* const validarCiudad = computed(() => {
  return options.value.ciudad.map(c => { if (c.label != data.value.ciudad_origen && c.label != data.value.ciudad_destino) return c })
}) */

const opcionesFiltro = ref({
  bus: options.value.bus,
  ciudad: options.value.ciudad
})
function filterFnBus(val, update) {

  if (val === '') {
    update(() => {
      opcionesFiltro.value.bus = options.value.bus
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opcionesFiltro.value.bus = options.value.bus.filter(v => v.label.toLowerCase().indexOf(needle) > -1) || []
  })
}

function filterFnCiudad(val, update) {
  if (val === '') {
    update(() => {
      opcionesFiltro.value.ciudad = options.value.ciudad
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opcionesFiltro.value.ciudad = options.value.ciudad.filter(v => v.label.toLowerCase().indexOf(needle) > -1) || []
  })
}

function deshabilitarCiudad(val) {

  console.log(val);
  
    for(const c of options.value.ciudad){
      console.log(c);
      if(c.disable === true && data.value.ciudad_origen!=c.label || data.value.ciudad_destino!=c.label) {
        c.disable=false
        if(val===null) return
      }
    }
  

  const buscar = options.value.ciudad.findIndex(c => c.label === val.label)
  console.log(buscar);
  if (buscar < 0) return false

  options.value.ciudad[buscar].disable = true
  console.log(options.value.ciudad);
  return true
}

function prueba(val) {
  console.log(val);
}

/* editado */
</script>

<template>
  <div>
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>Agregar ruta</q-toolbar-title>
          <q-btn class="botonv1" flat dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <!-- <q-select rounded standout v-model="data.ciudad_origen" :options="validarCiudad" label="Ciudad origen"
            lazy-rules :rules="[val => val != '' || 'Ingrese una ciudad']" /> -->
          <q-select outlined v-model:model-value="data.ciudad_origen" use-input input-debounce="0" label="Ciudad origen"
            :options="opcionesFiltro.ciudad" @filter="filterFnCiudad" behavior="menu"
            @update:model-value="deshabilitarCiudad" :loading="selectLoad">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <!-- <q-select rounded standout v-model="data.ciudad_destino" :options="validarCiudad" label="Ciudad destino"
            lazy-rules :rules="[val => val != '' || 'Ingrese una ciudad']" /> -->
          <q-select outlined v-model:model-value="data.ciudad_destino" use-input input-debounce="0" label="Ciudad destino"
            :options="opcionesFiltro.ciudad" @filter="filterFnCiudad" behavior="menu"
            @update:model-value="deshabilitarCiudad" :loading="selectLoad">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <!-- <q-select rounded standout v-model="data.bus" :options="options.bus" label="Bus" lazy-rules
            :rules="[val => val != '' || 'Ingrese un bus']" /> -->
          <q-select outlined v-model:model-value="data.bus" use-input input-debounce="0" label="Placa"
            :options="opcionesFiltro.bus" @filter="filterFnBus" behavior="menu" :loading="selectLoad">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input outlined label="Hora de salida" v-model="time" mask="time"
            :rules="[val => val.trim() != '' || 'Ingrese una hora']">
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

          <q-input outlined v-model="data.valor" label="Valor" type="number" lazy-rules
            :rules="[val => val != '' || 'Ingrese un valor', val => val > 0 || 'Valor invalido']" />


          <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
            :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
            <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>



    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" class="tabla" row-key="name" :loading="loadingTable" :filter="filter"
        rows-per-page-label="visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
        no-results-label="No hay resultados para la busqueda" wrap-cells="false">
        <template v-slot:top>
          <h4 class="titulo-cont">
            {{ modelo }}
            <q-btn @click="opciones.agregar" label="Añadir" color="secondary">
              <q-icon name="style" color="white" right />
            </q-btn>
          </h4>
          <q-input borderless dense debounce="300" color="primary" v-model="filter" class="buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="encabezado">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">
            <q-btn class="botonv1" text-size="1px" padding="10px" :label="props.row.estado === 1
              ? 'Activo'
              : props.row.estado === 0
                ? 'Inactivo'
                : '‎  ‎   ‎   ‎   ‎ '
              " :color="props.row.estado === 1 ? 'positive' : 'accent'" :loading="props.row.estado === 'load'"
              loading-indicator-size="small" @click="
                props.row.estado === 1
                  ? in_activar.inactivar(props.row._id)
                  : in_activar.activar(props.row._id);
              props.row.estado = 'load';
              " />
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

.modal {
  width: 100%;
  max-width: 600px;
}

.tabla {
  padding: 0 20px;
  margin: 10px auto;
  max-width: 1000px;
  /* min-height: 710px; */
  border: 0px solid black;
}

.titulo-cont {
  margin: auto;
}

.buscar {
  display: inline-block;
  margin: auto;
  margin-top: 8px;
  padding: 0px 15px;
  border: 1px solid rgb(212, 212, 212);
  border-radius: 5px;
}

.encabezado {
  font-weight: bold;
  font-size: 15px;
}

.botonv1 {
  font-size: 10px;
  font-weight: bold;
}
</style>
