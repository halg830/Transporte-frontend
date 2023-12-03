<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import helpersGeneral from '../helpers/general.js'
import { useVendedorStore } from '../stores/vendedor.js';

const modelo = "Vendedor";
const useVendedor = useVendedorStore();
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
    sort: true,
    sortOrder: 'da'
  },
  {
    name: "Apellido",
    label: "Apellido",
    align: "left",
    field: (row) => row.apellido,
    sort: true,
    sortOrder: 'da'
  },
  {
    name: "Cedula",
    label: "Cedula",
    align: "left",
    field: (row) => row.cedula,
  },
  {
    name: "Teléfono",
    label: "Teléfono",
    align: "left",
    field: (row) => row.telefono,
  },
  {
    name: "Usuario",
    label: "Usuario",
    align: "left",
    field: (row) => row.usuario,
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
  apellido: "",
  cedula: "",
  telefono: "",
  usuario: "",
  contrasena: ""
});

const obtenerInfo = async () => {
  try {
    const vendedor = await useVendedor.obtener();
    console.log(vendedor);

    if (!vendedor) return
    if (vendedor.error) {
      notificar('negative', vendedor.error)
    }
    rows.value = vendedor.vendedor.reverse();
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
      apellido: "",
      cedula: "",
      telefono: "",
      usuario: "",
      contrasena: ""
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
      const response = await useVendedor.guardar(data.value);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
      }
      console.log(response);
      rows.value.unshift(response.vendedor)
      modal.value = false
      notificar('positive', 'Guardado exitosamente')
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
      const response = await useVendedor.editar(data.value._id, data.value);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      modal.value = false
      notificar('positive', 'Editado exitosamente')
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
      const response = await useVendedor.activar(id)
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response)

    } catch (error) {
      console.log(error);
    }
  },
  inactivar: async (id) => {
    try {
      const response = await useVendedor.inactivar(id)
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response)

    } catch (error) {
      console.log(error);
    }
  }
}

function validarCampos() {
  console.log(data.value);
  const arrData = Object.values(data.value);
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
    if (d === null) {
      errorCamposVacios();
      return;
    }
    if (typeof d === "string") {
      if (d.trim() === "") {
        errorCamposVacios();
        return;
      }
    }
  }
  enviarInfo[estado.value]();
}

function errorCamposVacios() {
  $q.notify({
    type: "negative",
    message: "Por favor complete todos los campos",
    position: "top",
  });
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
          <q-toolbar-title>{{ helpersGeneral.primeraMayuscula(estado) }} vendedor</q-toolbar-title>
          <q-btn class="botonv1" flat dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-input outlined v-model="data.nombre" label="Nombre" type="text"
            :rules="[val => !!val || 'Ingrese un nombre']"></q-input>

          <q-input outlined v-model="data.apellido" label="Apellido" type="text"
            :rules="[val => !!val || 'Ingrese un apellido']"></q-input>

          <q-input outlined v-model="data.cedula" label="Cedula" type="number" maxlength="10"
            :rules="[val => !!val || 'Ingrese una cédula']"></q-input>

          <q-input outlined v-model="data.telefono" label="Teléfono" type="number" maxlength="10"
            :rules="[val => !!val || 'Ingrese un teléfono', val=>val.length<11 || 'Ingrese menos de 10 digitos']"></q-input>

          <q-input outlined v-model="data.usuario" label="Usuario" type="text"
            :rules="[val => !!val || 'Ingrese un usuario']"></q-input>

          <q-input outlined v-model="data.contrasena" label="Contraseña" type="password"
            :rules="[val => !!val || 'Ingrese una contraseña']" :disable="estado==='editar'"></q-input>

          <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
            :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
            <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
          </q-btn>

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
              " :disable="props.row._id==='656b51a1981c8c022fa4ece0'"/>
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
