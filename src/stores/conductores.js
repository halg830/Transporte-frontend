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
    async function obtener(url, type, id = '') {
        let info
        if (type == 'cargar') {
            info = await axios.get(url + '/cargar')
        }
        if (type == 'buscar') {
            info = await axios.get(url + '/buscarID/' + id)
        }
        if (type == 'agregar') {
            info = await axios.post(url + '/agregar', informacion.value)
            obtener(url, 'cargar')
        }
        if (type == 'eliminar') {
            info = await axios.delete(url + '/eliminar/' + id)
            obtener(url, 'cargar')
        }
        if (type == 'editar') {
            info = await axios.put(url + '/modificar/' + id, informacion.value)
            obtener(url, 'cargar')
        }
        if (type == 'activar') {
            info = await axios.put(url + '/activar/' + id)
            obtener(url, 'cargar')
        }
        if (type == 'desactivar') {
            info = await axios.put(url + '/desactivar/' + id)
            obtener(url, 'cargar')
        }
        //aqui muestra la respuesta del server en la consola 🛠
        console.log(info.data)
        //oculta box y el estado ya no es "cargando"
        boxform.value = { box: false, estado: true }
    }

    return {
        count,
        increment,
        obtener
    }

})

