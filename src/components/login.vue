<script setup>
import { ref } from "vue";
import { useQuasar } from 'quasar'
import { useRouter } from "vue-router";
import { useVendedorStore } from "../stores/vendedor.js";

const $q = useQuasar()
const useVendedor = useVendedorStore();
const router = useRouter();

const data = ref({
  usuario: "",
  contrasena: "",
});

const loading = ref(false);

async function validarIngreso() {
  console.log("Esperando confirmación...");
  loading.value = true;
  const response = await useVendedor.login(data.value);
  console.log(response);

  loading.value = false
  if (response != 200) {
    $q.notify({
          type: 'negative',
          message: 'Usuario o contraseña incorrecto',
          position: "top"
        })
    console.log("Error usuario o contraseña");
    return;
  }
  router.push("/home");
}
</script>

<template>
  <div class="cont">
    <div class="olascont">
      <img class="olaazul" src="../assets/olaazul.svg" />
      <img class="olaverde" src="../assets/olaverde.svg" />
    </div>
    <div class="opcioncont">
      <p class="tittle">BIENVENIDO</p>
      <p class="subtittle">
        Por favor ingrese sus datos de usuario para continuar, ¡te esperamos!
      </p>

      <input
      class="input opcion"
        type="text"
        placeholder="Nombre de usuario"
        v-model="data.usuario"
      />
      <div class="contrasenacont">
        <input
          class="input opcion"
          type="password"
          placeholder="Contraseña"
          v-model="data.contrasena"
        />
        <!-- <p class="contrasenaayuda">¿olvidaste tu contraseña?</p> -->
      </div>

      <q-btn
        class="ingresar opcion"
        @click="validarIngreso()"
        :loading="loading"
        label="Ingresar"
      />
    </div>

    <!-- <q-btn no-caps unelevated color="negative" @click="triggerNegative" label="Trigger 'negative'" /> -->
  </div>
</template>

<!-- scoped sirve para evitar que los estilos afecte a los
demas componentes  -->
<style scoped>
.paleta {
  background-color: #3f497f #29a19c #a3f7bf;
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
  color: #3f497f;
}

.subtittle {
  font-size: 20px;
  font-weight: bold;
  color: #3f497f;
  margin-bottom: 10px;
}

.opcion {
  width: 95vw;
  max-width: 525px;
}

.input {
  background-color: #29a19c;
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
  outline: solid #a3f7bf;
}

.contrasenacont {
  width: min-content;
  margin: auto;
}

.contrasenaayuda {
  text-align: right;
  color: #29a19c;
  font-weight: 700;
  text-decoration-line: underline;
  margin: 10px 0px;
  margin-bottom: 40px;
}

.ingresar {
  font-size: 30px;
  font-weight: 700;
  padding: 10px 100px;
  background-color: #3f497f;
  color: white;
  border-radius: 20px;
  margin: 90px 0px;
  border: none;
  transition: transform 0.2s;
}

.ingresar:hover {
  background-color: #46518e;
  transform: scale(0.97);
}

.ingresar:active {
  background-color: #3f497f;
  transform: scale(1);
}

.olascont {
  user-select: none;
  z-index: -1;
  overflow: hidden;
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
}
</style>
