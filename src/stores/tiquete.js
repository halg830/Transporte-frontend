import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useBusStore } from "./buses2.js";
import { useCiudadStore } from "./ciudad2.js";

export const useTiqueteStore = defineStore("tiquete", () => {
  const model = "tiquete/";

  const obtener = async () => {
    try {
      const response = await axios.get(`${model}all`);
      

    const responsePromise = response.data.tiquetePopulate.map(async(element) => {
        const idBus = element.ruta?.bus || undefined;
      const idCiudad =
        element.ruta?.ciudad_origen || undefined;

        console.log(idCiudad);
        if (idBus) {
          
          console.log("b",bus);
        }
        if (idCiudad) {
          const ciudad = await axios.get(`ciudad/buscar/${idCiudad}`);
          return ciudad.data
          console.log("b",ciudad);
        }

        return {idBus, idCiudad}
    });

    const res = await Promise.all(responsePromise)


      return res
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const guardar = async (data) => {
    try {
      const response = await axios.post(`${model}guardar`, data);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const editar = async (data) => {
    try {
      const response = await axios.put(`${model}editar/:id`, data);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const activar = async (id) => {
    try {
      const response = await axios.put(`${model}activar/${id}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const inactivar = async (id) => {
    try {
      const response = await axios.put(`${model}inactivar/${id}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return {
    obtener,
    guardar,
    editar,
    activar,
    inactivar,
  };
});
