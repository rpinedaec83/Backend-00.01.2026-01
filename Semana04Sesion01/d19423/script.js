console.log("Inicio de la aplicacion");


function sumadora(primerNumero, segundoNumero) {
    let resultado = primerNumero + segundoNumero;
    // console.log(resultado);
    return resultado;
}

let prueba = sumadora(33, 44);

console.log(prueba)

function restadora() {
    let primerNumero = Number.parseInt(prompt("Dame el primer numero"));
    let segundoNumero = Number.parseInt(prompt("Dame el segundo numero"));

    return primerNumero - segundoNumero
}

//console.log(restadora());

let multiplicacion = function (primerNumero, segundoNumero) {
    return primerNumero * segundoNumero;
}

console.log(multiplicacion(55, 88))


const division = (a, b) => { return a / b };

console.log(division(66, 55))

// console.log(restadora());


// console.log(restadora());


let objAuto = {
    nroMatricula: 'BJJ0001',
    tipoTrasmision: 'Automatico',
    tipoCombustible: 'GNV',
    color: "#4125dcbc",
    marca: "BMW",
    modelo: "M3",
    kilometraje: 40000.99,
    soat: true,
    encender: () => {
        console.log(`El auto se esta encendiendo`);

    },
    apagar: () => {
        console.log(`El auto se esta apagando`)
    }
}

console.log(objAuto.nroMatricula)

objAuto.encender()
objAuto.apagar();

console.log(Object.keys(objAuto));
console.log(Object.values(objAuto));

console.log(Object.entries(objAuto));


for (const [k, v] of Object.entries(objAuto)) {
    console.log(`El key es ${k} y el valor es ${v}`)
}

for (const k in objAuto) {
    console.log(k)
    console.log(objAuto[k])
}


///////////////////////////////////////////////////////////////

async function registrar() {
    console.log("Inicio de registro")
    // let nombres = prompt("Dame tu nombre");
    // let correo = prompt("Dame tu correo electronico");
    // let telefono = prompt("Dame tu telefono");
    const { value: formValues } = await Swal.fire({
        title: "Registro",
        html: `
            <input id="nombre" class="swal2-input" placeholder="Dame tu nombre">
            <input id="correo" class="swal2-input" placeholder="Dame tu correo electronico">
            <input id="telefono" class="swal2-input" placeholder="Dame tu telefono">`,
        icon: "info",
        confirmButtonText: "Registrar",
        showCancelButton: true,
        preConfirm: () => {
            const nombre = document.getElementById("nombre").value;
            const correo = document.getElementById("correo").value;
            const telefono = document.getElementById("telefono").value;
            return {
                nombre, correo, telefono
            }
        }
    });

    if (formValues) {
        if (!validarCorreo(formValues.correo)) {
            Swal.fire({
                title: "Correo Invalido",
                text: `el correo no es valido ${formValues.correo}`,
                icon: "error"
            });
        }
        else if (!isValidE164(formValues.telefono)) {
            Swal.fire({
                title: "Telefono Invalido",
                text: `el telefono no es valido ${formValues.telefono}`,
                icon: "error"
            });
        }
        else {
            document.getElementById("lblNombre").innerText = homologarNombre(formValues.nombre)
            document.getElementById("lblCorreo").innerText = formValues.correo;
            document.getElementById("lblTelefono").innerText = formValues.telefono;
            document.getElementById("divUsuario").style.display = "block";

            document.getElementById("btnRegister").disabled = true;
            document.getElementById("btnSalir").disabled = false;

        }


    }
}

function homologarNombre(strNombre) {
    return strNombre.toUpperCase();
}
function validarCorreo(strCorreo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(strCorreo);
}

function normalizePhone(input) {
    return input.replace(/[^\d+]/g, ""); // deja solo dígitos y +
}

function isValidE164(input) {
    const phone = normalizePhone(input);
    return /^\+[1-9]\d{1,14}$/.test(phone);
}


document.getElementById('btnRegister').addEventListener("click", registrar);


document.getElementById("btnSalir").addEventListener("click", function () {
    document.getElementById("divUsuario").style.display = "none";
    document.getElementById("btnRegister").disabled = false;
    document.getElementById("btnSalir").disabled = true;
})


document.getElementById("btnLogin").addEventListener("click",()=>{
    Swal.fire("Vamos a loguearnos")
})
