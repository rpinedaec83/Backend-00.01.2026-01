document.getElementById('btnClick2').addEventListener("click", (e) => {
    alert("Hola desde el script que esta en otro archivo");
});


/*var nombre = "Roberto";

console.log(nombre)

var nombre = "David";

console.log(nombre);*/

let nombre = "Roberto";
console.log(nombre);

{
    let nombre = "David";
    console.log(nombre);
}

const PI = 3.1415;


console.log(PI);

//PI = 3.18
let nombreAlumno = "David \n Roberto";
let apellidoAlumno= 'Lopez Tapia';

let talla = "M"

let descripcion = `Muchas gracias señor por presentarse en nuestra solicitud de trabajo
Lo llamaremos en caso de ser aceptado y le pedimos por favor que antes de retirarse realice la parte en blanco del formulario
"Una breve descripción de su persona"
Mido un metro ochenta y uno
Tengo un sillón azul
En mi cuarto hay un baúl
Y me gusta el almendrado
Me despierto alunado
Mi madre es medio terca
Aunque nunca estuve preso, anduve cerca
Soy de Aries, pelo castaño
Algo tacaño y no colecciono nada
Guardo la ropa ordenada
Me aburro en nochebuena
Si estornudo no hago ruido
Y no hablo con la boca llena
Puedo decir que soy de pocos amigos
Pero de mis enemigos, no sé cuantos cosecho
Tengo el ojo derecho desviado
Dicen que soy bueno, aunque no sea bautizado
Nací a las tres de la mañana
Me llevo bien con mi hermana
No creo en ovnis ni en zombies
Y uso prendas talle "${talla}"`;

let edad = 42;

let fechaNacimiento = new Date('1983-08-28');

let edadReal = '42';

if(edad === edadReal){
    console.log("Es igual")
}else{
    console.log("NO Es igual")
}


let edadCliente = 19;
let traeCedulaCliente = true;


if(edadCliente >=18 && traeCedulaCliente){
    console.log("Pasa Diviertete")
}else{
    console.log("Lo siento eres menor de edad");
}

let tieneEfectivo = false;
let tieneTarjeta = false;

if(tieneEfectivo || tieneTarjeta){
    console.log("Puede pagar la entrada")
}else{
    console.log("No puedes pasar")
}


console.log(descripcion)