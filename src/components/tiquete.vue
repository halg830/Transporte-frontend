<script setup>
import axios from "axios";
import { ref } from "vue";

//esta funcion recoje dos valores, primero la url pricipal 🎯
//segundo el tipo de accion que deseas realizar 📝
async function obtener(url, type, id = "") {
  let info;
  if (type == "cargar") {
    info = await axios.get(url + "/buscar");
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

let url = "tiquete";

// aqui defino los datos que seran reactivos 🧨
let informacion = ref({ nombre: "", cedula: "", id: "" });
let typeform = ref("- - -");
let errorform = ref("");
let rows = ref([]);

const boxform = ref({ box: false, estado: true });

obtener(url, "cargar");

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
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); 
  const dia = fecha.getDate().toString().padStart(2, '0'); 

  const fechaFormateada = `${año}/${mes}/${dia}`;
  return fechaFormateada;
}

function convertirHora(cadenaFecha) {
  const fecha = new Date(cadenaFecha);
  const horas = fecha.getUTCHours().toString().padStart(2, '0'); 
  const minutos = fecha.getUTCMinutes().toString().padStart(2, '0'); 

  const horaFormateada = `${horas}:${minutos}`;
  return horaFormateada;
}

</script>
<template>
  <div>
    <q-dialog v-model="boxform.box">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>Agregar tiquete</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <div class="text-negative">{{ errorform }}</div>
          <q-input
            outlined
            v-model="informacion.nombre"
            label="Nombre"
          ></q-input>
          <q-input
            outlined
            v-model="informacion.cedula"
            label="Cedula"
            :readonly="typeform !== 'agregar'"
            type="number"
          ></q-input>
          <q-btn
            :color="typeform === 'agregar' ? 'primary' : 'warning'"
            @click="enviarinformacion(typeform)"
            v-if="boxform.estado !== 'load'"
            >{{ typeform }}</q-btn
          >

          <q-btn
            :color="typeform === 'agregar' ? 'primary' : 'warning'"
            v-if="boxform.estado == 'load'"
          >
            <q-circular-progress indeterminate color="white" />
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-markup-table class="tabla">
      <thead>
        <tr>
          <th colspan="5">
            <h4 class="q-ma-xs text-left">
              Tiquetes
              <q-btn
                class="q-ml-xs"
                label="Añadir"
                color="accent"
                @click="form('agregar')"
              >
                <q-icon name="style" color="white" right />
              </q-btn>
            </h4>
          </th>
        </tr>
        <tr class="cosascont">
          <th class="text-center encabezado">Cliente</th>
          <th class="text-center encabezado">Ruta</th>
          <th class="text-center encabezado">Bus</th>
          <th class="text-center encabezado">Hora salida</th>
          <th class="text-center encabezado">Fecha salida</th>
          <th class="text-center encabezado">Valor</th>
          <th class="text-center encabezado">Vendedor</th>
          <th class="text-center encabezado">Estado</th>
          <th class="text-center encabezado">Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td class="text-center">{{ row.ciudad_origen.nombre }}</td>
          <td class="text-center">{{ row.ciudad_destino.nombre }}</td>
          <!-- <td class="text-center">{{ row.bus?.placa || undefined }}</td> -->
          <td class="text-center">{{ convertirFecha(row.fecha_salida) }}</td>
          <td class="text-center">{{ convertirHora(row.hora_salida) }}</td>
          <td class="text-center">
            <q-btn
              class="botonv1"
              label="activo"
              color="positive"
              v-if="row.estado == true"
              @click="
                obtener(url, 'desactivar', row._id);
                row.estado = 'load';
              "
            />

            <q-btn
              class="botonv1"
              label="no activo"
              color="negative"
              v-if="row.estado == false"
              @click="
                obtener(url, 'activar', row._id);
                row.estado = 'load';
              "
            />

            <q-btn
              class="botonv1"
              label=""
              color="grey"
              v-if="row.estado == 'load'"
            >
              <q-circular-progress indeterminate color="white" />
            </q-btn>
          </td>
          <td class="text-center">
            <q-btn-group>
              <q-btn label="" color="grey" v-if="row.estado == 'load'">
                <q-circular-progress indeterminate color="white" />
              </q-btn>

              <q-btn
                color="negative"
                icon="delete"
                class="botonv1"
                @click="
                  obtener(url, 'eliminar', row._id);
                  row.estado = 'load';
                "
                v-else
              />

              <q-btn
                color="warning"
                icon="edit"
                class="botonv1"
                @click="form('editar', row)"
              />
            </q-btn-group>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
  
</template>
<style scoped>
.cont {
  color: rgb(69, 255, 125);
}
</style>