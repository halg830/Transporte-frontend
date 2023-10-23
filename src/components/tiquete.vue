<script setup>
import axios from "axios";
import { ref } from "vue";
import {useTiqueteStore} from '../stores/tiquete.js'
import { useVendedorStore } from "../stores/vendedor2";
import { useRutasStore } from "../stores/rutas.js";
import { useCiudadStore } from "../stores/ciudad2.js";
import { useBusStore } from "../stores/buses2.js";
import { useClienteStore } from "../stores/clientes2";

const modelo = "Tiquete"

const useTiquete = useTiqueteStore()
const useVendedor = useVendedorStore()
const useRutas = useRutasStore();
const useCliente = useClienteStore()

const columns = ref([
  {
    name: "Cedula",
    label: "Cedula",
    align: "left",
    field: (row) => row.cliente.cedula,
  },
  {
    name: "Ruta",
    label: "Ruta",
    align: "left",
    field: (row) => row.ruta.ciudad_origen.nombre+"/"+row.ruta.ciudad_destino.nombre,
  },
  {
    name: "Bus",
    label: "Bus",
    align: "left",
    field: (row) => row.ruta.bus.placa,
  },
  {
    name: "Asiento",
    label: "Asiento",
    align: "left",
    field: (row) => row.ruta.bus.placa,
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
  vendedor: "",
  ruta: "",
  cliente: "",
  fecha_salida: "",
});

const options = ref({
  vendedor: [],
  ruta: [],
  cliente: []
});

const models = ref({
  vendedor: [],
  ruta: [],
  cliente: []
})

const obtenerInfo = async () => {
  try {
    const tiquete = await useTiquete.obtener();
    if (tiquete) {
      console.log(tiquete);
      rows.value = tiquete;
    } else {
      console.log("No se pudieron obtener los datos.");
    }
  } catch (error) {
    console.error(error);
  }
};

obtenerInfo();

const obtenerOptions = async()=>{
  const responseVendedor = await useVendedor.obtener()
  const responseRutas = await useRutas.obtener()
  const responseCliente = await useCliente.obtener()
  // const responseCiudad = await useCiudad.obtener()
  // const responseBus = await useBus.obtener()

  options.value.vendedor = responseVendedor.map(c=>c.nombre)
  models.value.vendedor = responseVendedor
  const rutasPopulatePromesas = responseRutas.map(async (e) => {
    return await Ruta.findById(e._id)
    .populate("ciudad_origen")
    .populate("ciudad_destino")
    .populate("bus"); 
  });
  
  const rutasPopulate = await Promise.all(rutasPopulatePromesas);
  options.value.ruta = rutasPopulate.map(c=>c.nombre)
  models.value.ruta = responseRutas
  // options.value.ciudad = responseCiudad.map(c=>c.nombre)
  // options.value.bus = responseBus.busPopulate.map(b=>b.placa)
}

obtenerOptions()

const modal = ref(false)
async function agregar(){
  modal.value=true

  console.log(options.value);
}

const enviarInfo = {
  guardar: async () => {
    try {
      const response = await useTiquete.guardar(data.value);
      console.log(response);
      rows.value.push(response.tiquetePopulate)
      modal.value = false
    } catch (error) {
      console.log(error);
    }
  },
  editar: async () => {},
};

const activar = async (id) => {
  const response = await useTiquete.activar(id);
  console.log("r", response);
  const buscar = rows.value.findIndex(
    (r) => r._id == response.tiquetePopulate._id
  );
  rows.value.splice(buscar, 1, response.tiquetePopulate);
};

const inactivar = async (id) => {
  const response = await useTiquete.inactivar(id);
  console.log("r", response);
  const buscar = rows.value.findIndex(
    (r) => r._id == response.tiquetePopulate._id
  );
  rows.value.splice(buscar, 1, response.tiquetePopulate);
};

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
    <q-dialog v-model="modal">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <div class="text-negative">{{ errorform }}</div>
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
          <q-input
            filled
            v-model="data.hora_salida"
            mask="Hora Salida"
            :rules="['time']"
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="data.hora_salida">
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
          <q-btn
            @click="enviarinformacion(typeform)"
            >Guardar</q-btn
          >

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
      <q-table :title="modelo" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:top-right>
          <q-tr>
            <q-td>
              <q-btn @click="agregar">➕</q-btn>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">
            <q-btn
              color="white"
              text-color="black"
              label="❌"
              @click="inactivar(props.row._id)"
              v-if="props.row.estado == 1"
            />
            <q-btn
              color="white"
              text-color="black"
              label="✅"
              @click="activar(props.row._id)"
              v-else
            />
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn
              color="white"
              text-color="black"
              label="🖋️"
              @click="Editar(props.row._id)"
            />
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
