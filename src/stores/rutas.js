import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useRutasStore = defineStore("ruta", () => {
  const model = "ruta/";

  const obtener = async () => {
    try {
      const response = await axios.get(`${model}cargar`);
      return response.data.rutasPopulate;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const guardar = async (data) => {
    try {
      const response = await axios.get(`${model}nuevo`, data);
      console.log(response);
      return response.data
    } catch (error) {
      console.log(error);
      return null
    }
  };

  const editar = async (data) => {
    try {
      const response = await axios.get(`${model}editar`, data);
      console.log(response);
      return response.data
    } catch (error) {
      console.log(error);
      return null
    }
  };

  const activar = async (id) => {
    try {
      const response = await axios.get(`${model}activar/${id}`);
      console.log(response);
      return response.data
    } catch (error) {
      console.log(error);
      return null
    }
  };
  
  const inactivar = async (id) => {
    try {
      const response = await axios.get(`${model}/${id}`);
      console.log(response);
      return response.data
    } catch (error) {
      console.log(error);
      return null
    }
  };

  return {
    obtener, guardar, editar, activar, inactivar
  };
});
