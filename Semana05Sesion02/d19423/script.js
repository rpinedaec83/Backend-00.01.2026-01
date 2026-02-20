const Reserva = function(){

    let nombre, ciudad;

    function configurar(){
        $("#txtNombre").text(nombre);
        $("#txtCiudad").text(ciudad);
    };
    function eventos(){
        console.log("Inicio de eventos");
        $("#btnReservar").on("click",reservar)
    };
    function reservar(e){
        console.log("Reservar");
        $("#divReserva").hide();
        e.preventDefault();
        

    }
    return {
        init: function(parametros){
            nombre = parametros.nombre;
            ciudad = parametros.ciudad;
            configurar();
            eventos();
        }
    }
}();

class Persona{
    #isLogged = false;
    constructor(dni,nombres, apellidos, direccion, telefono){
        this.dni = dni;
        this.direccion = direccion;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.telefono = telefono;
    }
    getLogged(){
        return this.#isLogged;
    }
    setLogged(newLog){
        //Verifico si ya tiene iniciada la sesion 
        if(this.#isLogged && newLog){
            return "Ya tienes iniciada la sesion"
        }
        else{
            //por el loggin
            if(newLog){
                this.#isLogged = newLog;
                return "Inicio de sesion correcto"
            }
            //por el logout
            else{
                this.#isLogged = newLog;
                return "Cierre de sesion correcto"
            }
        }
    }
    login(){
        console.log(this.setLogged(true));
    }
    logout(){
        console.log(this.setLogged(false))
    }
}

class Cliente extends Persona{
    constructor(dni,nombres, apellidos, direccion, telefono, codCliente){
        super(dni,nombres, apellidos, direccion, telefono);
        this.codCliente = codCliente;
    }
    pagar(medioPago){
        return `El cliente ${this.nombres} ${this.apellidos} esta pagando con ${medioPago}`;
    }
}

class Empleado extends Persona{
    constructor(dni,nombres, apellidos, direccion, telefono, codEmpleado){
        super(dni,nombres, apellidos, direccion, telefono);
        this.codEmpleado = codEmpleado;
    }
    cobrar(cliente, medioPago, monto){
        return `El cliente ${cliente.nombres} ${cliente.apellidos} esta pagando ${monto} con ${medioPago}`
    }
}

class Aviones{
    constructor(matricula, modelo, nroAsientos, capacidadMinima, costoVuelo){
        this.matricula = matricula;
        this.nroAsientos = nroAsientos;
        this.modelo=modelo;
        this.capacidadMinima = capacidadMinima;
        this.costoVuelo = costoVuelo;

        this.arrPasajeros = [];
        this.habilitado = false;
        this.reservado = 0;
    }

    agregarPasajero(pasajero){
        this.arrPasajeros.push(pasajero);
        this.reservado ++;
        if(this.reservado >= this.capacidadMinima) this.habilitado = true;
    }
}

class Reservas{
    constructor(origen, destino, fechaIda, fechaVuelta){
        this.origen = origen;
        this.destino = destino;
        this.fechaIda = fechaIda;
        this.fechaVuelta = fechaVuelta;

        this.avionIda = null;
        this.avionVuelta = null;
    }
    asignarAvionIda(avion){
        this.avionIda = avion;
    }
    asignarAvionVuelta(avion){
        this.avionVuelta = avion;
    }
}