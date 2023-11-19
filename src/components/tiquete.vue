<script setup>
import { computed, ref } from 'vue'
import { useClienteStore } from "../stores/clientes.js";
import { useRutasStore } from '../stores/rutas.js';
import { useVendedorStore } from '../stores/vendedor.js';
import { useQuasar, QSpinnerGears } from 'quasar';
import { useTiqueteStore } from '../stores/tiquete';

const useTiquete = useTiqueteStore()
const useCliente = useClienteStore();
const useRutas = useRutasStore()
const useVendedor = useVendedorStore()
const $q = useQuasar()
const conVenta = ref('ruta')

const data = ref({ num_asiento: 0 })

function fechaActual() {
    const fecha = new Date
    const formatoFecha = `${fecha.getFullYear()}/${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${fecha.getDate().toString().padStart(2, '0')}`;

    return formatoFecha
}

const date = ref(fechaActual())
const options = ref({ ruta: [] })
const models = ref({})

const obtenerOptions = async () => {
    const rutas = await useTiquete.continuarVentas()
    console.log(rutas);
    const responseRutas = await useRutas.obtener();

    const rutasVentas = rutas.map(c => { return { label: c.ruta.ciudad_origen.nombre + "/" + c.ruta.ciudad_destino.nombre + "/" + convertirHora(c.ruta.hora_salida), value: c.ruta._id, fecha_salida: c.fecha_salida } })

    const conjuntoLabels = new Set();
    const datosFiltrados = rutasVentas.filter((item) => {
        // Si el label ya está en el conjunto, devolvemos false para filtrar el elemento
        if (conjuntoLabels.has(item.label)) {
            return false;
        }
        // Agregamos el label al conjunto
        conjuntoLabels.add(item.label);
        // Devolvemos true para incluir el elemento en el array filtrado
        return true;
    });
    console.log(datosFiltrados);

    options.value.rutasVentas = datosFiltrados
    models.value.rutasVentas = rutas;

    options.value.ruta = responseRutas.map((c) => { return { label: c.ciudad_origen.nombre + "/" + c.ciudad_destino.nombre + "/" + convertirHora(c.hora_salida), value: c._id } });
    models.value.ruta = responseRutas;
};
obtenerOptions()

const opcionesFiltro = ref({
    bus: options.value[conVenta.value]
})
function filterFnRuta(val, update) {
    if (val === '') {
        update(() => {
            opcionesFiltro.value.ruta = options.value[conVenta.value]
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        opcionesFiltro.value.ruta = options.value[conVenta.value].filter(v => v.label.toLowerCase().indexOf(needle) > -1) || []
    })
}

const cantAsientos = ref(0)

async function buscarRuta(id) {
    await verificarAsiento()

    const buscar = models.value.ruta.find(r => r._id === id)
    console.log("a", asientosOcupados.value.length, "b", buscar.bus.asiento);
    if(asientosOcupados.value.length == buscar.bus.asiento){
        notificar('negative', 'Ya no hay asientos disponibles')
        return false
    }
    cantAsientos.value = buscar.bus.asiento
    if (buscar) return buscar.bus.asiento

    return id
}

function idCliente(cedula) {
    const buscar = models.value.cliente.find((c) => c.cedula === cedula);
    if (buscar) return buscar._id;

    return cedula;
}

const asientos = ref(0)

const componentes = ref({
    inicio: false,
    asiento: false,
    fin: false
})
function continuar() {
    if (options.value.cliente.includes(data.value.cliente)
        && options.value.ruta.ciudad_origen.includes(data.value.ruta.ciudad_origen)
        && options.value.ruta.ciudad_destino.includes(data.value.ruta.ciudad_destino)
        && options.value.ruta.hora_salida.includes(data.value.ruta.hora_salida)
        && date.value != "") {

        componentes.value.inicio = false
        componentes.value.asiento = true
        const buscar = models.value.ruta.find(r => r._id === idRuta(data.value.ruta))
        data.value.ruta = buscar._id
        data.value.fecha_salida = date.value
        data.value.cliente = idCliente(data.value.cliente)
        asientos.value = buscar.bus.asiento
        return
    }

    console.log("cliente erroneo");
}

function irFin(n) {
    data.value.asiento = n
    componentes.value.asiento = false
    componentes.value.fin = true
}

function convertirHora(cadenaFecha) {
    const fecha = new Date(cadenaFecha);
    const horas = fecha.getUTCHours().toString().padStart(2, "0");
    const minutos = fecha.getUTCMinutes().toString().padStart(2, "0");

    const horaFormateada = `${horas}:${minutos}`;
    return horaFormateada;
}

const modal = ref(false)
const opciones = ref(true)

async function onSubmit() {
    if (date.value.trim() === "") {
        notificar('negative', "Por favor complete todos los campos")
        return
    }

    data.value.fecha_salida = convertirFechaBD(date.value)

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
    }

    if(conVenta.value==='rutasVentas'){
        const buscar = models.value.rutasVentas.find(e=>convertirFecha(e.fecha_salida)===date.value&&e.ruta._id===data.value.ruta.value)
        console.log(buscar);

        if(!buscar){
            notificar('negative', 'No se han generado ventas en esa fecha')
            return
        }
    }


    const r = await buscarRuta(data.value.ruta.value)

    if(!r) return
    modal.value = false
    opciones.value = false
    console.log("onsubmit", data.value)
    data.value.ruta = data.value.ruta.value
}

function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top"
    })
}
const dataCliente = ref({ cedula: "" })
function onReset() {
    data.value = { ruta: "" }
    date.value = fechaActual()
}

function onResetCliente() {
    dataCliente.value = { cedula: "" }
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

const asientosOcupados = ref([])

async function verificarAsiento() {
    console.log(data.value);
    const idRuta = data.value.ruta.value
    const fecha = data.value.fecha_salida

    const response = await useTiquete.asientosOcupados(idRuta, fecha)
    console.log(response);

    // response.forEach((t) => asientosOcupados.value.push(t.num_asiento))
    asientosOcupados.value = response.map(t => t.num_asiento)
    console.log(asientosOcupados.value);

    return true
}

const asientoSel = ref(0)

const vendedorTemp = "652f05b63db578d921c61edd"


async function buscarCliente() {
    if (dataCliente.value.cedula.trim() === "") {
        notificar('negative', 'Por favor ingrese la cedula')
        return false
    }
    const response = await useCliente.buscarxCC(dataCliente.value.cedula)

    console.log(response);
    if (response.length <= 0) {
        notificar('negative', 'El cliente no esta registrado')
        return false
    }
    dataCliente.value = response[0]
    return true
}

async function guardarCliente() {
    if (!validar()) return

    const response = await useCliente.guardar(dataCliente.value)
    console.log(response);

    dataCliente.value = response.cliente
    notificar('positive', 'Cliente guardado exitosamente')
}

function validar() {
    const arrData = Object.entries(dataCliente.value)
    console.log(arrData);
    for (const d of arrData) {
        if (d[0] === null) {
            notificar('negative', "Por favor complete todos los campos")
            return false
        }

        if (typeof d[0] === "string") {
            if (d[0].trim() === "") {
                notificar('negative', "Por favor complete todos los campos")
                return false
            }
        }
    }

    return true
}

async function validarCampos() {

    if (!validar()) return
    const resBuscar = await buscarCliente()
    console.log("r", resBuscar);
    if (!resBuscar) {
        /* const res = await confirmarCliente()
        console.log("r2", res);
        if (!res) return  */
        return
    }

    console.log("h", data.value);

    data.value.cliente = dataCliente.value._id
    data.value.vendedor = vendedorTemp


    console.log(data.value);

    showCustom()
}

const ticket = ref({})
async function generarTicket() {
    try {
        console.log(data.value);

        const response = await useTiquete.guardar(data.value);
        console.log(response);

        if (!response.data.tiquetePopulate) {
            notificar("negative", response)
            return
        }
        const resData = response.data.tiquetePopulate
        notificar("positive", "Guardado exitosamente")
        asientosOcupados.value.push(resData.num_asiento)
        ticket.value = resData

    } catch (error) {
        console.log(error);
    }
}

function nuevaVenta() {
    modal.value = true
    data.value = { num_asiento: 0 }
    date.value = fechaActual()
    dataCliente.value = { cedula: "" }
    conVenta.value = 'ruta'
}

function formatear() {
    data.value = { num_asiento: 0, ruta: ticket.value.ruta._id, fecha_salida: ticket.value.fecha_salida }
    dataCliente.value = { cedula: "" }
    console.log("f", data.value);
}

function regresar() {
    opciones.value = true
    data.value.num_asiento = 0
}

async function confirmarCliente() {
    $q.dialog({
        title: 'Cliente no registrado',
        message: '¿Desea guardar el cliente?',
        cancel: true,
        persistent: true
    }).onOk(async () => {
        await guardarCliente()
        return true
    }).onCancel(async () => {
        // console.log('>>>> Cancel')
        return false
    }).onDismiss(async () => {
        // notificar('negative', 'Seleccione una opción')
    })
}

function convertirFecha(cadenaFecha) {
    const fecha = new Date(cadenaFecha);
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const dia = fecha.getDate().toString().padStart(2, "0");

    const fechaFormateada = `${año}/${mes}/${dia}`;
    return fechaFormateada;
}

async function showCustom() {
    const dialog = $q.dialog({
        title: 'Generando',
        dark: false,
        progress: true,
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
    })

    await generarTicket()

    console.log(ticket.value);

    const mensaje = `
    <main>
        <span>------------------------------------------</span>
        <section>
            <article>
                <span>Cliente: ${ticket.value.cliente.nombre}</span> 
                <span>Cedula: ${ticket.value.cliente.cedula}</span> 
            </article>
            <article> 
                <span>Email: ${ticket.value.cliente.email}</span> 
            </article>  
        </section>
        <span>------------------------------------------</span>
        <section>
            <article>
                <span>Fecha de viaje: ${convertirFecha(ticket.value.fecha_salida)}</span>
                <span>Hora: ${convertirHora(ticket.value.ruta.hora_salida)}</span>
            </article>
            <article>
                <span>Ciudad origen: ${ticket.value.ruta.ciudad_origen.nombre}</span>
                <span>Ciudad destino: ${ticket.value.ruta.ciudad_destino.nombre}</span>
            </article>
        </section>
        <span>------------------------------------------</span>
        <section>
            <article>
                <span>Puesto: ${ticket.value.num_asiento}</span>
                <span>Bus(placa): ${ticket.value.ruta.bus.placa}</span>
            </article>    
            <article>
                <span>Empresa: ${ticket.value.ruta.bus.empresa}</span>
            </article>    
        </section>
        <span>------------------------------------------</span>
        <section>
            <span>Fecha compra: ${convertirFecha(ticket.value.createdAt)}</span> 
            <span>Vendedor: ${ticket.value.vendedor.nombre}</span>
        </section>
        <span>------------------------------------------</span>
    </main>`

    dialog.update({
        title: 'Ticket',
        message: mensaje,
        progress: false,
        html: true,
        ok: true
    }).onOk(() => {
        formatear()
    })
}


function optionsFecha(fecha) {
    if (conVenta.value==='rutasVentas') return fecha >'0000/00/00'

    const fechaA = fechaActual()
    console.log(fechaA);
    return fecha >= fechaA
}

function continuarVenta() {
    nuevaVenta()
    conVenta.value = 'rutasVentas'
}

</script>
<template>
    <div>
        <div v-if="opciones">
            <q-btn label="Nueva venta" color="primary" @click="nuevaVenta" />
            <q-btn @click="continuarVenta">Continuar venta</q-btn>
        </div>

        <q-dialog v-model="modal">
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section>
                    <div class="text-h6">Generar venta</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                        <!-- <span>Ruta: </span> -->
                        <q-select filled v-model:model-value="data.ruta" use-input input-debounce="0" label="Ruta"
                            :options="opcionesFiltro.ruta" @filter="filterFnRuta" style="width: 250px" behavior="menu"
                             lazy-rules
                            :rules="[val => val != null || 'Por favor ingrese una ruta']">
                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                        Sin resultados
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>

                        <!-- <span>Fecha salida: </span> -->
                        <q-input label="Fecha de salida" filled v-model="date" mask="date"
                            :rules="['date', val => val.trim() != '' || 'Ingrese una fecha']">
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="date" :options="optionsFecha">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>

                        <div>
                            <q-btn label="Ver asientos" type="submit" color="primary" />
                            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                        </div>
                    </q-form>
                </q-card-section>

                <!-- <q-card-actions align="right" class="bg-white text-teal">
                
            </q-card-actions> -->
            </q-card>
        </q-dialog>

        <div v-if="!opciones" class="contCrear">
            <q-btn label="Regresar" @click="regresar"></q-btn>
            <div v-if="verificarAsiento">
                <q-btn v-for="a in cantAsientos" :class="asientosOcupados.includes(String(a)) ? 'ocupado' : 'desocupado'"
                    @click="data.num_asiento = a" :disable="asientosOcupados.includes(String(a))" :label="a" />

            </div>

            <div v-if="data.num_asiento != 0">

                <span>Asiento #{{ data.num_asiento }}</span>

                <div>
                    <q-btn label="Buscar cliente" @click="buscarCliente" />
                    <q-btn label="Guardar cliente" @click="guardarCliente" />
                </div>

                <div>
                    <q-form @submit="validarCampos" @reset="onResetCliente" class="q-gutter-md">
                        <span>Cedula cliente: </span>
                        <q-input outlined v-model="dataCliente.cedula" label="Cedula" type="text" maxlength="10" lazy-rules
                            :rules="[val => val.trim() != '' || 'Por favor ingrese una cedula']"></q-input>
                        <span>Teléfono: </span>
                        <q-input outlined v-model="dataCliente.email" label="Email" type="email" lazy-rules
                            :rules="[val => val.trim() != '' || 'Por favor ingrese un email']"></q-input>
                        <span>Nombre: </span>
                        <q-input outlined v-model="dataCliente.nombre" label="Nombre" type="text" maxlength="15" lazy-rules
                            :rules="[val => val.trim() != '' || 'Por favor ingrese un nombre']"></q-input>

                        <q-btn label="Confirmar venta" type="submit" color="primary" />
                        <q-btn label="🗑" type="reset" color="primary" flat class="q-ml-sm" />
                    </q-form>
                </div>
            </div>
        </div>
    </div>







    <!-- <div v-if="componentes.inicio" id="inicio">
        
        <h3>Generar ticket</h3>
        <span>Cliente: </span>
        <q-select filled v-model="data.cliente" use-input input-debounce="0" label="cedula" :options="options.cliente"
            @filter="filterFn" style="width: 250px" behavior="menu" @keyup.enter="continuar">
            <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                        No results
                    </q-item-section>
                </q-item>
            </template>
        </q-select>

        <span>Ciudad origen: </span>

        <q-select filled v-model="data.ruta.ciudad_origen" use-input input-debounce="0" label="Nombre"
            :options="options.ruta.ciudad_origen" @filter="filterFn" style="width: 250px" behavior="menu"
            @keyup.enter="continuar">
            <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                        No results
                    </q-item-section>
                </q-item>
            </template>
        </q-select>
        <span>Ciudad destino: </span>
        <q-select filled v-model="data.ruta.ciudad_destino" use-input input-debounce="0" label="Nombre"
            :options="options.ruta.ciudad_destino" @filter="filterFn" style="width: 250px" behavior="menu"
            @keyup.enter="continuar">
            <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                        No results
                    </q-item-section>
                </q-item>
            </template>
        </q-select>
        <span>Hora salida: </span>
        <q-select filled v-model="data.ruta.hora_salida" use-input input-debounce="0" label="Hora"
            :options="options.ruta.hora_salida" @filter="filterFn" style="width: 250px" behavior="menu"
            @keyup.enter="continuar">
            <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                        No results
                    </q-item-section>
                </q-item>
            </template>
        </q-select>

        <span>Fecha salida: </span>
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

        <q-btn @click="continuar()">Continuar</q-btn>
    </div>
    <div v-if="componentes.asiento" id="contAsientos">
        <div id="asientos">
            <q-btn v-for="n in asientos" :key="n" class="btnAsientos" @click="irFin(n)">{{ n }}</q-btn>

        </div>
    </div>
    <div v-if="componentes.fin">
        <div>
            <span>Vendedor: </span>
            <q-select filled v-model="data.vendedor" use-input input-debounce="0" label="Vendedor"
                :options="options.vendedor" @filter="filterFn" style="width: 250px" behavior="menu"
                @keyup.enter="continuar">
                <template v-slot:no-option>
                    <q-item>
                        <q-item-section class="text-grey">
                            No results
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>
        </div>
    </div> -->
</template>

<style scoped>
.ocupado {
    background-color: red;
}

.desocupado {
    background-color: white;
}

.contCrear {
    display: flex;
}


#inicio {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}

h3 {
    margin: 40px;
}

#contAsientos {
    display: flex;
    justify-content: center;
}

#asientos {
    max-width: 70vw;
    min-height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    align-content: center;
}

.btnAsientos {
    width: 5vw;
    height: 5vw;
    margin: 20px;
}
</style>