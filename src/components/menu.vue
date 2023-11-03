<script setup>
const opciones = [
  "buses",
  "ciudades",
  "clientes",
  "conductores",
  "rutas",
  "ventas",
  "tiquetes",
  "vendedores",
];
const primeraMayuscula = (cadena) =>
  cadena.charAt(0).toUpperCase() + cadena.slice(1);
</script>


<template>
  <div class="q-pa-md example-col-gutter-size">
    <div class="row q-col-gutter-md">
      <div class="col-4" v-for="(opcion, i) in opciones" :key="i">
        <div class="card">
          <div class="card__content">
            <figure class="card" @click="redirigir(opcion)">
              <router-link :to="'/' + opcion" class="opcioncont">
                {{ primeraMayuscula(opcion) }}
                <div class="imagen">
                  <img :src="imagen(opcion)" alt="Opción" class="imagen" />
                </div>
              </router-link>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script >
export default {
  methods: {
    redirigir(opcion) {
      // Realiza la acción de redireccionamiento aquí, por ejemplo:
      this.$router.push("/" + opcion);
    },
    primeraMayuscula(texto) {
      return texto.charAt(0).toUpperCase() + texto.slice(1);
    },
    imagen(opcion) {
      // Asigna rutas de imagen diferentes según la opción
      if (opcion === "buses") {
        return "./src/assets/bus.png"; // Ruta a la imagen de buses
      } else if (opcion === "ciudades") {
        return "./src/assets/ciudad.png"; // Ruta a la imagen de ciudades
      } else if (opcion === "clientes") {
        return "./src/assets/clientes.png"; // Ruta a la imagen de clientes
      } else if (opcion === "conductores") {
        return "./src/assets/conductores.png"; // Ruta a la imagen de clientes
      } else if (opcion === "rutas") {
        return "./src/assets/ruta.png"; // Ruta a la imagen de clientes
      } else if (opcion === "tiquetes") {
        return "./src/assets/tiquetes.png"; // Ruta a la imagen de clientes
      } else if (opcion === "vendedores") {
        return "./src/assets/vendedores.png"; // Ruta a la imagen de clientes
      }
      // Agrega más condiciones para otras opciones
    },
  },
};
</script>

<style>

.imagen {
  height: 81%;
  margin-top: 10px;
}


.opcioncont {
  color: white;
}

.card {
  width: 190px;
  height: 254px;
  border-radius: 20px;
  padding: 5px;
  
}

.card__content {
  background: rgb(175, 176, 204);
  border-radius: 17px;
  width: 100%;
  height: 100%;
}


</style>

<style lang="sass">
.example-col-gutter-size
.my-content
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>