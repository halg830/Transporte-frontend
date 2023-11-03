<script setup>
import { ref } from 'vue'
import { useVendedorStore } from "../stores/vendedor2.js";
import { useRutasStore } from "../stores/rutas.js";
import { useClienteStore } from "../stores/clientes2.js";

const useVendedor = useVendedorStore();
const useRutas = useRutasStore();
const useCliente = useClienteStore();

const data = ref({})
const options = ref({})
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
    options.value.ruta = responseRutas.map((c) => c.ciudad_origen.nombre + "/" + c.ciudad_destino.nombre);
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

function seleccionar (){
    alert("h")
}

</script>
<template>
    <h1>Seleccionar cliente</h1>
    <q-select filled v-model="data.cliente" use-input input-debounce="0" label="Simple filter" :options="options.cliente"
        @filter="filterFn" style="width: 250px" behavior="menu" @click="seleccionar()">
        <template v-slot:no-option>
            <q-item>
                <q-item-section class="text-grey">
                    No results
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>