<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router";



const data = ref({
    usuario: "",
    password: ""
})

async function login(){
    const login = await axios.post("vendedor/login", data.value)

    console.log(login);
}

</script>

<template>
    <div>
        <div>
            <h1>Login</h1>
            <div>
                <h5>Usuario:</h5>
                <input type="text" v-model="data.usuario">
                <h5>Contraseña:</h5>
                <input type="password" v-model="data.password">
                <router-link to="/home" >
                    <button class="opcion">Ingresar</button>
                </router-link>
            </div>
        </div>
        <router-view />
    </div>
    
</template>