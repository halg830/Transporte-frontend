import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useRutasStore = defineStore("ruta", () => {
  const rutas = ref([]);
  const obtener = async () => {
    try {
      const response = await axios.get("ruta/cargar");
      rutas.value = response.data;
      return response.data; // Devuelve los datos obtenidos
    } catch (error) {
      console.error("Error al obtener las rutas", error);
      return null;
    }
  };

  return {
    rutas,
    obtener,
  };
});
