<script setup>
const opciones = ["buses", "ciudades", "clientes", "conductores", "rutas", "tiquete", "vendedor"]
const primeraMayuscula = (cadena) => cadena.charAt(0).toUpperCase() + cadena.slice(1)
</script>


<template>
    <div class="q-pa-md example-col-gutter-size">
        <div class="row q-col-gutter-md">
            <div class="col-4" v-for="(opcion, i) in opciones" :key="i">
                <router-link :to="'/' + opcion" class="opcioncont">
                    <button class="opcion">{{ primeraMayuscula(opcion) }}</button>
                </router-link>
            </div>

        </div>
    </div>
</template>

<style lang="sass">
.example-col-gutter-size
  .my-content
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>