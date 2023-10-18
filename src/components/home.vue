<script setup>
import { ref } from "vue";

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}

</script>


<template>
    <q-layout view="lHr lpR lFr">
        <q-header elevated class="bg-primary text-white">
            <q-toolbar>
                <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

                <q-toolbar-title>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
                    </q-avatar>
                    EMPRESA DE BUSES
                </q-toolbar-title>


            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" bordered class="menudesplegable">
            <div class="opcionescont">
                <p class="menutitle"> = menu desplegable = </p>
                <router-link to="/inicio" class="opcioncont">
                    <button class="opcion">inicio</button>
                </router-link>
                <router-link to="/buses" class="opcioncont">
                    <button class="opcion">buses</button>
                </router-link>
                <router-link to="/usuarios" class="opcioncont">
                    <button class="opcion">usuarios</button>
                </router-link>
                <router-link to="/conductores" class="opcioncont">
                    <button class="opcion">conductores</button>
                </router-link>
                <router-link to="/rutas" class="opcioncont">
                    <button class="opcion">rutas</button>
                </router-link>
                <router-link to="/tiquete" class="opcioncont">
                    <button class="opcion">Tiquete</button>
                </router-link>
            </div>
        </q-drawer>

        <q-page-container>


            <router-view />


        </q-page-container>
    </q-layout>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    font-size: large;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
        "Lucida Sans", Arial, sans-serif;
    text-align: center;
}

.menudesplegable {
    border: solid 2px black;
}

.menutitle {
    font-size: 25px;
    text-align: center;
    font-weight: bold;
    margin: 30px 0px;
}

.opcionescont {
    background-color: white;
    padding: 10px;
    display: grid;
    grid-column: 100%;
    justify-content: left;
}

.opcion {
    width: 100%;
    padding: 5px;
}

.opcioncont {
    margin: 20px;
}
</style>