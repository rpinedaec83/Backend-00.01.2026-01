//Crea una función que retorne la suma de dos números.
const suma = (num1, num2) => {
    let resultado = num1 + num2;


    return resultado;


}
console.log(suma(200, 10));

//Crea una función que retorne la potencia de un número dado, esta función deberá recibir la potencia y el número a potenciar.
const potencia = (base, exponente) => {
    let resultado = base ** exponente;
    return resultado;
}
console.log(`Resultado: ${potencia(2, 3)}`);


/// Crea una función que tome números y devuelva la suma de sus cubos. sumOfCubes(1, 5, 9) ➞ 855

const ejercicioCubos = () => {


    const sumOfCubes = (...numeros) => {
        //reduce acumula el cálculo de cada número al cubo
        return numeros.reduce((acumulador, n) => acumulador + (n ** 3), 0);
    };


    console.log("Resultado Suma de Cubos:", sumOfCubes(1, 5, 9));

};
ejercicioCubos();


///Escribe una función que tome la base y la altura de un triángulo y devuelva su área.
const ejercicioAreaTriangulo = () => {

    const triArea = (base, altura) => (base * altura) / 2;


    console.log(`El área del triángulo es: ${triArea(3, 2)}`);
    // Resultado: 3 (porque 3 * 2 = 6, y 6 / 2 = 3)
};

// Ejecución del bloque
ejercicioAreaTriangulo();

//// Utilizando función arrow, crear una función que reciba como parámetros un nombre, apellido y edad y los retorne en un string concatenado “Hola mi nombre es sebastián yabiku y mi edad 33”
const nombreCompleto = (n, a, e) => {
    
    const nombreCompleto = `Hola mi nombre es ${n} ${a} y mi edad es ${e}`;
    return nombreCompleto;
}
console.log(nombreCompleto("Sebastián", "Yabiku", 33));


//Crear una funcion que me retorne el tipo de valor entregado, invocar la función para los distintos tipos de js
const ejercicioTiposDeDatos = () => {
     
    const obtenerTipo = (valor) => typeof valor; //type of siempre va a devolver el tipo de dato 

    
    const texto = "Hola";
    const numero = 33;
    const esReal = true;
    const objeto = { nombre: "Sebas" };
    const lista = [1, 2, 3]; 
    const nulo = null;      
    const indefinido = undefined;
    const funcion = () => {};

   
    console.log("--- Tipos de Datos ---");
    console.log(`El valor '${texto}' es:`, obtenerTipo(texto));
    console.log(`El valor '${numero}' es:`, obtenerTipo(numero));
    console.log(`El valor '${esReal}' es:`, obtenerTipo(esReal));
    console.log(`El objeto es:`, obtenerTipo(objeto));
    console.log(`La lista es:`, obtenerTipo(lista));
    console.log(`El valor null es:`, obtenerTipo(nulo));
    console.log(`La variable sin definir es:`, obtenerTipo(indefinido));
    console.log(`La función es:`, obtenerTipo(funcion));
};


ejercicioTiposDeDatos();
///Crear una función que reciba n cantidad de argumentos y los sume ( utilizar parametros rest)
{
    //"...numeros" agrupa todos los argumentos en un Array
    const sumarCantidad = (...numeros) => {
        //Usamos reduce para acumular la suma de todos los elementos
        return numeros.reduce((acumulador, actual) => acumulador + actual, 0);
    };

  
    console.log("--- Suma de N argumentos ---");
    console.log("Suma de 3 números (5, 10, 15):", sumarCantidad(5, 10, 15)); // 30
    console.log("Suma de 5 números (1, 2, 3, 4, 5):", sumarCantidad(1, 2, 3, 4, 5)); // 15
    console.log("Suma de 1 solo número (100):", sumarCantidad(100)); // 100
}



