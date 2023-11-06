<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTiqueteStore } from "../stores/tiquete.js";
import { useVendedorStore } from "../stores/vendedor.js";
import { useRutasStore } from "../stores/rutas.js";
import { useClienteStore } from "../stores/clientes.js";

const modelo = "Ventas";
const loading = ref(false)
const loadingTable = ref(true)
const router = useRouter()

const useTiquete = useTiqueteStore();
const useVendedor = useVendedorStore();
const useRutas = useRutasStore();
const useCliente = useClienteStore();
const loadingTable = ref(true)

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
    field: (row) =>
      row.ruta.ciudad_origen.nombre + "/" + row.ruta.ciudad_destino.nombre,
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
    field: (row) => row.num_asiento,
  },
  {
    name: "Hora salida",
    label: "Hora salida",
    align: "left",
    field: (row) => convertirHora(row.ruta.hora_salida),
  },
  {
    name: "Fecha salida",
    label: "Fecha salida",
    align: "left",
    field: (row) => convertirFecha(row.fecha_salida),
  },
  {
    name: "Vendedor",
    label: "Vendedor",
    align: "left",
    field: (row) => row.vendedor.nombre,
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
  num_asiento: ""
});
const date = ref('')

const options = ref({
  vendedor: [],
  ruta: [],
  cliente: [],
});

const models = ref({
  vendedor: [],
  ruta: [],
  cliente: [],
});

const obtenerInfo = async () => {
  try {
    const tiquete = await useTiquete.obtener();
    if (tiquete) {
      console.log(tiquete);
      loadingTable.value=false
      rows.value = tiquete;
      loadingTable.value = false
    } else {
      console.log("No se pudieron obtener los datos.");
    }
  } catch (error) {
    console.error(error);
  }
};

obtenerInfo();

const obtenerOptions = async () => {
  const responseVendedor = await useVendedor.obtener();
  const responseRutas = await useRutas.obtener();
  const responseCliente = await useCliente.obtener();
  // const responseCiudad = await useCiudad.obtener()
  // const responseBus = await useBus.obtener()

  console.log(responseVendedor);
  console.log(responseRutas);
  console.log(responseCliente);

  options.value.vendedor = responseVendedor.vendedor.map((c) => c.nombre);
  models.value.vendedor = responseVendedor.vendedor;
  options.value.ruta = responseRutas.map((c) => c.ciudad_origen.nombre + "/"+ c.ciudad_destino.nombre);
  models.value.ruta = responseRutas;
  options.value.cliente = responseCliente.cliente.map((c) => c.cedula);
  models.value.cliente = responseCliente.cliente;
};

obtenerOptions();

const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    router.push("/tiquetes")
  },
  editar: (info) => {
    data.value = {
      ...info, vendedor:info.vendedor.cedula, ruta: info.ruta.ciudad_origen.nombre + "/" + info.ruta.ciudad_destino.nombre, cliente:info.cliente.cedula
    }
    date.value = info.fecha_salida
    /* data.value = info;
    data.value.vendedor = info.vendedor.cedula;
    data.value.ruta = info.ruta.ciudad_origen.nombre + "/" + info.ruta.ciudad_destino.nombre;
    data.value.cliente = info.cliente.cedula; */
    modal.value = true;
    estado.value = "editar";
  },
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}

function idVendedor(cedula) {
  const buscar = models.value.vendedor.find((c) => c.cedula === cedula);
  if (buscar) return buscar._id;

  return cedula;
}
function idRuta(ciudades) {
  const ciudad = ciudades.split("/")
  console.log(ciudad);

  const buscar = models.value.ruta.find(
    (c) => `${c.ciudad_origen}/${c.ciudad_destino}` === ciudades
  );
  if (buscar) return buscar._id;

  return ciudades;
}
function idCliente(cedula) {
  const buscar = models.value.cliente.find((c) => c.cedula === cedula);
  if (buscar) return buscar._id;

  return cedula;
}

function convertirFechaBD(fechaA) {
  console.log(fechaA);
  const partes = fechaA.split('/');
  
  const fecha = new Date(
    parseInt(partes[0]), 
    parseInt(partes[1]) - 1, 
    parseInt(partes[2])
  );

  // (ISO 8601)
  const fechaFormateada = fecha.toISOString();

  return fechaFormateada;
}

const enviarInfo = {
  guardar: async () => {
    try {
      data.value.fecha_salida = convertirFechaBD(date.value)
      data.value.vendedor = idVendedor(data.value.vendedor);
      data.value.ruta = idRuta(data.value.ruta);
      data.value.cliente = idCliente(data.value.cliente);
      console.log(data.value);

      const response = await useTiquete.guardar(data.value);
      console.log(response);

      rows.value.push(response);
      modal.value = false;
    } catch (error) {
      console.log(error);
    }
  },
  editar: async () => {
    try {
      data.value.fecha_salida = convertirFechaBD(date.value)
      data.value.vendedor = idVendedor(data.value.vendedor);
      data.value.ruta = idRuta(data.value.ruta);
      data.value.cliente = idCliente(data.value.cliente);
      // data.value.hora_salida = convertirHora_Fecha(time.value)
      console.log(data.value);

      const response = await useTiquete.editar(data.value);
      console.log(response);

      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      modal.value = false;
    } catch (error) {
      console.log(error);
    }
  },
};

const in_activar = {
  activar: async (id) => {
    const response = await useTiquete.activar(id);
    console.log(response);
    rows.value.splice(buscarIndexLocal(response._id), 1, response);
  },
  inactivar: async (id) => {
    const response = await useTiquete.inactivar(id);
    console.log(response);
    rows.value.splice(buscarIndexLocal(response._id), 1, response);
  },
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
            v-model="data.cliente"
            :options="options.cliente"
            label="Cliente"
          />
          <q-select
            rounded
            standout
            v-model="data.ruta"
            :options="options.ruta"
            label="Ruta"
          />
          <q-input filled v-model="date" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            outlined
            v-model="data.num_asiento"
            label="Asiento"
            type="number"
          ></q-input>

          <q-select
            rounded
            standout
            v-model="data.vendedor"
            :options="options.vendedor"
            label="Vendedor"
          />

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
      <q-table :title="modelo" :rows="rows" :columns="columns" row-key="name" :loading="loadingTable">
        <template v-slot:top-right>
          <q-tr>
            <q-btn @click="opciones.agregar" label="Añadir" color="secondary" >
                <q-icon name="style" color="white" right/>
              </q-btn>
          </q-tr>
        </template>
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">
            <q-btn
              class="botonv1"   text-size="1px" padding="10px"
              :label="props.row.estado === 1 ? 'Activo' : (
                props.row.estado === 0 ? 'Inactivo' :
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
              class="botonv1" 
              @click="opciones.editar(props.row)"
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
