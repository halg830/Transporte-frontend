import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useBusStore = defineStore("bus", () => {
  const model = "bus/";

  const obtener = async () => {
    try {
      const response = await axios.get(`${model}all`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const buscarId = async(id)=>{
    try {
      const bus = await axios.get(`${model}/buscar/${id}`);
          return bus.data.busPopulate
    } catch (error) {
      console.log(error);
    }
  }

  const guardar = async (data) => {
    try {
      const response = await axios.post(`${model}guardar`, data);
      console.log(response);
      return response.data
    } catch (error) {
      console.log(error);
      return null
    }
  };

  const editar = async (data, id) => {
    try {
      const response = await axios.put(`${model}editar/${id}`, data);
      console.log(response);
      return response.data
    } catch (error) {
      console.log(error);
      return null
    }
  };

  const activar = async (id) => {
    try {
      const response = await axios.put(`${model}activar/${id}`);
      console.log(response);
      return response.data
    } catch (error) {
      console.log(error);
      return null
    }
  };
  
  const inactivar = async (id) => {
    try {
      const response = await axios.put(`${model}inactivar/${id}`);
      console.log(response);
      return response.data
    } catch (error) {
      console.log(error);
      return null
    }
  };

  return {
    obtener, buscarId, guardar, editar, activar, inactivar
  };
});
