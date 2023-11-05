<script setup>
import { ref } from 'vue'
import { useClienteStore } from "../stores/clientes.js";
import { useRutasStore } from '../stores/rutas.js';
import { useVendedorStore } from '../stores/vendedor.js';

const useCliente = useClienteStore();
const useRutas = useRutasStore()
const useVendedor = useVendedorStore()

const data = ref({ ruta: {} })
const date = ref("")
const options = ref({ ruta: { ciudad_origen: [] } })
const models = ref({})

const obtenerOptions = async () => {
    const responseVendedor = await useVendedor.obtener();
    const responseRutas = await useRutas.obtener();
    const responseCliente = await useCliente.obtener();

    console.log(responseVendedor);
    console.log(responseRutas);
    console.log(responseCliente);

    options.value.vendedor = responseVendedor.vendedor.map((c) => c.nombre);
    models.value.vendedor = responseVendedor.vendedor;
    options.value.ruta.ciudad_origen = responseRutas.map((c) => c.ciudad_origen.nombre);
    options.value.ruta.ciudad_destino = responseRutas.map((c) => c.ciudad_destino.nombre);
    options.value.ruta.hora_salida = responseRutas.map((c) => convertirHora(c.hora_salida));
    console.log(options.value);
    models.value.ruta = responseRutas;
    options.value.cliente = responseCliente.cliente.map((c) => c.cedula);
    models.value.cliente = responseCliente.cliente;
};
obtenerOptions()

function filterFn(val, update) {
    if (val === '') {
        update(() => {
            options.value.cliente = options.value.cliente
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        options.value.cliente = options.value.cliente.filter(v => v.toLowerCase().indexOf(needle) > -1)
    })


}

function idRuta(ruta) {

    const buscar = models.value.ruta.find(
        (c) => c.ciudad_origen.nombre == ruta.ciudad_origen && c.ciudad_destino.nombre == ruta.ciudad_destino && convertirHora(c.hora_salida) == ruta.hora_salida
    );
    if (buscar) return buscar._id;

    return ruta;
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
</script>
<template>
    <div>
        <q-btn>Nueva venta</q-btn>
        <q-btn>Continuar venta</q-btn>
    </div>
    <div v-if="componentes.inicio" id="inicio">
        
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
    </div>
</template>

<style scoped>
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