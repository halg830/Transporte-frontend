<script setup>
import { ref } from "vue";
import { useBusStore } from "../stores/buses.js";
import { useConductorStore } from "../stores/conductores.js";
import { useQuasar } from "quasar";
import helpersGeneral from '../helpers/general.js'

const modelo = "Buses";
const useBus = useBusStore();
const useConductor = useConductorStore();
const loading = ref(false)
const loadingTable = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);
const selectLoad = ref({
  conductor: true
})

const columns = ref([
  {
    name: "Placa",
    label: "Placa",
    align: "center",
    field: (row) => row.placa.toUpperCase(),
    sort: true,
    sortOrder: "da",
  },
  {
    name: "numero",
    label: "Numero bus",
    align: "center",
    field: 'numero'
  },
  {
    name: "Conductor",
    label: "Conductor",
    align: "left",
    field: (row) => row.conductor?.nombre + ' / ' + row.conductor.cedula,
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
    align: "center",
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
  asiento: '',
  numero: ''
});

const obtenerInfo = async () => {
  try {
    const bus = await useBus.obtener();
    loadingTable.value = false

    console.log(bus);

    if (!bus) return

    if (bus.error) {
      notificar('negative', bus.error)
      return
    }

    rows.value = bus.busPopulate.reverse();
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
  selectLoad.value.conductor = false

  if (!responseConductores) return

  if (responseConductores.error) {
    notificar('negative', responseConductores.error)
    return
  }

  console.log(responseConductores);
  options.value.conductores = responseConductores.map((c) => { return { label: c.nombre + " / CC: " + c.cedula + `${c.estado === 0 ? ' - Inactivo' : ''}`, value: c._id, disable: c.estado === 0 } });
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
      asiento: '',
      numero: ''
    };
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = { ...info, conductor: {label: info.conductor.nombre + ' / CC: ' + info.conductor.cedula, value:info.conductor._id} }
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
      loading.value = true
      console.log(data.value);

      const info = { ...data.value, conductor: data.value.conductor.value }

      const response = await useBus.guardar(info);
      loading.value = false
      loadingmodal.value = false;
      console.log(response);

      if (!response) return

      if (response.error) {
        notificar('negative', response.error)
        return
      }

      rows.value.unshift(response);
      notificar('positive', "Guardado exitosamente")
      modal.value = false;
    } catch (error) {
      console.log(error);
    }

  },
  editar: async () => {
    loadingmodal.value = true;
    try {

      console.log(data.value);

      const info = { ...data.value, conductor: data.value.conductor.value }

      const response = await useBus.editar(data.value._id, info);
      console.log(response);
      loadingmodal.value = false;

      if (!response) return

      if (response.error) {
        notificar('negative', response.error)
        return
      }

      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      notificar('positive', "Editado exitosamente")
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

    if (!response) return

    if (response.error) {
      notificar('negative', response.error)
      return
    }
    rows.value.splice(buscarIndexLocal(response._id), 1, response)
  },
  inactivar: async (id) => {
    const response = await useBus.inactivar(id)
    console.log(response);
    if (!response) return

    if (response.error) {
      notificar('negative', response.error)
      return
    }
    rows.value.splice(buscarIndexLocal(response._id), 1, response)
  }
}

function validarCampos() {

  const arrData = Object.entries(data.value)
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
    if (d[1] === null) {
      notificar('negative', "Por favor complete todos los campos")
      return
    }

    if (typeof d[1] === 'string') {
      if (d[1].trim() === "") {
        notificar('negative', "Por favor complete todos los campos")
        return
      }
    }

    if (d[0] === "placa" && d[1].length > 6) {
      notificar('negative', "La placa no debe tener más de 6 carácteres")
      return
    }

    if (d[0] === "asiento" && d[1] <= 0) {
      notificar('negative', "El bus debe tener asientos")
      return
    }
  }
  console.log(data.value);
  // data.value.conductor = data.value.conductor.value

  enviarInfo[estado.value]()
}

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top"
  })
}

const opcionesFiltro = ref({
  conductores: options.value.conductores
})

function filterFn(val, update) {
  if (val === '') {
    update(() => {
      opcionesFiltro.value.conductores = options.value.conductores
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opcionesFiltro.value.conductores = options.value.conductores.filter(v => v.label.toLowerCase().indexOf(needle) > -1) || []
  })
}

// const primeraMayuscula = (cadena) =>
//   cadena.charAt(0).toUpperCase() + cadena.slice(1)

</script>

<template>
  <div>
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title> {{ helpersGeneral.primeraMayuscula(estado) + ' bus' }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-form @submit="validarCampos" class="q-gutter-md">

            <q-input outlined v-model="data.placa" label="Placa" type="text" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese una placa',
            val => val.length <= 6 || 'La placa debe tener 6 o menos carácteres']"></q-input>
            <q-input outlined v-model="data.numero" label="Numero bus" type="number" lazy-rules :rules="[val => val != '' || 'Ingrese el numero del bus',
            val => val > 0 || 'Cantidad no válida']"></q-input>

            <q-select outlined v-model:model-value="data.conductor" use-input input-debounce="0"
              label="Nombre del conductor" :options="opcionesFiltro.conductores" @filter="filterFn" behavior="menu"
              :rules="[val => val != null || 'Seleccione un nombre', val => val != '' || 'Seleccione un nombre']"
              :loading="selectLoad.conductor" :disable="selectLoad.conductor">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input outlined v-model="data.empresa" label="Empresa" type="text" lazy-rules
              :rules="[val => val.trim() != '' || 'Ingrese una empresa']"></q-input>

            <q-input outlined v-model="data.asiento" label="Asientos" type="number" lazy-rules :rules="[val => val != '' || 'Ingrese un numero',
            val => val > 0 || 'Cantidad no válida']"></q-input>


            <div>
              <q-btn :label="estado" type="submit" :color="estado == 'editar' ? 'warning' : 'secondary'"
                :loading="loadingmodal">
                <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
              </q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>


    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" class="tabla" row-key="name" :loading="loadingTable" :filter="filter"
        rows-per-page-label="Visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
        loading-label="Cargando..." no-results-label="No hay resultados para la busqueda" wrap-cells="false">
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

#btnBorrar {
  margin-left: 10px;
}

.modal {
  width: 100%;
  max-width: 600px;
}

.tabla {
  padding: 0 20px;
  margin: 10px auto;
  max-width: 1400px;
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