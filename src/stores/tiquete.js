import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useTiqueteStore = defineStore("tiquete", () => {
  const model = "tiquete/";

  const obtener = async () => {
    try {
      const response = await axios.get(`${model}all`);
      console.log(response);
      return response.data.tiquetePopulate;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const asientosOcupados = async (idRuta, fecha_salida) => {
    try {
      console.log(idRuta);
      console.log(fecha_salida);
      const response = await axios.get(
        `${model}asientosOcupados/${idRuta}/${fecha_salida}`
      );

      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const continuarVentas = async () => {
    try {
      const response = await axios.get(`${model}continuarVenta`);
      console.log(response);

      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const guardar = async (data) => {
    try {
      const response = await axios.post(`${model}guardar`, data);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };

  const editar = async (id, data) => {
    try {
      console.log("a", id, data);
      const response = await axios.put(`${model}editar/${id}`, data);
      console.log(response);
      return response.data.tiquetePopulate;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };

  const activar = async (id) => {
    try {
      const response = await axios.put(`${model}activar/${id}`);
      console.log(response);
      return response.data.tiquetePopulate;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const inactivar = async (id) => {
    try {
      const response = await axios.put(`${model}inactivar/${id}`);
      console.log(response);
      return response.data.tiquetePopulate;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return {
    obtener,
    asientosOcupados,
    continuarVentas,
    guardar,
    editar,
    activar,
    inactivar,
  };
});
