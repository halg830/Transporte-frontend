<script setup>
const opciones = ["buses", "ciudades", "clientes", "conductores", "rutas", "tiquete", "vendedor"]
const primeraMayuscula = (cadena) => cadena.charAt(0).toUpperCase() + cadena.slice(1)
</script>


<template>
    <div class="q-pa-md example-col-gutter-size">
        <div class="row q-col-gutter-md">
            <div class="col-4" v-for="(opcion, i) in opciones" :key="i">
                <div class="cards">
                    
                </div>
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
</template>
<script >
export default {
    methods: {
        redirigir(opcion) {
            // Realiza la acción de redireccionamiento aquí, por ejemplo:
            this.$router.push('/' + opcion);
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
            }else if (opcion === "conductores") {
                return "./src/assets/conductores.png"; // Ruta a la imagen de clientes
            }else if (opcion === "rutas") {
                return "./src/assets/ruta.png"; // Ruta a la imagen de clientes
            }else if (opcion === "tiquete") {
                return "./src/assets/tiquetes.png"; // Ruta a la imagen de clientes
            }else if (opcion === "vendedor") {
                return "./src/assets/vendedores.png"; // Ruta a la imagen de clientes
            }
            // Agrega más condiciones para otras opciones
        }
    }
};
</script>

<style>
.cards {
    perspective: 500px;
}
.imagen{
    height: 81%;
    margin-top: 10px;
}
.card {
    width: 200px;
    height: 250px;
    background: #d5d4d4;
    border: 2px solid #555555;
    border-radius: 4px;
    position: relative;
    transform-style: preserve-3d;
    will-change: transform;
    transition: transform .5s;
}

.opcioncont {
    color: white;
}

.card:hover {
    transform: translateZ(10px) rotateX(20deg) rotateY(20deg);
}

.card_title {
    color: #fff;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    transition: transform .5s;
    font: 700 1.5rem monospace;
    text-shadow: -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;
}

.card:hover .card_title {
    transform: translateZ(50px);
}
</style>

<style lang="sass">
.example-col-gutter-size
  .my-content
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>