// console.log("Inicio de la aplicacion");

// if (typeof(Storage) !== "undefined") {
//     console.log("Si hay storage")
// }
// else{
//     console.log("No hay storage")
// }

// // localStorage.setItem("nombre","Roberto")
// // console.log(localStorage.getItem("nombre"))
// // localStorage.removeItem("nombre")

// // sessionStorage.setItem("password","1234567");
// // console.log(sessionStorage.getItem("password"));
// // sessionStorage.removeItem("password");

// class Persona{
//     constructor(nombre, apellido, nroDocumento){
//         this.nombre = nombre;
//         this.apellido=apellido;
//         this.nroDocumento =nroDocumento;
//     }
// }

// let objPersona = new Persona("Roberto","Pineda","001575291");

// console.log(objPersona)

// console.log(JSON.stringify(objPersona))

// //localStorage.setItem("persona",JSON.stringify(objPersona))

// let objPersona2 = JSON.parse(localStorage.getItem("persona"))

// console.log(objPersona2)
// console.log(objPersona2.nombre)


// Sistema de inventario de Kits de Gundam


class Gundam{
    constructor(nombre, descripcion, escala, imagen, isCustom = false, custom){
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.escala = escala;
        this.image = imagen;
        this.isCustom = isCustom;
        this.custom = custom;
    }
}

const Inventario = function () {

    let franquicia, coleccionista;

    function configurar(){}
    function eventos(){}


    return {
        init: function (parametros) {
            franquicia = parametros.franquicia;
            coleccionista = parametros.coleccionista;
            configurar();
            eventos();
        }
    }
}()