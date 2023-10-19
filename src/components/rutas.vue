<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRutasStore } from "../stores/rutas.js";

const useRutas = useRutasStore();
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
])
const rows = ref([]);

const data = ref({
  ciudad_origen: "",
  ciudad_destino: "",
  bus: "",
  hora_salida: "",
  valor: ""
});

const options = ref({
  ciudad: [],
  bus: [],
});

const obtenerInfo = async () => {
  try {
    const rutas = await useRutas.obtener();
    if (rutas) {
      console.log(rutas);
      rows.value = rutas
    } else {
      console.log("No se pudieron obtener los datos.");
    }
  } catch (error) {
    console.error(error);
  }
};

obtenerInfo();

const activar = async(id)=>{
  const response = await useRutas.activar(id)
  console.log("r", response);
  const buscar = rows.value.findIndex(r=>r._id==response.rutasPopulate._id)
  rows.value.splice(buscar, 1, response.rutasPopulate)

}

const inactivar = async(id)=>{
  const response = await useRutas.inactivar(id)
  console.log("r", response);
  const buscar = rows.value.findIndex(r=>r._id==response.rutasPopulate._id)
  rows.value.splice(buscar, 1, response.rutasPopulate)

}

//esta funcion recoje dos valores, primero la url pricipal 🎯
//segundo el tipo de accion que deseas realizar 📝
async function obtener(url, type, id = "") {
  let info;
  if (type == "cargar") {
    info = await axios.get(url + "/cargar");
    rows.value = info.data.rutasPopulate;
  }
  if (type == "buscar") {
    info = await axios.get(url + "/buscarID/" + id);
  }
  if (type == "agregar") {
    info = await axios.post(url + "/agregar", informacion.value);
    obtener(url, "cargar");
  }
  if (type == "eliminar") {
    info = await axios.delete(url + "/eliminar/" + id);
    obtener(url, "cargar");
  }
  if (type == "editar") {
    info = await axios.put(url + "/modificar/" + id, informacion.value);
    obtener(url, "cargar");
  }
  if (type == "activar") {
    info = await axios.put(url + "/activar/" + id);
    obtener(url, "cargar");
  }
  if (type == "desactivar") {
    console.log(url, id);
    info = await axios.put(url + "/inactivar/" + id);
    obtener(url, "cargar");
  }
  //aqui muestra la respuesta del server en la consola 🛠
  console.log(info.data);
  //oculta box y el estado ya no es "cargando"
  boxform.value = { box: false, estado: true };
}

let url = "ruta";

// aqui defino los datos que seran reactivos 🧨
let informacion = ref({ nombre: "", cedula: "", id: "" });
let typeform = ref("- - -");
let errorform = ref("");

const boxform = ref({ box: false, estado: true });

// obtener(url, "cargar");

function form(type, data = "") {
  informacion = ref({ nombre: "", cedula: "" });
  errorform.value = "";
  typeform.value = type;
  boxform.value.box = true;
  if (type == "editar") {
    informacion.value.id = data._id;
    informacion.value.nombre = data.nombre;
    informacion.value.cedula = data.cedula;
  }
}

function enviarinformacion(type) {
  errorform.value = "";
  if (informacion.value.nombre.trim().length < 1) {
    errorform.value = "ingrese un nombre valido";
  } else if (informacion.value.cedula.length !== 10) {
    errorform.value = "la cedula debe contener 10 caracteres";
  } else {
    obtener(url, type, informacion.value.id);
    boxform.value.estado = "load";
  }
}

function convertirFecha(cadenaFecha) {
  const fecha = new Date(cadenaFecha);
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const dia = fecha.getDate().toString().padStart(2, "0");

  const fechaFormateada = `${año}/${mes}/${dia}`;
  return fechaFormateada;
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
    <q-dialog v-model="boxform.box">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>Agregar ruta</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <div class="text-negative">{{ errorform }}</div>
          <q-select rounded standout v-model="data.ciudad_origen" :options="options.ciudad" label="Ciudad origen" />
          <q-select rounded standout v-model="data.ciudad_destino" :options="options.ciudad" label="Ciudad destino" />
          <q-select rounded standout v-model="data.bus" :options="options.bus" label="Bus" />
          <q-input filled v-model="data.hora_salida" mask="Hora Salida" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="data.hora_salida">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input outlined v-model="data.valor" label="Valor" :readonly="typeform !== 'agregar'" type="number"></q-input>
          <q-btn :color="typeform === 'agregar' ? 'primary' : 'warning'" @click="enviarinformacion(typeform)"
            v-if="boxform.estado !== 'load'">{{ typeform }}</q-btn>

          <q-btn :color="typeform === 'agregar' ? 'primary' : 'warning'" v-if="boxform.estado == 'load'">
            <q-circular-progress indeterminate color="white" />
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">

      <q-table title="Rutas" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">
            <q-btn color="white" text-color="black" label="❌" @click="inactivar(props.row._id)"
              v-if="props.row.estado == 1" />
            <q-btn color="white" text-color="black" label="✅" @click="activar(props.row._id)" v-else />
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="white" text-color="black" label="🖋️" @click="Editar(props.row._id)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>
<style scoped>
.cont {
  color: rgb(69, 255, 125);
}
</style>
