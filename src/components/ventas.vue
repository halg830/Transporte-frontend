<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { PDFDocument, rgb } from 'pdf-lib';
import { useTiqueteStore } from "../stores/tiquete.js";
import { useVendedorStore } from "../stores/vendedor.js";
import { useRutasStore } from "../stores/rutas.js";
import { useClienteStore } from "../stores/clientes.js";

const modelo = "Ventas";
const loadingTable = ref(true)
const $q = useQuasar()
const router = useRouter()

const useTiquete = useTiqueteStore();
const useVendedor = useVendedorStore();
const useRutas = useRutasStore();
const useCliente = useClienteStore();

const columns = ref([
  {
    name: "fecha venta",
    label: "Fecha venta",
    align: "center",
    field: (row) => convertirFecha(row.createdAt),
  },
  {
    name: "Cedula",
    label: "Cedula",
    align: "center",
    field: (row) => row.cliente.cedula,
  },
  {
    name: "Ruta",
    label: "Ruta",
    align: "center",
    field: (row) =>
      row.ruta.ciudad_origen.nombre + " / " + row.ruta.ciudad_destino.nombre + " / " + convertirHora(row.ruta.hora_salida),
  },
  {
    name: "Bus",
    label: "Bus (placa / numero)",
    align: "center",
    field: (row) => row.bus.placa + ' / ' + row.bus.numero,
  },
  {
    name: "Valor",
    label: "Valor",
    align: "center",
    field: (row) => formatearMoneda(row.valor),
  },
  {
    name: "Asiento",
    label: "Asiento",
    align: "center",
    field: (row) => row.num_asiento,
  },
  {
    name: "Hora salida",
    label: "Hora salida",
    align: "center",
    field: (row) => convertirHora(row.ruta.hora_salida),
  },
  {
    name: "Fecha salida",
    label: "Fecha salida",
    align: "center",
    field: (row) => convertirFecha(row.fecha_salida),
  },
  {
    name: "Vendedor",
    label: "Vendedor",
    align: "center",
    field: (row) => row.vendedor.nombre,
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
    align: 'center',
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

    console.log(tiquete);
    if (!tiquete) return;
    if (tiquete.error) {
      notificar('negative', tiquete.error)
      return
    }
    loadingTable.value = false
    rows.value = tiquete.reverse();

  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false
  }
};

obtenerInfo();

const obtenerOptions = async () => {
  try {
    const responseVendedor = await useVendedor.obtener();
    const responseRutas = await useRutas.obtener();
    const responseCliente = await useCliente.obtener();

    console.log(responseVendedor);
    console.log(responseRutas);
    console.log(responseCliente);

    if (!responseVendedor || !responseRutas || !responseCliente) return;

    if (responseVendedor.error) {
      notificar('negative', responseVendedor.error)
      return
    };
    if (responseRutas.error) {
      notificar('negative', responseRutas.error)
      return
    };
    if (responseCliente.error) {
      notificar('negative', responseCliente.error)
      return
    };

    options.value.vendedor = responseVendedor.vendedor.map((c) => c.nombre);
    models.value.vendedor = responseVendedor.vendedor;
    options.value.ruta = responseRutas.map((c) => c.ciudad_origen.nombre + "/" + c.ciudad_destino.nombre + "/" + convertirHora(c.hora_salida));
    models.value.ruta = responseRutas;
    options.value.cliente = responseCliente.cliente.map((c) => c.cedula);
    models.value.cliente = responseCliente.cliente;
  } catch (error) {
    console.log(error);
  }
};

obtenerOptions();
const ticket = ref({})
const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    router.push("/tiquetes")
  },
  editar: (info) => {
    data.value = {
      ...info, vendedor: info.vendedor.cedula, ruta: info.ruta.ciudad_origen.nombre + "/" + info.ruta.ciudad_destino.nombre + "/" + convertirHora(info.ruta.hora_salida), cliente: info.cliente.cedula
    }
    date.value = info.fecha_salida
    modal.value = true;
    estado.value = "editar";
  },
  imprimir: (info)=>{
    ticket.value = {...info}
    generarPDF()
  }
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}

function idVendedor(cedula) {
  const buscar = models.value.vendedor.find((c) => c.cedula === cedula);
  if (buscar) return buscar._id;

  return cedula;
}
function buscarRuta(ciudades) {
  const ciudad = ciudades.split("/")
  console.log(ciudad);

  const buscar = models.value.ruta.find(
    (c) => `${c.ciudad_origen.nombre}/${c.ciudad_destino.nombre}/${convertirHora(c.hora_salida)}` === ciudades
  );
  if (buscar) return buscar;

  return ciudades;
}
function idCliente(cedula) {
  const buscar = models.value.cliente.find((c) => c.cedula === cedula);
  if (buscar) return buscar._id;

  return cedula;
}

const enviarInfo = {
  editar: async () => {
    try {
      // data.value.hora_salida = convertirHora_Fecha(time.value)
      console.log(data.value);

      const response = await useTiquete.editar(data.value._id, data.value);
      console.log(response);

      if (!response) return;
      if (response.error) {
        notificar('negative', response.error);
        return;
      }

      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      modal.value = false;
    } catch (error) {
      console.log(error);
    }
  },
};

const in_activar = {
  activar: async (id) => {
    try {
      const response = await useTiquete.activar(id);
      console.log(response);
      if (!response) return;
      if (response.error) {
        notificar('negative', response.error);
        return;
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);

    } catch (error) {
      console.log(error);
    }
  },
  inactivar: async (id) => {
    try {
      const response = await useTiquete.inactivar(id);
      console.log(response);
      if (!response) return;
      if (response.error) {
        notificar('negative', response.error);
        return;
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);

    } catch (error) {
      console.log(error);
    }
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

async function validarCampos() {

  if (date.value.trim() === "") {
    notificar('negative', 'Todos los campos son obligatorios')
    return
  }
  data.value.hora_salida = convertirFecha(date.value)

  data.value.ruta = buscarRuta(data.value.ruta)

  const arrData = Object.entries(data.value)
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
    if (d[1] === null) {
      notificar('negative', 'Todos los campos son obligatorios')
      return
    }

    if (typeof d[1] === "string") {
      if (d[1].trim() === "") {
        notificar('negative', 'Todos los campos son obligatorios')
        return
      }
    }

    if (typeof d[1] === 'object' && d[0] === 'ruta') {
      if (d[1].bus.asiento > data.value.num_asiento) {
        notificar('negative', 'Asiento no existente')
        return
      }
    }

    // if(d[0]==='num_asiento' && )
  }

  data.value.vendedor = idVendedor(data.value.vendedor);
  data.value.ruta = data.value.ruta._id
  data.value.cliente = idCliente(data.value.cliente);

  enviarInfo[estado.value]()
}

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top"
  })
}

const filter = ref("");

async function generarPDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 500]);
    const { width, height } = page.getSize();
    const size = 10

    const lineasHorizontales = [70, 120, 150, 195, 225, 270, 300, 330, 375, 405];
    lineasHorizontales.forEach((y) => {
        page.drawLine({ start: { x: 40, y: height - y }, end: { x: width - 50, y: height - y }, color: rgb(0, 0, 0) });
    });

    /* const lineasVerticales = [[190, 70, 120],[140, 120, 165], [220, 120, 165], [190, 165, 210],]
    lineasVerticales.forEach(y => {
        page.drawLine({ start: { x: y[0], y: height - y[1] }, end: { x: y[0], y: height - y[2] }, color: rgb(0, 0, 0) })
    }) */

    const dataT = [
        ["Fecha de venta:", 50, 90],
        [convertirFecha(ticket.value.createdAt), 50, 105],
        ["Vendedor:", 190, 90],
        [ticket.value.vendedor.nombre + ' '+ ticket.value.vendedor.apellido, 190, 105],
        [`Cliente: ${ticket.value.cliente.nombre}`, 50, 140],
        ["Cedula:", 50, 170],
        [ticket.value.cliente.cedula, 50, 185],
        ["Teléfono:", 190, 170],
        [ticket.value.cliente.telefono, 190, 185],
        [`Email: ${ticket.value.cliente.email}`, 50, 215],
        ["Fecha de viaje:", 50, 245],
        [convertirFecha(ticket.value.fecha_salida), 50, 260],
        ["Hora:", 190, 245],
        [convertirHora(ticket.value.ruta.hora_salida), 190, 260],
        [`Ciudad origen: ${ticket.value.ruta.ciudad_origen.nombre}`, 50, 290],
        [`Ciudad destino: ${ticket.value.ruta.ciudad_destino.nombre}`, 50, 320],
        ["Puesto:", 50, 350],
        [ticket.value.num_asiento, 50, 365],
        ["Número bus:", 110, 350],
        [ticket.value.bus.numero, 110, 365],
        [`Placa bus: ${ticket.value.bus.placa}`, 190, 350],
        [`Empresa: ${ticket.value.bus.empresa}`, 190, 365],
        [`Precio: ${formatearMoneda(ticket.value.valor)}`, 50, 395],
        ["¡Gracias por su compra!", 140, 430],
        ["¡¡Feliz viaje!!", 160, 455],
    ];
    dataT.forEach(d => {
        page.drawText(d[0], { x: d[1], y: height - d[2], size });
    })

    page.drawLine({ start: { x: 40, y: height - lineasHorizontales[0] }, end: { x: 40, y: height - lineasHorizontales[lineasHorizontales.length-1] }, color: rgb(0, 0, 0) });
    page.drawLine({ start: { x: 350, y: height - lineasHorizontales[0] }, end: { x: 350, y: height - lineasHorizontales[lineasHorizontales.length-1] }, color: rgb(0, 0, 0) });

    page.drawText('PASAJE BUS', { x: 150, y: height - 50, size: 15 });

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    const pdfUrl = URL.createObjectURL(pdfBlob);

    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
        printWindow.onload = () => {
            printWindow.print();
        };
    } else {
        notificar('negative', 'Error, no se pudo abrir la ventana de impresión')
    }
}

function formatearMoneda(numero) {
  const numeroRedondeado = Math.round(numero);
  const partes = new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).formatToParts(numeroRedondeado);
  
  return partes.map(part => {
    if (part.type === 'fraction') {
      return ''; 
    } else {
      return part.value;
    }
  }).join('');
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
          <q-select rounded standout v-model="data.cliente" :options="options.cliente" label="Cliente" />
          <q-select rounded standout v-model="data.ruta" :options="options.ruta" label="Ruta" />
          <q-input filled v-model="date" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input outlined v-model="data.num_asiento" label="Asiento" type="number"></q-input>

          <q-select rounded standout v-model="data.vendedor" :options="options.vendedor" label="Vendedor" />

          <q-btn @click="validarCampos()">Guardar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadingTable" loading-label="Cargando..."
        :filter="filter.trim()" rows-per-page-label="Visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
        no-results-label="No hay resultados para la busqueda" wrap-cells="false">
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
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">
            <q-btn class="botonv1" text-size="1px" padding="10px" :label="props.row.estado === 1 ? 'Activo' : (
              props.row.estado === 0 ? 'Inactivo' :
                '‎  ‎   ‎   ‎   ‎ ')
              " :color="props.row.estado === 1 ? 'positive' : 'accent'" :loading="props.row.estado === 'load'"
              loading-indicator-size="small" @click="
                props.row.estado === 1
                  ? in_activar.inactivar(props.row._id)
                  : in_activar.activar(props.row._id);
              props.row.estado = 'load'" />
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <!-- <q-btn color="warning" icon="edit" class="botonv1" @click="opciones.editar(props.row)" /> -->
            <q-btn color="warning" icon="print" class="botonv1" @click="opciones.imprimir(props.row)" />
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
</style>
