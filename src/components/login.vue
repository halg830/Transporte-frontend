<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router";



const data = ref({
    usuario: "",
    password: ""
})

async function login() {
    const login = await axios.post("vendedor/login", data.value)
    console.log(login);
}

//type="password" v-model="data.password">

</script>

<template>
    <div class="cont">
        <div class="olascont">
            <img class="olaazul" src="../assets/olaazul.svg">
            <img class="olaverde" src="../assets/olaverde.svg">
        </div>
        <div class="opcioncont">
            <p class="tittle">BIENVENIDO</p>
            <p class="subtittle">Por favor ingrese sus datos de usuario para continuar, ¡te esperamos!</p>


            <input class="input opcion" type="text" placeholder="Nombre de usuario" v-model="data.usuario">
            <div class="contrasenacont">
                <input class="input opcion" type="password" placeholder="Contraseña" v-model="data.password">
                <p class="contrasenaayuda">¿olvidaste tu contraseña?</p>
            </div>
            <router-link to="/home" class="ingresarcont">
                <button class="ingresar opcion">Ingresar</button>
            </router-link>
        </div>
    </div>
</template>

<!-- scoped sirve para evitar que los estilos afecte a los
demas componentes  -->
<style scoped>
.paleta {
    background-color:
        #3F497F #29A19C #A3F7BF;
}

* {
    user-select: none;
    margin: 0;
    padding: 0;
}




.tittle {
    margin-top: 20px;
    font-size: 100px;
    font-weight: 700;
    color: #3F497F;
}



.subtittle {
    font-size: 20px;
    font-weight: bold;
    color: #3F497F;
    margin-bottom: 10px;
}



.opcion {
    width: 95vw;
    max-width: 525px;
}

.input {
    background-color: #29A19C;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 20px;
    text-align: left;
    padding: 15px 30px;
    margin-top: 70px;
}



input::placeholder {
    color: rgb(255, 255, 255);
}

.input:focus {
    outline: solid #A3F7BF;
}

.contrasenacont {
    width: min-content;
    margin: auto;
}

.contrasenaayuda {
    text-align: right;
    color: #29A19C;
    font-weight: 700;
    text-decoration-line: underline;
    margin: 10px 0px;
}


.ingresar {
    font-size: 30px;
    font-weight: 700;
    padding: 10px 100px;
    background-color: #3F497F;
    color: white;
    border-radius: 20px;
    margin: 50px 0px;
    border: none;
    transition: transform 0.2s;
}

.ingresar:hover{
    background-color: #46518e;
    transform: scale(0.97);
}

.ingresar:active{
    background-color: #3F497F;
    transform: scale(1);
}

.olascont {
    user-select: none;
    z-index: -1;
    Overflow: hidden;
    position: fixed;
    height: 100vh;
    width: 100vw;
    bottom: 0;
    right: 50%;
    transform: translate(50%, 0);
}

.olaverde,
.olaazul {
    position: absolute;
    width: 100vw;
    min-width: 1280px;
    bottom: 0;
    right: 50%;
    transform: translate(50%, 0);
}


@media screen and (min-height: 850px) {
    .opcioncont {
        margin-top: 5vh;
    }
}

@media screen and (max-width: 640px) {
    .tittle {
        font-size: 80px;
        font-weight: 700;
    }
}

@media screen and (max-width: 500px) {
    .tittle {
        font-size: 55px;
        font-weight: 700;
    }

    .subtittle,
    .input,
    .contrasenaayuda {
        font-size: 17px;
    }

    .ingresar {
        font-size: 20px;
    }
}</style>