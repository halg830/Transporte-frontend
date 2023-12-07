<script setup>
import axios from "axios";
import { ref } from "vue";
import { useCiudadStore } from "../stores/ciudad.js";
import { useQuasar } from "quasar";
import helpersGeneral from "../helpers/general";

const useCiudad = useCiudadStore();
const loadingTable = ref(true);
const $q = useQuasar();
const filter = ref("");
const loadingmodal = ref(false);

const columns = ref([
  {
    name: "Nombre",
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
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
    align: "right",
    field: "opciones",
    fontSize: "100px",
  },
]);
const rows = ref([]);

const data = ref({
  nombre: "",
});

const obtenerInfo = async () => {
  try {
    const ciudad = await useCiudad.obtener();

    if (!ciudad) return

    if (ciudad.error) {
      notificar('negative', ciudad.error)
      return
    }

    console.log(ciudad);
    rows.value = ciudad.reverse();
    loadingTable.value = false;

  } catch (error) {
    console.error(error);
  }
};

obtenerInfo();

const modelo = "ciudades";
const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    data.value = {
      nombre: "",
    };
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = { ...info };
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
      const response = await useCiudad.guardar(data.value);
      loadingmodal.value = false;
      console.log(response);

      if(!response) return

      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.unshift(response);
      modal.value = false;
      notificar('positive', 'Guardado exitosamente')
    } catch (error) {
      console.log(error);
    }

  },
  editar: async () => {
    loadingmodal.value = true;
    try {
      const response = await useCiudad.editar(data.value._id, data.value);
      
      loadingmodal.value = false;
      console.log(response);
      if(!response) return

      if (response.error) {
        notificar('negative', response.error)
        return
      }

      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      modal.value = false;
      notificar('positive', 'Editado exitosamente')
    } catch (error) {
      console.log(error);
    }
    
  },
};

const in_activar = {
  activar: async (id) => {
    const response = await useCiudad.activar(id);
    console.log(response);
    if(!response) return
    if (response.error) {
        notificar('negative', response.error)
        return
      }
    rows.value.splice(buscarIndexLocal(response._id), 1, response);
  },
  inactivar: async (id) => {
    const response = await useCiudad.inactivar(id);
    console.log(response);
    if(!response) return
    if (response.error) {
        notificar('negative', response.error)
        return
      }
    rows.value.splice(buscarIndexLocal(response._id), 1, response);
  },
};

function validarCampos() {
  const arrData = Object.values(data.value);
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
    if (d === null) {
      notificar('negative', 'Por favor complete todos los campos');
      return;
    }
    if (typeof d === "string") {
      if (d.trim() === "") {
        notificar('negative', 'El valor de los campos es invalido');
        return;
      }
    }
  }
  enviarInfo[estado.value]();
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
          <q-toolbar-title>{{ helpersGeneral.primeraMayuscula(estado) }} ciudad</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-input outlined v-model="data.nombre" label="Nombre" type="text" autofocus></q-input>

          <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
            :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
            <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
          </q-btn>

          <!-- <q-btn
          >
            <q-circular-progress indeterminate color="white" />
          </q-btn> -->
        </q-card-section>
      </q-card>
    </q-dialog>




    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" class="tabla" row-key="name" :loading="loadingTable" :filter="filter.trim()"
        rows-per-page-label="Visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
        no-results-label="No hay resultados para la busqueda" wrap-cells="false" loading-label="Cargando...">
        <template v-slot:top>
          <h4 class="titulo-cont">
            Ciudades
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
