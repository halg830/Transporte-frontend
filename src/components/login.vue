<script setup>
import { ref } from "vue"
const usuario = ref("")
const password = ref("")

</script>

<template>
    <div>
        <div>
            <h5>Usuario:</h5>
            <input type="text" v-model="usuario">
            <h5>Contraseña:</h5>
            <input type="password" v-model="password">
            <router-link to="/home" >
                <button class="opcion">buses</button>
            </router-link>
        </div>
    </div>
    <router-view />
</template>