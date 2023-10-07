<template>
  <div class="cont">
    <div class="opcionescont">
  <router-link to="/" class="opcioncont">
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
 
  </div>
  <router-view></router-view>
  </div>
</template>

<style scoped>
*{
  margin: 0;
  padding: 0;
  font-size: large;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  text-align: center;
}

.opcionescont{
  background-color: white;
  border: solid 2px black;
  padding: 10px;
  display: flex;
}

.opcion{
  padding: 5px;
  margin: auto;
}

.opcioncont{
  margin: auto;
}
</style>
