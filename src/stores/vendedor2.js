import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useVendedorStore = defineStore("vendedor", () => {
  const model = "vendedor/";
  

  const obtener = async () => {
    try {
      const response = await axios.get(`${model}all`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

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

  const editar = async (id, data) => {
    try {
        console.log(id);
      const response = await axios.put(`${model}editar/${id}`, data);
      console.log(response);
      return response.data.vendedor
    } catch (error) {
      console.log(error);
      return null
    }
  };

  const activar = async (id) => {
    try {
      const response = await axios.put(`${model}activar/${id}`);
      console.log(response);
      return response.data.vendedor
    } catch (error) {
      console.log(error);
      return null
    }
  };
  
  const inactivar = async (id) => {
    try {
      const response = await axios.put(`${model}inactivar/${id}`);
      console.log(response);
      return response.data.vendedor
    } catch (error) {
      console.log(error);
      return null
    }
  };

  const login = async(data)=>{
    try {
      const response = await axios.post(`${model}login`, data)
      console.log(response);

      return response.status
    } catch (error) {
      
    }
  }

  return {
    obtener, guardar, editar, activar, inactivar, login
  };
});