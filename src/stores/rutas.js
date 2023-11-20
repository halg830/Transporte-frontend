import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useRutasStore = defineStore("ruta", () => {
  const model = "ruta/";

  const obtener = async () => {
    try {
      const response = await axios.get(`${model}all`);
      return response.data.rutasPopulate;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const guardar = async (data) => {
    try {
      const response = await axios.post(`${model}guardar`, data);
      console.log(response);
      return response.data.rutasPopulate
    } catch (error) {
      console.log(error);
      return error.response.data
    }
  };

  const editar = async (id, data) => {
    try {
      const response = await axios.put(`${model}editar/${id}`, data);
      console.log(response);
      return response.data.rutasPopulate
    } catch (error) {
      console.log(error);
      return error.response.data
    }
  };

  const activar = async (id) => {
    try {
      const response = await axios.put(`${model}activar/${id}`);
      console.log(response);
      return response.data.rutasPopulate
    } catch (error) {
      console.log(error);
      return null
    }
  };
  
  const inactivar = async (id) => {
    try {
      const response = await axios.put(`${model}inactivar/${id}`);
      console.log(response);
      return response.data.rutasPopulate
    } catch (error) {
      console.log(error);
      return null
    }
  };

  return {
    obtener, guardar, editar, activar, inactivar
  };
});
