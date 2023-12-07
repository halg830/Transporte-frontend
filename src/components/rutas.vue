<script setup>
import { ref } from "vue";
import { useRutasStore } from "../stores/rutas.js";
import { useCiudadStore } from "../stores/ciudad.js";
import { useBusStore } from "../stores/buses.js";
import { useQuasar } from "quasar";
import helpersGeneral from '../helpers/general.js'

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
    name: "Hora salida",
    label: "Hora salida",
    align: "center",
    field: (row) => convertirHora(row.hora_salida),
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
  hora_salida: "",
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
    console.log(rutas);

    if (!rutas) return

    if (rutas.error) {
      notificar('negative', rutas.error)
      return
    }
    rows.value = rutas.reverse();
  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false

  }
};

obtenerInfo();

const obtenerOptions = async () => {
  try {
    const responseCiudad = await useCiudad.obtener();
    // const responseBus = await useBus.obtener();

    if (!responseCiudad) return

    /*   if (responseBus.error) {
        notificar('negative', responseBus.error)
        return
      } */
    if (responseCiudad.error) {
      notificar('negative', responseCiudad.error)
      return
    }

    options.value.ciudad_origen = responseCiudad.map((c) => { return { label: c.nombre + `${c.estado === 0 ? ' - Inactiva' : ''}`, value: c._id, disable: c.estado === 0, estado: c.estado } });
    options.value.ciudad_destino = responseCiudad.map((c) => { return { label: c.nombre + `${c.estado === 0 ? ' - Inactiva' : ''}`, value: c._id, disable: c.estado === 0, estado: c.estado } });
    models.value.ciudades = responseCiudad
    /*     options.value.bus = responseBus.busPopulate.map((b) => { return { label: b.placa, value: b._id, estado: b.estado } });
        models.value.buses = responseBus.busPopulate */

  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value = false
  }
};

obtenerOptions();

const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    data.value = {
      ciudad_origen: "",
      ciudad_destino: "",
      hora_salida: "",
    };
    time.value = ""
    modal.value = true;
    estado.value = "guardar";
    deshabilitarCiudad('')
    deshabilitarCiudadDestino('')
  },
  editar: (info) => {
    data.value = {
      ...info,
      ciudad_destino: { label: info.ciudad_destino.nombre, value: info.ciudad_destino._id }, 
      ciudad_origen: { label: info.ciudad_origen.nombre, value: info.ciudad_origen._id }
    }
    time.value = convertirHora(info.hora_salida)
    modal.value = true;
    estado.value = "editar";
    deshabilitarCiudad(data.value.ciudad_origen)
    deshabilitarCiudadDestino(data.value.ciudad_destino)
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

const enviarInfo = {
  guardar: async () => {
    loadingmodal.value = true;
    try {
      const info = {
        ...data.value, ciudad_origen: data.value.ciudad_origen.value,
        ciudad_destino: data.value.ciudad_destino.value
      }
      const response = await useRutas.guardar(info);

      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      console.log(response);
      rows.value.unshift(response);
      notificar('positive', 'Guardado exitosamente')
      modal.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }

  },
  editar: async () => {
    loadingmodal.value = true;
    try {
      console.log("a", data.value);
      const info = {
        ...data.value, ciudad_origen: data.value.ciudad_origen.value,
        ciudad_destino: data.value.ciudad_destino.value
      }
      const response = await useRutas.editar(data.value._id, info);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }

      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      notificar('positive', 'Editado exitosamente')
      modal.value = false
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }
  },
};

const in_activar = {
  activar: async (id) => {
    try {
      const response = await useRutas.activar(id)
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response)

    } catch (error) {
      console.log(error);
    }
  },
  inactivar: async (id) => {
    try {
      const response = await useRutas.inactivar(id)
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response)

    } catch (error) {
      console.log(error);
    }
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

  if (data.value.ciudad_origen.estado === 0) {
    notificar('negative', 'La ciudad de origen esta inactiva')
    return
  }
  if (data.value.ciudad_destino.estado === 0) {
    notificar('negative', 'La ciudad de destino esta inactiva')
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


  // data.value.ciudad_origen = data.value.ciudad_origen.value
  // data.value.ciudad_destino = data.value.ciudad_destino.value
  // data.value.bus = data.value.bus.value




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
  ciudad_origen: options.value.ciudad_origen,
  ciudad_destino: options.value.ciudad_destino
})
/* function filterFnBus(val, update) {

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
} */

function filterFnCiudad(val, update) {
  val=val.trim()
  if (val === '') {
    update(() => {
      opcionesFiltro.value.ciudad_origen = options.value.ciudad_origen
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opcionesFiltro.value.ciudad_origen = options.value.ciudad_origen.filter(v => v.label.toLowerCase().indexOf(needle) > -1) || []
  })
}
function filterFnCiudadDestino(val, update) {
  val=val.trim()
  if (val === '') {
    update(() => {
      opcionesFiltro.value.ciudad_destino = options.value.ciudad_destino
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opcionesFiltro.value.ciudad_destino = options.value.ciudad_destino.filter(v => v.label.toLowerCase().indexOf(needle) > -1) || []
  })
}

function deshabilitarCiudad(val) {

  console.log(val);

  for (const c of options.value.ciudad_destino) {
    console.log(c);
    if (c.disable === true && data.value.ciudad_destino.label != c.label && c.estado!=0) {
      c.disable = false
      if (val === null) return
    }
  }

  console.log(opcionesFiltro.value);


  const buscar = options.value.ciudad_destino.findIndex(c => c.label === val.label)
  console.log(buscar);
  if (buscar < 0) return false

  options.value.ciudad_destino[buscar].disable = true
  console.log(options.value.ciudad);
  
  return true
}

function deshabilitarCiudadDestino(val) {

console.log(val);


console.log(options.value.ciudad);
for (const c of options.value.ciudad_origen) {
  console.log(c);
  if (c.disable === true && data.value.ciudad_origen.label != c.label  && c.estado!=0) {
    console.log(data.value);
    c.disable = false
    if (val === null) return
  }
}

const buscar = options.value.ciudad_origen.findIndex(c => c.label === val.label)
console.log(buscar);
if (buscar < 0) return false

options.value.ciudad_origen[buscar].disable = true

return true
}

/* editado */
</script>

<template>
  <div>
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>{{ helpersGeneral.primeraMayuscula(estado) }} ruta</q-toolbar-title>
          <q-btn class="botonv1" flat dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-form @submit="validarCampos" class="q-gutter-md">

            <!-- <q-select rounded standout v-model="data.ciudad_origen" :options="validarCiudad" label="Ciudad origen"
            lazy-rules :rules="[val => val != '' || 'Ingrese una ciudad']" /> -->
            <q-select outlined v-model:model-value="data.ciudad_origen" use-input input-debounce="0" label="Ciudad origen"
              :options="opcionesFiltro.ciudad_origen" @filter="filterFnCiudad" behavior="menu"
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
            <q-select outlined v-model:model-value="data.ciudad_destino" use-input input-debounce="0"
              label="Ciudad destino" :options="opcionesFiltro.ciudad_destino" @filter="filterFnCiudadDestino" behavior="menu"
              @update:model-value="deshabilitarCiudadDestino" :loading="selectLoad">
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
            <!-- <q-select outlined v-model:model-value="data.bus" use-input input-debounce="0" label="Placa"
            :options="opcionesFiltro.bus" @filter="filterFnBus" behavior="menu" :loading="selectLoad">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select> -->
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

            <!-- <q-input outlined v-model="data.valor" label="Valor" type="number" lazy-rules
            :rules="[val => val != '' || 'Ingrese un valor', val => val > 0 || 'Valor invalido']" /> -->


            <q-btn type="submit" :loading="loadingmodal" padding="10px"
              :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
              <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
            </q-btn>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>



    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" class="tabla" row-key="name" :loading="loadingTable" :filter="filter"
        rows-per-page-label="Visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
        no-results-label="No hay resultados para la busqueda" wrap-cells="false" loading-label="Cargando...">
        <template v-slot:top>
          <h4 class="titulo-cont">
            {{ modelo }}
            <q-btn @click="opciones.agregar" label="Añadir" color="secondary">
              <q-icon name="style" color="white" right />
            </q-btn>
          </h4>
          <q-input borderless dense debounce="300" color="primary" v-model="filter" class="buscar" placeholder="Buscar cualquier campo">
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
