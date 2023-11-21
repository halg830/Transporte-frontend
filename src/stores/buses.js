import { defineStore } from "pinia";
import axios from "axios";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export const useBusStore = defineStore("bus", () => {
  const router = useRouter();
  const $q = useQuasar()

  const model = "bus/";

  function solicitarToken(){
    const token = localStorage.getItem("x-token");

    console.log(token);
    if (token=='null') {
      console.log('h');
      notificar('Por favor inicie sesión')
      router.push('/')
      return false
    }

    return token
  }

  function notificar(msg) {
    $q.notify({
      type: 'negative',
      message: msg,
      position: "top",
    });
  }

  function insertarToken(){
    const token = solicitarToken()

    if(!token) return false

    const axiosInstance = axios.create({
      headers: {
        'x-token': token
      }
    });

    return axiosInstance
  }

  const obtener = async () => {
    try {
      const x = insertarToken()
      if(!x) return null

      const response = await x.get(`${model}all`);
      return response.data;
    } catch (error) {
      console.error(error);
      if(error.message==="Network Error") {
        notificar('Sin conexión, por favor intente recargar')
        return null
      }
      return error.response.data;
    }
  };

  const buscarId = async (id) => {
    try {
      const x = insertarToken()
      if(!x) return null

      const bus = await x.get(`${model}/buscar/${id}`);
      return bus.data.busPopulate;
    } catch (error) {
      console.log(error);
      if(error.message==="Network Error") {
        notificar('Sin conexión, por favor intente recargar')
        return null
      }
      return error.response.data;
    }
  };

  const guardar = async (data) => {
    try {
      const x = insertarToken()
      if(!x) return null

      const response = await x.post(`${model}guardar`, data);
      console.log(response);
      return response.data.busPopulate;
    } catch (error) {
      console.log("e", error);
      if(error.message==="Network Error") {
        notificar('Sin conexión, por favor intente recargar')
        return null
      }
      return error.response.data;
    }
  };

  const editar = async (id, data) => {
    try {
      const x = insertarToken()
      if(!x) return null

      console.log(id, data);
      const response = await x.put(`${model}editar/${id}`, data);
      console.log(response);
      return response.data.busPopulate;
    } catch (error) {
      console.log(error);
      if(error.message==="Network Error") {
        notificar('Sin conexión, por favor intente recargar')
        return null
      }
      return error.response.data;
    }
  };

  const activar = async (id) => {
    try {
      const x = insertarToken()
      if(!x) return null

      const response = await x.put(`${model}activar/${id}`);
      console.log(response);
      return response.data.busPopulate;
    } catch (error) {
      console.log(error);
      if(error.message==="Network Error") {
        notificar('Sin conexión, por favor intente recargar')
        return null
      }
      return error.response.data;
    }
  };

  const inactivar = async (id) => {
    try {
      const x = insertarToken()
      if(!x) return null

      const response = await x.put(`${model}inactivar/${id}`);
      console.log(response);
      return response.data.busPopulate;
    } catch (error) {
      console.log(error);
      if(error.message==="Network Error") {
        notificar('Sin conexión, por favor intente recargar')
        return null
      }
      return error.response.data;
    }
  };

  return {
    obtener,
    buscarId,
    guardar,
    editar,
    activar,
    inactivar,
  };
});
