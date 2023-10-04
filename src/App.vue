<template>
  <div class="cont">
    <div class="opcionescont">
  <button class="opcion"><router-link to="/">inicio</router-link></button>
  <button class="opcion"><router-link to="/buses">buses</router-link></button>
  <button class="opcion"><router-link to="/usuarios">usuarios</router-link></button>
  <button class="opcion"><router-link to="/conductores">conductores</router-link></button>
  <button class="opcion"><router-link to="/rutas">rutas</router-link></button>
 
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
</style>
