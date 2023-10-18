import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

export const conductoresfunction = defineStore("ruta", () => {
    let count = ref(0)
    function increment() {
        count.value++
    }

    //esta funcion recoje dos valores, primero la url pricipal 🎯
    //segundo el tipo de accion que deseas realizar 📝
    let info = ref([])
    async function obtener(url, type, id = '') {
        
        if (type == 'cargar') {
            info.value = await axios.get(url + '/cargar')
        }
        if (type == 'buscar') {
            info.value = await axios.get(url + '/buscarID/' + id)
        }
        if (type == 'agregar') {
            info.value = await axios.post(url + '/agregar', informacion.value)
            obtener(url, 'cargar')
        }
        if (type == 'eliminar') {
            info.value = await axios.delete(url + '/eliminar/' + id)
            obtener(url, 'cargar')
        }
        if (type == 'editar') {
            info.value = await axios.put(url + '/modificar/' + id, informacion.value)
            obtener(url, 'cargar')
        }
        if (type == 'activar') {
            info.value = await axios.put(url + '/activar/' + id)
            obtener(url, 'cargar')
        }
        if (type == 'desactivar') {
            info.value = await axios.put(url + '/desactivar/' + id)
            obtener(url, 'cargar')
        }
        //aqui muestra la respuesta del server en la consola 🛠
        console.log('========',info.value.data.conductor)
        
    }

    return {
        count,
        increment,
        obtener,
        info
    }

})

