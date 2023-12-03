<script setup>
import axios from "axios";
import { ref } from "vue";
import { useConductorStore } from '../stores/conductores.js'
import { useQuasar } from 'quasar'
import helpersGeneral from "../helpers/general";

const modelo = "Conductores"
const useConductor = useConductorStore();
const loadingTable = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);

const columns = ref([
  {
    name: "Nombre",
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
    sortable: true,
    sortOrder: 'da'
  },
  {
    name: "Cedula",
    label: "Cedula",
    align: "center",
    field: (row) => row.cedula,
  },
  {
    name: "telefono",
    label: "Teléfono",
    align: "center",
    field: 'telefono',
  },
  {
    name: "email",
    label: "Email",
    align: "center",
    field: 'email',
  },
  {
    name: "num_licencia",
    label: "Número de licencia",
    align: "center",
    field: 'num_licencia',
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
  nombre: "",
  cedula: ""
});

const obtenerInfo = async () => {
  try {
    const conductor = await useConductor.obtener();
    console.log(conductor);

    if (!conductor) return

    if (conductor.error) {
      notificar('negative', conductor.error)
      return
    }

    rows.value = conductor.reverse();

  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false
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
    loadingmodal.value = true;
    try {
      const response = await useConductor.guardar(data.value);
      console.log(response.conductor);
      if (!response) return

      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.unshift(response.conductor)
      modal.value = false
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;

    }
  },
  editar: async () => {
    loadingmodal.value = true;
    try {
      console.log(data.value);
      const response = await useConductor.editar(data.value._id, data.value);
      console.log(response);
      if (!response) return

      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
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
      const response = await useConductor.activar(id)
      console.log(response);
      rows.value.splice(buscarIndexLocal(response._id), 1, response)

    } catch (error) {
      console.log(error);
    }
  },
  inactivar: async (id) => {
    try {
      const response = await useConductor.inactivar(id)
      console.log(response);
      rows.value.splice(buscarIndexLocal(response._id), 1, response)

    } catch (error) {
      console.log(error);
    }
  }
}

function validarCampos() {
  console.log(data.value);
  const arrData = Object.values(data.value)
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
    if (d === null) {
      notificar('negative', 'Por favor complete todos los campos')
      return
    }
    if (typeof d === 'string') {
      if (d.trim() === "") {
        notificar('negative', 'Por favor complete todos los campos')
        return
      }
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
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>{{ helpersGeneral.primeraMayuscula(estado) }} conductor</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-form @submit="validarCampos" @reset="onReset" class="q-gutter-md">

            <q-input outlined v-model="data.nombre" label="Nombre" type="text" lazy-rules
              :rules="[val => val.trim() != '' || 'Ingrese un nombre']"></q-input>
            <q-input outlined v-model="data.cedula" label="Cedula" type="number" max-length="10" lazy-rules
              :rules="[val => val.trim() != '' || 'Ingrese una cedula']"></q-input>
            <q-input outlined v-model="data.telefono" label="Teléfono" type="number" max-length="10" lazy-rules
              :rules="[val => val.trim() != '' || 'Ingrese un teléfono', val => val.length == 10 || 'Número no válido']"></q-input>
            <q-input outlined v-model="data.email" label="Email" type="text" lazy-rules
              :rules="[val => val.trim() != '' || 'Ingrese un email']"></q-input>
            <q-input outlined v-model="data.num_licencia" label="Número de licencia" type="number" lazy-rules
              :rules="[val => val.trim() != '' || 'Ingrese un número de licencia']"></q-input>

            <q-btn :loading="loadingmodal" padding="10px"
              :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado" type="submit">
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