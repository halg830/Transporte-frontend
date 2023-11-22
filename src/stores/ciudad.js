import { defineStore } from "pinia";
import axios from "axios";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import Cookies from "js-cookie";

export const useCiudadStore = defineStore("ciudad", () => {
  const model = "ciudad/";
  const router = useRouter();
  const $q = useQuasar();

  function solicitarToken() {
    const token = Cookies.get("x-token");

    console.log(token);
    if (token == "null") {
      console.log("h");
      notificar("Por favor inicie sesión");
      router.push("/");
      return false;
    }

    return token;
  }

  function notificar(msg) {
    $q.notify({
      type: "negative",
      message: msg,
      position: "top",
    });
  }

  function insertarToken() {
    const token = solicitarToken();

    if (!token) return false;

    const axiosInstance = axios.create({
      headers: {
        "x-token": token,
      },
    });

    return axiosInstance;
  }

  function salir() {
    notificar("Por favor vuelva a iniciar sesión");
    router.push("/");
  }

  const obtener = async () => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const response = await x.get(`${model}all`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const buscarId = async(id)=>{
    try {
      const x = insertarToken();
      if (!x) return null;
      const ciudad = await x.get(`${model}/buscar/${id}`);
          return ciudad.data
    } catch (error) {
      console.log(error);
    }
  }

  const guardar = async (data) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const response = await x.post(`${model}guardar`, data);
      console.log(response);
      return response.data
    } catch (error) {
      console.log(error.response.data);
      return error.response.data
    }
  };

  const editar = async (id, data) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const response = await x.put(`${model}editar/${id}`, data);
      console.log(response);
      return response.data
    } catch (error) {
      console.log(error);
      return error.response.data
    }
  };

  const activar = async (id) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const response = await x.put(`${model}activar/${id}`);
      console.log(response);
      return response.data
    } catch (error) {
      console.log(error);
      return null
    }
  };
  
  const inactivar = async (id) => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const response = await x.put(`${model}inactivar/${id}`);
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
