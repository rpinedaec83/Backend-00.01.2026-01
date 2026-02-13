//ejercicio01();
function ejercicio01() {
  console.log("Inicio del ejercicio 01");
  let strNumero = prompt("Ingresa tu numero");

  let numero = Number.parseInt(strNumero);

  if (Number.isNaN(numero)) {
    Swal.fire({
      title: "Respuesta",
      text: "Debes digitar numeros no palabras",
      icon: "error",
    });
  } else {
    if (numero > 99 && numero < 1000) {
      Swal.fire({
        title: "Respuesta",
        text: "Si tiene 3 digitos",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Respuesta",
        text: "No tiene 3 digitos",
        icon: "error",
      });
    }
  }
  console.log(numero);

  console.log("Fin del ejercicio 01");
}

// ejercicio02();
function ejercicio02() {
  let strNumero = prompt("Ingresa un valor numerico");
  let num = Number.parseInt(strNumero);
  if (Number.isNaN(num)) {
    Swal.fire({
      title: "Respuesta",
      text: "Ingresa un valor numerico no palabras",
      icon: "error",
    });
  } else {
    if (num >= 1) {
      Swal.fire({
        title: "Respuesta",
        text: ` ${num} es un numero  entero`,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Respuesta",
        text: `El numero ${num} no es entero`,
        icon: "error",
      });
    }
  }
  console.log(num);
  console.log(typeof num);
  console.log("Fin del ejercicio numero 2");
}

// ejercicio 03
function ejercicio03() {
  let valorDato = prompt("Ingresa un valor numerico:");
  let numero = Number.parseInt(valorDato);

  if (Number.isNaN(numero)) {
    Swal.fire({
      title: "Respuesta",
      text: "Ingresar un valor numerico porfavor, no un texto",
      icon: "error",
    });
  } else {
    if (numero % 10 === 4) {
      Swal.fire({
        title: "Respuesta",
        text: `El numero es , ${numero} y termina en 4 `,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Respuesta",
        text: `El numero es, ${numero} pero no termina en 4`,
      });
    }
  }
  console.log(numero);
  console.log("Fin del ejercicio 3");
}

//ejercicio04

function ejercicio04() {
  let primerValor, segundoValor, tercerValor;
  do {
    primerValor = Number(prompt("Ingesar el primer numero:"));
    segundoValor = Number(prompt("Ingresa el segundo valor:"));
    tercerValor = Number(prompt("Ingresa el tercer valor:"));

    if (primerValor < 0 || segundoValor < 0 || tercerValor < 0) {
      Swal.fire({
        title: "Respuesta",
        text: `Sus valores ingresados fueron ${primerValor}, ${segundoValor}, ${tercerValor}, debe ingresar enteros`,
        icon: "warning",
      });
    }
  } while (primerValor < 0 || segundoValor < 0 || tercerValor < 0);

  if (primerValor > segundoValor) {
    let remplaza1 = primerValor;
    primerValor = segundoValor;
    segundoValor = remplaza1;
  }
  if (primerValor > tercerValor) {
    let remplaza3 = primerValor;
    primerValor = tercerValor;
    tercerValor = remplaza3;
  }
  if (segundoValor > tercerValor) {
    let remplaza2 = segundoValor;
    segundoValor = tercerValor;
    tercerValor = remplaza2;
  }
  Swal.fire({
    title: "Respuesta",
    text: `Los numeros ordenados son: ${primerValor} , ${segundoValor} , ${tercerValor}`,
    icon: "success",
  });
}

//ejercicio05
function ejercicio05() {
  let cantidad = Number(
    prompt("Ingresar la cantidad de zapatos que desea comprar:"),
  );
  let precio = 80;
  let totalPago = precio * cantidad;
  let descuento, precioFinal;
  if (cantidad > 10 && cantidad <= 20) {
    descuento = (10 * totalPago) / 100;
    precioFinal = totalPago - descuento;
    Swal.fire({
      title: "Respuesta",
      text: `La cantidad de zapatos que compro es de ${cantidad} y tiene un precio total de : ${totalPago}$
            Con un descuento del 10% su total a pagar seria de ${precioFinal}$`,
      icon: "success",
    });
  } else {
    if (cantidad > 20 && cantidad <= 30) {
      descuento = (20 * totalPago) / 100;
      precioFinal = totalPago - descuento;
      Swal.fire({
        title: "Respuesta",
        text: `La cantidad de zapatos que compro es de ${cantidad} y tiene un precio total de : ${totalPago}$
            Con un descuento del 20% su total a pagar seria de ${precioFinal}$`,
        icon: "success",
      });
    } else {
      if (cantidad > 30) {
        descuento = (40 * totalPago) / 100;
        precioFinal = totalPago - descuento;
        Swal.fire({
          title: "Respuesta",
          text: `La cantidad de zapatos que compro es de ${cantidad} y tiene un precio total de : ${totalPago}$
            Con un descuento del 40% su total a pagar seria de ${precioFinal}$`,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Respuesta",
          text: `Su total a pagar es de ${totalPago} si desea un descuento debe llevar una cantidad de zapatos mayor a 10 `,
          icon: "info",
        });
      }
    }
  }
}
// ejercicio06
function ejercicio06() {
  let horas = prompt("Ingresa tus horas trabajadas:");
  let num = Number.parseInt(horas);
  let extra, semanal, total;
  let horasNormales = 20;
  let horasExtra = 25;
  let horasTotales = num * horasNormales;
  if (Number.isNaN(num)) {
    Swal.fire({
      title: "Respuesta",
      text: "Ingresar un valor numerico porfavor, no ingrese palabras",
      icon: "error",
    });
  } else {
    if (num <= 40) {
      Swal.fire({
        title: "Respuesta",
        text: `Tu sueldo es de , ${horasTotales}`,
        icon: "success",
      });
    } else {
      if (num > 40) {
        extra = num - 40;
        semanal = extra * horasExtra;
        total = 40 * 20 + semanal;
        Swal.fire({
          title: "Respuesta",
          text: `Tu ssueldo semanal mas horas extra es de ${total}$`,
          icon: "success",
        });
      }
    }
  }
}

//ejercicio07
function ejercicio07() {
  let precio, menbresia, totalPagar, descuento;
  do {
    precio = Number(prompt("Ingresar el precio"));
    menbresia = prompt("Cual es su tipo de menbresia (A,B o C):");
    if (menbresia !== "A" && menbresia !== "B" && menbresia !== "C") {
      Swal.fire({
        title: "Respuesta",
        text: `La menbresia ingresada ${menbresia} no es correcta porfavor ingrese uno de esto: (A , B o C)`,
        icon: "error",
      });
    }
    if (isNaN(precio) || precio <= 0) {
      Swal.fire({
        title: "Respuesta",
        text: `El valor ingresado es ${precio} ingresa un valor numerico mayor a 0`,
        icon: "error",
      });
    }
  } while (
    (menbresia !== "A" && menbresia !== "B" && menbresia !== "C") ||
    isNaN(precio) ||
    precio <= 0
  );
  switch (menbresia) {
    case "A":
      descuento = precio * 0.1;
      totalPagar = precio - descuento;
      Swal.fire({
        title: "Respuesta",
        text: `Usted tiene una menbresia ${menbresia} y tiene un descuento del 10% el total a pagar es de ${totalPagar}$`,
        icon: "success",
      });
      break;
    case "B":
      descuento = precio * 0.15;
      totalPagar = precio - descuento;
      Swal.fire({
        title: "Respuesta",
        text: `Usted tiene una menbresia ${menbresia} y tiene un descuento del 15% el total a pagar es de ${totalPagar}$`,
        icon: "success",
      });
      break;
    case "C":
      descuento = precio * 0.2;
      totalPagar = precio - descuento;
      Swal.fire({
        title: "Respuesta",
        text: `Usted tiene una menbresia ${menbresia} y tiene un descuento del 20% el total a pagar es de ${totalPagar}$`,
        icon: "success",
      });
      break;
  }
}

// ejercico 08
function ejercicio08() {
  let valorDigito1, valorDigito2, valorDigito3, promedio;
  while (true) {
    valorDigito1 = Number(prompt("Ingresar la primera nota:"));
    valorDigito2 = Number(prompt("Ingresar la segunda nota:"));
    valorDigito3 = Number(prompt("Ingresar la tercera nota:"));

    if (
      isNaN(valorDigito1) ||
      valorDigito1 < 0 ||
      isNaN(valorDigito2) ||
      valorDigito2 < 0 ||
      isNaN(valorDigito3) ||
      valorDigito3 < 0
    ) {
      Swal.fire({
        title: "Respuesta",
        text: "Porfavor ingresa un numero positivo",
        icon: "warning",
      });
    } else {
      break;
    }
  }
  promedio = (valorDigito1 + valorDigito2 + valorDigito3) / 3;
  if (promedio >= 10.5 && promedio <= 20) {
    Swal.fire({
      title: "Respuesta",
      text: `El estudiante saco ${promedio} 
        APROBO`,
      icon: "success",
    });
  } else {
    Swal.fire({
      title: "Respuesta",
      text: `El estudiante saco ${promedio}
        NO APROBO`,
      icon: "error",
    });
  }
}

// ejercicio09

function ejercicio09() {
  let sueldo, aumento, sueldoFinal;
  sueldo = Number(prompt("Ingresar su sueldo ganado:"));
  if (isNaN(sueldo)) {
    Swal.fire({
      title: "Respuesta",
      text: `Ingrese un valor numerico`,
      icon: "warning",
    });
  }
  if (sueldo > 2000) {
    aumento = sueldo * 0.05;
    sueldoFinal = sueldo + aumento;
    Swal.fire({
      title: "Respuesta",
      text: `Usted tiene un aumento del 5% y su aumento es de ${aumento}$ y tiene un sueldo final de ${sueldoFinal}$`,
      icon: "success",
    });
  } else {
    if (sueldo <= 2000) {
      aumento = sueldo * 0.1;
      sueldoFinal = sueldo + aumento;
      Swal.fire({
        title: "Respuesta",
        text: `Usted tiene un aumento del 10% y su aumento es de ${aumento}$ y tiene un sueldo final de ${sueldoFinal}$`,
        icon: "success",
      });
    }
  }
}

// ejercicio10
function ejercicio10() {
  let valorDato = Number(prompt("Ingresar un valor numerico:"));
  if (isNaN(valorDato)) {
    Swal.fire({
      title: "Respuesta",
      text: `El valor ingresado no es un numero, porfavor ingresar un valor numerico`,
      icon: "warning",
    });
  } else {
    if (valorDato % 2 === 0) {
      Swal.fire({
        title: "Respuesta",
        text: `El numero ${valorDato} es un numero par`,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Respuesta",
        text: `EL numero ${valorDato} es un numero impar`,
        icon: "error",
      });
    }
  }
}

// ejercicio11
function ejercicio11() {
  let valor1, valor2, valor3;
  valor1 = Number(prompt("Ingresa el primer número :"));
  valor2 = Number(prompt("Ingresa el segundo número:"));
  valor3 = Number(prompt("Ingresa el tercer número:"));

  if (
    isNaN(valor1) ||
    valor1 < 0 ||
    isNaN(valor2) ||
    valor2 < 0 ||
    isNaN(valor3) ||
    valor3 < 0
  ) {
    Swal.fire({
      title: "Respuesta",
      text: `Valor no valido ${valor1} ${valor2} ${valor3}, porfavor ingresar un valor númerico`,
      icon: "warning",
    });
  } else {
    if (valor1 > valor2 && valor1 > valor3) {
      Swal.fire({
        title: "Respuesta",
        text: `El número ${valor1} es el mayor número`,
        icon: "success",
      });
    } else {
      if (valor2 > valor1 && valor2 > valor3) {
        Swal.fire({
          title: "Respuesta",
          text: `El número ${valor2} es el mayor número`,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Respuesta",
          text: `El número ${valor3} es el mayor número`,
          icon: "success",
        });
      }
    }
  }
}

// ejercicio 12

function ejercicio12() {
  let primerDigito, segundoDigito, numero1, numero2;
  primerDigito = Number(prompt("Ingresar el primer número:"));
  segundoDigito = Number(prompt("Ingresa el segundo número:"));
  numero1 = Number.parseInt(primerDigito);
  numero2 = Number.parseInt(segundoDigito);
  if (isNaN(numero1) || numero1 < 0 || isNaN(numero2) || numero2 < 0) {
    Swal.fire({
      title: "Respuesta",
      text: `Porfavor ingresar un número positivo`,
      icon: "warning",
    });
  } else {
    if (numero1 > numero2) {
      Swal.fire({
        title: "Respuesta",
        text: `El número ${numero1} es mayor`,
        icon: "asucces",
      });
    } else {
      Swal.fire({
        title: "Respuesta",
        text: `El numero ${numero2} es mayor`,
        icon: "success",
      });
    }
  }
}
// ejercicio13

function ejercicio13() {
  let letra;

  letra = prompt("Ingresa una letra:");
  if (letra === "A" || letra === "a") {
    Swal.fire({
      title: "Respuesta",
      text: `La letra ${letra} es una vocal`,
      icon: "success",
    });
  } else {
    if (letra === "E" || letra === "e") {
      Swal.fire({
        title: "Respuesta",
        text: `La letra ${letra} es una vocal`,
        icon: "success",
      });
    } else {
      if (letra === "I" || letra === "i") {
        Swal.fire({
          title: "Respuesta",
          text: `La letra ${letra} es una vocal`,
          icon: "success",
        });
      } else {
        if (letra === "O" || letra === "o") {
          Swal.fire({
            title: "Respuesta",
            text: `La letra ${letra} es una vocal`,
            icon: "success",
          });
        } else {
          if (letra === "U" || letra === "u") {
            Swal.fire({
              title: "Respuesta",
              text: `La letra ${letra} es una vocal`,
              icon: "success",
            });
          } else {
            if (Number.isNaN(Number(letra))) {
              Swal.fire({
                title: "Respuesta",
                text: `La letra ${letra} no es una vocal`,
                icon: "error",
              });
            } else {
              Swal.fire({
                title: "Problema",
                text: `Ingreso un número ${letra} porfavor ingrese un caracter`,
                icon: "warning",
              });
            }
          }
        }
      }
    }
  }
}
//ejercicio14
function ejercicio14() {
  let valorNumero;
  do {
    valorNumero = Number(prompt("Escriba un número del 1 al 10:"));

    if (Number.isNaN(valorNumero) || valorNumero < 1 || valorNumero > 10) {
      Swal.fire({
        title: "Error",
        text: "Por favor, ingresa un número válido entre 1 y 10",
        icon: "error",
      });
    }
  } while (Number.isNaN(valorNumero) || valorNumero < 1 || valorNumero > 10);

  if (
    valorNumero === 2 ||
    valorNumero === 3 ||
    valorNumero === 5 ||
    valorNumero === 7
  ) {
    Swal.fire({
      title: "Respuesta",
      text: `El número ${valorNumero} es primo`,
      icon: "success",
    });
  } else {
    Swal.fire({
      title: "Respuesta",
      text: `El número ${valorNumero} no es primo`,
      icon: "error",
    });
  }
}

//ejercicio15
function ejercicio15() {
  let centimetros, pulgadas, libras, kilogramos;
  centimetros = parseFloat(prompt("Ingrese los centimetros:"));
  libras = parseFloat(prompt("Ingrese las libras:"));

  if (
    Number.isNaN(centimetros) ||
    Number.isNaN(libras) ||
    centimetros <= 0 ||
    libras <= 0
  ) {
    Swal.fire({
      title: "Error",
      text: `Porfavor ingresa un valor correcto`,
      icon: "warning",
    });
  } else {
    pulgadas = centimetros / 2.54;
    kilogramos = libras * 0.453592;
    Swal.fire({
      title: "Respuesta",
      text: `Los centimetros ingresados fueron ${centimetros} y las pulgadas serian ${pulgadas.toFixed(4)}.
      Las libras ingresadas fueron ${libras} y los kilogramos serian ${kilogramos.toFixed(4)}`,
    });
  }
}
//ejercicio16
function ejercicio16() {
  let diaSemana = parseInt(prompt("Ingresa un numero del 1 al 7:"));
  if (Number.isNaN(diaSemana)) {
    Swal.fire({
      title: "Caracter no permitido",
      text: `Porfavor ingresa un valor númerico entre el 1 al 7 para saber el dia de la semana`,
      icon: "warning",
    });
  } else {
    switch (diaSemana) {
      case 1:
        Swal.fire({
          title: "Respuesta",
          text: `El dia es lunes`,
          icon: "success",
        });
        break;
      case 2:
        Swal.fire({
          title: "Respuesta",
          text: `El dia es martes`,
          icon: "success",
        });
        break;
      case 3:
        Swal.fire({
          title: "Respuesta",
          text: `El dia es miercoles`,
          icon: "success",
        });
        break;
      case 4:
        Swal.fire({
          title: "Respuesta",
          text: `El dia es jueves`,
          icon: "success",
        });
        break;
      case 5:
        Swal.fire({
          title: "Respuesta",
          text: `El dia es viernes`,
          icon: "success",
        });
        break;
      case 6:
        Swal.fire({
          title: "Respuesta",
          text: `El dia es sabado`,
          icon: "success",
        });
        break;
      case 7:
        Swal.fire({
          title: "Respuesta",
          text: `El dia es domingo`,
          icon: "success",
        });
        break;

      default:
        Swal.fire({
          title: "Error",
          text: `Elegiste ${diaSemana} debes elegir un rango entre el 1 al 7`,
          icon: "warning",
        });
        break;
    }
  }
}

//ejercicio17
function ejercicio17() {
  let hora, minuto, segundos;

  hora = parseInt(prompt("Ingresar la hora:"));
  minuto = parseInt(prompt("Ingresar los minutos:"));
  segundos = parseInt(prompt("Ingresar los segundo:"));

  if (Number.isNaN(hora) || Number.isNaN(minuto) || Number.isNaN(segundos)) {
    Swal.fire({
      title: "Respuesta",
      text: "Ingresa un valor correcto",
      icon: "error",
    });
  } else {
    segundos++;
    if (segundos === 60) {
      segundos = 0;
      minuto++;
    }
    if (minuto === 60) {
      minuto = 0;
      hora++;
    }
    if (hora === 24) {
      hora = 0;
    }

    Swal.fire({
      title: "Respuesta",
      text: `La hora de un segundo sera de ${hora} : ${minuto} : ${segundos}`,
      icon: "success",
    });
  }
}

//ejercicio18
function ejercicio18() {
  let cantidad, precio, total, ganancia;

  cantidad = parseInt(prompt("Ingrese la cantidad de los CD:"));

  if (Number.isNaN(cantidad)) {
    Swal.fire({
      title: "Error",
      text: `Ingrese un valor valido`,
      icon: "warning",
    });
  } else {
    if (cantidad <= 9) {
      precio = 10;
    }
    if (cantidad >= 10 && cantidad <= 99) {
      precio = 8;
    }
    if (cantidad >= 100 && cantidad <= 499) {
      precio = 7;
    }
    if (cantidad >= 500) {
      precio = 6;
    }
    total = cantidad * precio;
    ganancia = total * 0.0825;
    Swal.fire({
      title: "Respuesta",
      text: `Precio total para el cliente es de ${total}$ .
La ganancia para el vendedor es de ${ganancia.toFixed(2)}$`,
      icon: "success",
    });
  }
}

//ejercicio19
function ejercicio19() {
  let primerDigito, segundoDigito, sueldo;
  do {
    primerDigito = parseInt(prompt("Ingresa el ID del trabajador:"));
    segundoDigito = parseInt(
      prompt("Ingresa los dias laborales del trabajador:"),
    );
  } while (
    Number.isNaN(primerDigito) ||
    primerDigito < 1 ||
    primerDigito > 4 ||
    Number.isNaN(segundoDigito) ||
    segundoDigito < 0 ||
    segundoDigito > 6
  );
  switch (primerDigito) {
    case 1:
      sueldo = segundoDigito * 56;
      Swal.fire({
        title: "Respuesta",
        text: `El sueldo del trabajador es de ${sueldo}$`,
        icon: "success",
      });
      break;
    case 2:
      sueldo = segundoDigito * 64;
      Swal.fire({
        title: "Respuesta",
        text: `El sueldo del trabajador es de ${sueldo}$`,
        icon: "success",
      });
      break;
    case 3:
      sueldo = segundoDigito * 80;
      Swal.fire({
        title: "Respuesta",
        text: `El sueldo del trabajador es de ${sueldo}$`,
        icon: "success",
      });
      break;
    case 4:
      sueldo = segundoDigito * 48;
      Swal.fire({
        title: "Respuesta",
        text: `El sueldo del trabajador es de ${sueldo}$`,
        icon: "success",
      });
      break;
  }
}

//ejercicio20
function ejercicio20() {
  let primerDato, segundoDato, tercerDato, cuartoDato, pares, numeroMayor;
  primerDato = parseInt(prompt("Ingresa el primer valor:"));
  segundoDato = parseInt(prompt("Ingresa el segundo valor:"));
  tercerDato = parseInt(prompt("Ingresa el tercer valor:"));
  cuartoDato = parseInt(prompt("Ingresa el cuarto valor:"));
  if (
    Number.isNaN(primerDato) ||
    Number.isNaN(segundoDato) ||
    Number.isNaN(tercerDato) ||
    Number.isNaN(cuartoDato)
  ) {
    Swal.fire({
      title: "Error",
      text: `Ingresa un valor numerico no un caracter`,
      icon: "warning",
    });
  } else {
    pares = 0;
    numeroMayor = primerDato;
    if (primerDato % 2 === 0) {
      pares++;
    }
    if (segundoDato % 2 === 0) {
      pares++;
    }
    if (tercerDato % 2 === 0) {
      pares++;
    }
    if (cuartoDato % 2 === 0) {
      pares++;
    }
    if (segundoDato > numeroMayor) {
      numeroMayor = segundoDato;
    }
    if (tercerDato > numeroMayor) {
      numeroMayor = tercerDato;
    }
    if (cuartoDato > numeroMayor) {
      numeroMayor = cuartoDato;
    }
    Swal.fire({
      title: "Respuesta",
      text: `Hay ${pares}, pares. 
      El numero mayor es: ${numeroMayor}`,
      icon: "success",
    });
  }
  if (tercerDato % 2 === 0) {
    Swal.fire({
      title: "Respuesta",
      text: `El cuadrado del 2do numeroes de :${segundoDato * segundoDato}`,
      icon: "success",
    });
  }
  if (primerDato < segundoDato) {
    Swal.fire({
      title: "Respuesta",
      text: `La media de los 4 números es de :${(primerDato + segundoDato + tercerDato + cuartoDato) / 4}`,
      icon: "success",
    });
  }
  if (segundoDato > tercerDato && tercerDato >= 50 && tercerDato <= 700) {
    Swal.fire({
      title: "Respuesta",
      text: `La suma de los cuatro numeros  es de :${primerDato + segundoDato + tercerDato + cuartoDato}`,
      icon: "success",
    });
  }
}

//ejercicio21
function ejercicio21() {
  let valorIngresado, factorial;
  valorIngresado = parseInt(prompt("Ingresa un valor númerico:"));
  if (Number.isNaN(valorIngresado)) {
    Swal.fire({
      title: "Error",
      text: `Ingresa un valor adecuado`,
      icon: "error",
    });
  } else {
    factorial = 1;
    for (let i = 1; i <= valorIngresado; i++) {
      factorial = factorial * i;
    }
    Swal.fire({
      title: "Respuesta",
      text: `El factorial del numero es de ${factorial}`,
      icon: "success",
    });
  }
}

//ejercicio22
function ejercicio22() {
  let primerValor, i, s;
  primerValor = parseInt(prompt("Ingresa un número:"));
  if (Number.isNaN(primerValor) | (primerValor <= 0)) {
    Swal.fire({
      title: "Error",
      text: `Ingresa un número entero`,
      icon: "warning",
    });
  } else {
    i = 1;
    s = 0;
    while (i <= primerValor) {
      s = s + i;
      i = i + 1;
    }
    Swal.fire({
      title: "Respuesta",
      text: `La suma de los ${primerValor} es de ${s}`,
      icon: "success",
    });
  }
}

//ejercicio23
function ejercicio23() {
  let primerValor, i, s;
  primerValor = parseInt(prompt("Ingresa un número:"));
  if (Number.isNaN(primerValor) | (primerValor <= 0)) {
    Swal.fire({
      title: "Error",
      text: `Ingresa un número entero`,
      icon: "warning",
    });
  } else {
    i = 1;
    s = 0;
    while (i <= primerValor) {
      s = s + i;
      i = i + 2;
    }
    Swal.fire({
      title: "Respuesta",
      text: `La suma de los numeros impares de ${primerValor} es de ${s}`,
      icon: "success",
    });
  }
}

//ejercicio24

function ejercicio24() {
  let i, s;
  i = 2;
  s = 0;
  while (i <= 1000) {
    s = s + i;
    i = 2 + i;
  }
  Swal.fire({
    title: "Respuesta",
    text: `La suma de todos los numeros pares hasta 1000 son: ${s}`,
    icon: "success",
  });
}

//ejercicio25
function ejercicio25() {
  let numero, factorial, valorOriginal;

  numero = parseInt(prompt("Ingrese un número:"));
  factorial = 1;
  valorOriginal = numero;

  if (Number.isNaN(numero) || numero < 0) {
    Swal.fire({
      title: "Error",
      text: "Ingresa un número entero ",
      icon: "error",
    });
  } else {
    while (numero > 1) {
      factorial = factorial * numero;
      numero--;
    }

    Swal.fire({
      title: "Resultado",
      text: `El factorial de ${valorOriginal} es: ${factorial}`,
      icon: "success",
    });
  }
}

//ejercicio26
function ejercicio26() {
  let dividiendo, divisor, cociente;
  dividiendo = parseInt(prompt("Ingrese el valor del dividendo:"));
  divisor = parseInt(prompt("Ingrese el valor del divisor:"));
  if (
    Number.isNaN(dividiendo) ||
    Number.isNaN(divisor) ||
    dividiendo < 0 ||
    divisor < 0
  ) {
    Swal.fire({
      title: "Error",
      text: "Ingresa un número entero ",
      icon: "error",
    });
  } else {
    cociente = 0;
    while (dividiendo >= divisor) {
      dividiendo = dividiendo - divisor;
      cociente++;
    }
    Swal.fire({
      title: "Respuesta",
      text: `El valor del cociente es de :${cociente}.
      El valor del resto es de : ${dividiendo}`,
      icon: "success",
    });
  }
}
// ejercicio27
function ejercicio27() {
  let valorNumero, suma, contador, media;

  suma = 0;
  contador = 0;

  do {
    valorNumero = parseFloat(
      prompt("Ingresa un número positivo (ingresa un negativo para terminar):"),
    );

    if (!isNaN(valorNumero) && valorNumero >= 0) {
      suma += valorNumero;
      contador++;
    }
  } while (valorNumero >= 0);

  if (contador > 0) {
    media = suma / contador;

    Swal.fire({
      title: "Respuesta",
      text: `La media de los numeros es de ${media}`,
      icon: "success",
    });
  } else {
    Swal.fire({
      title: "Respuesta",
      text: "No ingresaste ningún número positivo.",
      icon: "info",
    });
  }
}
//ejercicio28

function ejercicio28() {
  let i, s;
  i = 1;
  s = 0;
  do {
    s = s + i;
    i++;
  } while (i <= 100);
  Swal.fire({
    title: "Respuesta",
    text: `La suma de todos los 100 primeros numeros es de : ${s}`,
    icon: "success",
  });
}

//ejercicio29

function ejercicio29() {
  let i, s;
  i = 1;
  s = 0;
  while (i <= 100) {
    s = s + i;
    i++;
  }
  Swal.fire({
    title: "Respuesta",
    text: `La suma de todos los 100 primeros numeros es de : ${s}`,
    icon: "success",
  });
}

//ejercicio30
function ejercicio30() {
  let suma, i;
  suma = 0;
  for (i = 1; i <= 100; i++) {
    suma = suma + i;
  }
  Swal.fire({
    title: "Respuesta",
    text: `La suma de los 100 primeros números es de ${suma}`,
    icon: "success",
  });
}

//ejercicio31
function ejercicio31() {
  let numeroPar, i, valorIngresado, totalPares, numeroImpar, totalImpares;
  numeroPar = 0;
  numeroImpar = 0;
  totalImpares = 0;
  totalPares = 0;

  for (i = 1; i <= 4; i++) {
    valorIngresado = parseInt(prompt(` ${i} Ingresa un valor numérico:`));

    if (Number.isNaN(valorIngresado) || valorIngresado < 0) {
      Swal.fire({
        title: "Respuesta",
        text: `Ingresa un valor numérico positivo`,
        icon: "warning",
      });
      i--;
    } else {
      if (valorIngresado % 2 === 0) {
        numeroPar = numeroPar + valorIngresado;
        totalPares++;
      } else {
        numeroImpar = numeroImpar + valorIngresado;
        totalImpares++;
      }
    }
  }
  let resultadoFinal = "";
  if (totalPares > 0) {
    resultadoFinal += `La media de los números pares es: ${(numeroPar / totalPares).toFixed(1)}\n`;
  } else {
    resultadoFinal += `No se ingresaron números pares\n`;
  }

  if (totalImpares > 0) {
    resultadoFinal += `La media de los números impares es: ${(numeroImpar / totalImpares).toFixed(2)}`;
  } else {
    resultadoFinal += `No se ingresaron números impares`;
  }
  Swal.fire({
    title: "Respuesta",
    text: resultadoFinal,
    icon: "success",
  });
}

//ejercicio32
function ejercicio32() {
  let poblacion, mayorPoblacion, ciudad, ciudadMayor;
  ciudadMayor = prompt("Ingresar la ciudad:");
  if (!isNaN(ciudadMayor) && ciudadMayor !== "") {
    Swal.fire({
      title: "Error",
      text: "Ingrese un caracter , no un numero",
      icon: "warning",
    });
    return;
  }

  mayorPoblacion = parseInt(
    prompt("Ingresar el tamaño de la población de " + ciudadMayor + ":"),
  );
  if (Number.isNaN(mayorPoblacion)) {
    Swal.fire({
      title: "Error",
      text: "Ingrese un numero , no un caracter",
      icon: "warning",
    });
    return;
  }
  for (let i = 2; i <= 33; i++) {
    ciudad = prompt(`Ingresar la ciudad ${i}:`);

    if (!isNaN(ciudad) && ciudad !== "") {
      alert("Valor ingresado no valido, se saltara este registro");
      continue;
    }

    poblacion = parseInt(prompt(`Ingresar la población de ${ciudad}:`));

    if (Number.isNaN(poblacion)) {
      alert("Valor ingresado no valido, se saltara este registro");
      continue;
    }

    if (poblacion > mayorPoblacion) {
      mayorPoblacion = poblacion;
      ciudadMayor = ciudad;
    }
  }
  Swal.fire({
    title: "Respuesta",
    text: `La ciudad con más población es: ${ciudadMayor} con ${mayorPoblacion} habitantes.`,
    icon: "success",
  });
}

//ejercicio33
function ejercicio33() {
  let programa;
  do {
    alert("El programa se esta ejecutando");
    programa = prompt("Desea seguir en el programa: (SI/NO)");
  } while (
    programa === "SI" ||
    programa === "si" ||
    programa === "Si" ||
    !isNaN(programa)
  );

  Swal.fire({
    title: "Respuesta",
    text: "El programa se a cerrado",
    icon: "success",
  });
}

//ejercicio34

function ejercicio34() {
  let i, j, multiplicacion, resultadoFinal;
  resultadoFinal = "";
  for (i = 1; i <= 9; i++) {
    resultadoFinal += `   TABLA DEL (${i})   `;
    for (j = 1; j <= 9; j++) {
      multiplicacion = i * j;
      resultadoFinal += `${i} x ${j} = ${multiplicacion}`;
    }
  }
  Swal.fire({
    title: "Tablas de Multiplicar",
    text: resultadoFinal,
    icon: "success",
  });
}
//ejercicio35
function ejercicio35() {
  let numeroIngresado, mayorNumero, menorNumero, i;

  numeroIngresado = parseInt(prompt("Ingresa el número :"));
  if (Number.isNaN(numeroIngresado)) {
    Swal.fire({
      title: "Error",
      text: "Ingresa un valor numerico",
      icon: "warning",
    });
    return;
  }

  mayorNumero = numeroIngresado;
  menorNumero = numeroIngresado;

  i = 2;

  while (i <= 20) {
    numeroIngresado = parseInt(prompt(`Ingresa el número ${i}:`));
    if (Number.isNaN(numeroIngresado)) {
      alert("Ingresa un valor numerico");
      continue;
    }
    if (numeroIngresado > mayorNumero) {
      mayorNumero = numeroIngresado;
    }
    if (numeroIngresado < menorNumero) {
      menorNumero = numeroIngresado;
    }

    i = i + 1;
  }
  Swal.fire({
    title: "Resultados",
    text: `El mayor número es: ${mayorNumero}
           El menor número es: ${menorNumero}`,
    icon: "success",
  });
}
//ejercicio36
function ejercicio36() {
  let primerValor, i, a, b, c;
  a = 0;
  b = 1;
  ((c = 0),
    (primerValor = parseInt(prompt("Ingrese la cantidad del numero:"))));
  if (Number.isNaN(primerValor) || primerValor <= 0) {
    Swal.fire({
      title: "Resultado",
      text: `Error ingrese un valor numerico`,
      icon: "error",
    });
  } else {
    for (i = 1; i <= primerValor; i++) {
      c = a + b;
      a = b;
      b = c;
    }
    Swal.fire({
      title: "Resultado",
      text: `El numerico de la serie de fibonacci es: ${a}`,
      icon: "success",
    });
  }
}
//ejercicio37
function ejercicio37() {
  let primerValor, segundoValor, b, r, a;
  primerValor = parseInt(prompt("Ingresa el primer número:"));
  segundoValor = parseInt(prompt("Ingresa el segundo numero:"));
  if (
    Number.isNaN(primerValor) ||
    primerValor <= 0 ||
    Number.isNaN(segundoValor) ||
    segundoValor <= 0
  ) {
    Swal.fire({
      title: "Respuesta",
      text: "Ingresa un valor numerico",
      icon: "warning",
    });
  } else {
    a = primerValor;
    b = segundoValor;

    while (b !== 0) {
      r = a % b;
      a = b;
      b = r;
    }
    Swal.fire({
      title: "Respuesta",
      text: `El M.C.D del numero es de ${a}`,
      icon: "success",
    });
  }
}
//ejeercicio38
function ejercicio38() {
  let primerValor, suma;
  primerValor = parseInt(prompt("Ingresa un valor númerico:"));
  if (Number.isNaN(primerValor) || primerValor < 0) {
    Swal.fire({
      title: "Respuesta",
      text: "Ingresa un valor numerico",
      icon: "warning",
    });
  } else {
    suma = 0;
    for (let i = 1; i < primerValor; i++) {
      if (primerValor % i === 0) {
        suma = suma + i;
      }
    }
    if (suma === primerValor) {
      Swal.fire({
        title: "Respuesta",
        text: `El numero ${primerValor} es un numero perfecto`,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Respuesta",
        text: `El numero ${primerValor} no es un numero perfecto`,
        icon: "error",
      });
    }
  }
}
//ejercicio39
function ejercicio39() {
  let valorIngresado = parseInt(prompt("Ingresa la cantidad del numero:"));
  if (Number.isNaN(valorIngresado) || valorIngresado <= 0) {
    Swal.fire({
      title: "Error",
      text: "Ingresa un valor numerico",
      icon: "warning",
    });
  } else {
    let p = 0;
    let signo = 1;
    for (let i = 1; i <= valorIngresado; i++) {
      p = p + signo * (4 / (2 * i - 1));
      signo = signo * -1;
    }
    Swal.fire({
      title: "Respuesta",
      text: `La aproximacion de pi es de : ${p}`,
      icon: "success",
    });
  }
}
//ejercicio40

function ejercicio40(){
  let primerDigito=parseInt(prompt("Ingresa la cantidad del numero:"));
  if(Number.isNaN(primerDigito)|| primerDigito<=0){
    Swal.fire({
      title:"Error",
      text:"Ingrese un numero entero",
      icon:"warning"
    });


  }else{
    let p=3;
    let s=1;
    let a=2;
    for(let i =1;i<=primerDigito;i++){
      p=p+s*(4/(a*(a+1)*(a+2)))
      s=s*(-1)
      a=a+2
    }
    Swal.fire({
      title:"Respuesta",
      text:`La aproximacion de pi es de: ${p}`,
      icon:"success"
    })
  }
}
