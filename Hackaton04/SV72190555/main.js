// ===============================
// Hackatón 04 - SV72190555 - Javier Gonzales
// VERSIÓN CON INTERFAZ INCRUSTADA (SIN MODALES)
// ===============================

// Función helper para mostrar la zona de ejercicio
function mostrarZona(contenido) {
    const zona = document.getElementById("zona-ejercicio");
    zona.style.display = "block";
    zona.innerHTML = contenido;
    zona.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Función helper para crear inputs
function crearInput(tipo, id, placeholder, label) {
    return `
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #004a7c;">
                ${label}
            </label>
            <input 
                type="${tipo}" 
                id="${id}" 
                placeholder="${placeholder}"
                style="width: 100%; padding: 10px; border-radius: 12px; border: 1px solid #7fbfff; background: rgba(255,255,255,0.8);"
            />
        </div>
    `;
}

// ===============================
// RETO 1
// ===============================

// 1.1 - Suma de dos números
function ejercicio101() {
    mostrarZona(`
        <h2>📝 Ejercicio 1.1 - Suma de dos números</h2>
        <p>Ingresa dos números y te mostraré su suma.</p>
        
        ${crearInput('number', 'num1', 'Ejemplo: 5', 'Primer número:')}
        ${crearInput('number', 'num2', 'Ejemplo: 3', 'Segundo número:')}
        
        <button onclick="calcularSuma11()">Calcular Suma</button>
        <button onclick="limpiarTodo()" style="background: linear-gradient(to bottom, #ffcccc, #ff9999); margin-left: 10px;">Cerrar</button>
        
        <div id="resultado11" style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.7); border-radius: 12px; display: none;">
            <!-- Resultado aquí -->
        </div>
    `);
}

function calcularSuma11() {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const resultado = document.getElementById('resultado11');
    
    if (isNaN(num1) || isNaN(num2)) {
        resultado.style.display = "block";
        resultado.innerHTML = `
            <h3 style="color: #cc0000;">❌ Error</h3>
            <p>Por favor ingresa números válidos.</p>
        `;
        return;
    }
    
    const suma = num1 + num2;
    
    resultado.style.display = "block";
    resultado.innerHTML = `
        <h3 style="color: #007700;">✅ Resultado</h3>
        <p><strong>${num1} + ${num2} = ${suma}</strong></p>
        <code>const suma = (a, b) => a + b;</code>
    `;
}

// 1.2 - Potencia de un número
function ejercicio102() {
    mostrarZona(`
        <h2>📝 Ejercicio 1.2 - Potencia de un número</h2>
        <p>Calcula la potencia de un número.</p>
        
        ${crearInput('number', 'base', 'Ejemplo: 2', 'Base:')}
        ${crearInput('number', 'exponente', 'Ejemplo: 3', 'Exponente:')}
        
        <button onclick="calcularPotencia12()">Calcular Potencia</button>
        <button onclick="limpiarTodo()" style="background: linear-gradient(to bottom, #ffcccc, #ff9999); margin-left: 10px;">Cerrar</button>
        
        <div id="resultado12" style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.7); border-radius: 12px; display: none;">
            <!-- Resultado aquí -->
        </div>
    `);
}

function calcularPotencia12() {
    const base = parseFloat(document.getElementById('base').value);
    const exponente = parseFloat(document.getElementById('exponente').value);
    const resultado = document.getElementById('resultado12');
    
    if (isNaN(base) || isNaN(exponente)) {
        resultado.style.display = "block";
        resultado.innerHTML = `
            <h3 style="color: #cc0000;">❌ Error</h3>
            <p>Por favor ingresa números válidos.</p>
        `;
        return;
    }
    
    const potencia = Math.pow(base, exponente);
    
    resultado.style.display = "block";
    resultado.innerHTML = `
        <h3 style="color: #007700;">✅ Resultado</h3>
        <p><strong>${base}<sup>${exponente}</sup> = ${potencia}</strong></p>
        <code>const potencia = (base, exp) => Math.pow(base, exp);</code>
    `;
}

// 1.3 - Suma de cubos
function ejercicio103() {
    mostrarZona(`
        <h2>📝 Ejercicio 1.3 - Suma de cubos</h2>
        <p>Ingresa números separados por comas y calcularé la suma de sus cubos.</p>
        
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #004a7c;">
                Números (separados por coma):
            </label>
            <input 
                type="text" 
                id="numeros13" 
                placeholder="Ejemplo: 1, 5, 9"
                style="width: 100%; padding: 10px; border-radius: 12px; border: 1px solid #7fbfff; background: rgba(255,255,255,0.8);"
            />
        </div>
        
        <button onclick="calcularSumaCubos13()">Calcular Suma de Cubos</button>
        <button onclick="limpiarTodo()" style="background: linear-gradient(to bottom, #ffcccc, #ff9999); margin-left: 10px;">Cerrar</button>
        
        <div id="resultado13" style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.7); border-radius: 12px; display: none;">
            <!-- Resultado aquí -->
        </div>
    `);
}

function calcularSumaCubos13() {
    const input = document.getElementById('numeros13').value;
    const resultado = document.getElementById('resultado13');
    
    try {
        const numeros = input.split(',').map(n => parseFloat(n.trim()));
        
        if (numeros.some(isNaN)) {
            throw new Error('Números inválidos');
        }
        
        const sumaCubos = numeros.reduce((acc, num) => acc + Math.pow(num, 3), 0);
        const detalles = numeros.map(n => `${n}³`).join(' + ');
        const calculos = numeros.map(n => Math.pow(n, 3)).join(' + ');
        
        resultado.style.display = "block";
        resultado.innerHTML = `
            <h3 style="color: #007700;">✅ Resultado</h3>
            <p><strong>${detalles} = ${sumaCubos}</strong></p>
            <p style="font-size: 0.9em; opacity: 0.8;">${calculos} = ${sumaCubos}</p>
            <code>const sumOfCubes = (...nums) => nums.reduce((a,n) => a + n**3, 0);</code>
        `;
    } catch (error) {
        resultado.style.display = "block";
        resultado.innerHTML = `
            <h3 style="color: #cc0000;">❌ Error</h3>
            <p>Por favor ingresa números válidos separados por comas.</p>
        `;
    }
}

// 1.4 - Área de triángulo
function ejercicio104() {
    mostrarZona(`
        <h2>📝 Ejercicio 1.4 - Área de un triángulo</h2>
        <p>Calcula el área de un triángulo dada su base y altura.</p>
        
        ${crearInput('number', 'baseTriangulo', 'Ejemplo: 3', 'Base del triángulo:')}
        ${crearInput('number', 'alturaTriangulo', 'Ejemplo: 2', 'Altura del triángulo:')}
        
        <button onclick="calcularAreaTriangulo14()">Calcular Área</button>
        <button onclick="limpiarTodo()" style="background: linear-gradient(to bottom, #ffcccc, #ff9999); margin-left: 10px;">Cerrar</button>
        
        <div id="resultado14" style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.7); border-radius: 12px; display: none;">
            <!-- Resultado aquí -->
        </div>
    `);
}

function calcularAreaTriangulo14() {
    const base = parseFloat(document.getElementById('baseTriangulo').value);
    const altura = parseFloat(document.getElementById('alturaTriangulo').value);
    const resultado = document.getElementById('resultado14');
    
    if (isNaN(base) || isNaN(altura)) {
        resultado.style.display = "block";
        resultado.innerHTML = `
            <h3 style="color: #cc0000;">❌ Error</h3>
            <p>Por favor ingresa números válidos.</p>
        `;
        return;
    }
    
    const area = (base * altura) / 2;
    
    resultado.style.display = "block";
    resultado.innerHTML = `
        <h3 style="color: #007700;">✅ Resultado</h3>
        <p><strong>Área = ${area} unidades cuadradas</strong></p>
        <p style="font-size: 0.9em; opacity: 0.8;">Fórmula: (base × altura) / 2 = (${base} × ${altura}) / 2</p>
        <code>const triArea = (base, altura) => (base * altura) / 2;</code>
    `;
}

// 1.5 - Calculadora
function ejercicio105() {
    mostrarZona(`
        <h2>📝 Ejercicio 1.5 - Calculadora</h2>
        <p>Realiza operaciones matemáticas básicas.</p>
        
        ${crearInput('number', 'num1Calc', 'Ejemplo: 10', 'Primer número:')}
        
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #004a7c;">
                Operación:
            </label>
            <select id="operacion" style="width: 100%; padding: 10px; border-radius: 12px; border: 1px solid #7fbfff; background: rgba(255,255,255,0.8);">
                <option value="+">➕ Suma (+)</option>
                <option value="-">➖ Resta (-)</option>
                <option value="*">✖️ Multiplicación (*)</option>
                <option value="/">➗ División (/)</option>
                <option value="%">📐 Módulo (%)</option>
            </select>
        </div>
        
        ${crearInput('number', 'num2Calc', 'Ejemplo: 5', 'Segundo número:')}
        
        <button onclick="calcular15()">Calcular</button>
        <button onclick="limpiarTodo()" style="background: linear-gradient(to bottom, #ffcccc, #ff9999); margin-left: 10px;">Cerrar</button>
        
        <div id="resultado15" style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.7); border-radius: 12px; display: none;">
            <!-- Resultado aquí -->
        </div>
    `);
}

function calcular15() {
    const num1 = parseFloat(document.getElementById('num1Calc').value);
    const num2 = parseFloat(document.getElementById('num2Calc').value);
    const operacion = document.getElementById('operacion').value;
    const resultado = document.getElementById('resultado15');
    
    if (isNaN(num1) || isNaN(num2)) {
        resultado.style.display = "block";
        resultado.innerHTML = `
            <h3 style="color: #cc0000;">❌ Error</h3>
            <p>Por favor ingresa números válidos.</p>
        `;
        return;
    }
    
    let resultadoCalc;
    switch(operacion) {
        case '+': resultadoCalc = num1 + num2; break;
        case '-': resultadoCalc = num1 - num2; break;
        case '*': resultadoCalc = num1 * num2; break;
        case '/': 
            if (num2 === 0) {
                resultado.style.display = "block";
                resultado.innerHTML = `
                    <h3 style="color: #cc0000;">❌ Error</h3>
                    <p>No se puede dividir por cero.</p>
                `;
                return;
            }
            resultadoCalc = num1 / num2;
            break;
        case '%': resultadoCalc = num1 % num2; break;
        default:
            resultado.style.display = "block";
            resultado.innerHTML = `
                <h3 style="color: #cc0000;">❌ Error</h3>
                <p>Operación no reconocida.</p>
            `;
            return;
    }
    
    resultado.style.display = "block";
    resultado.innerHTML = `
        <h3 style="color: #007700;">✅ Resultado</h3>
        <p><strong>${num1} ${operacion} ${num2} = ${resultadoCalc}</strong></p>
        <code>const calculator = (a, op, b) => { /* switch case */ };</code>
    `;
}

// Ejercicios 1.6 y 1.7 - Placeholders
function ejercicio106() {
    mostrarZona(`
        <h2>📝 Ejercicio 1.6</h2>
        <p>Este ejercicio aún no está implementado.</p>
        <button onclick="limpiarTodo()">Cerrar</button>
    `);
}

function ejercicio107() {
    mostrarZona(`
        <h2>📝 Ejercicio 1.7</h2>
        <p>Este ejercicio aún no está implementado.</p>
        <button onclick="limpiarTodo()">Cerrar</button>
    `);
}

// ===============================
// RETO 2
// ===============================

// 2.1 - Presentación personal
function ejercicio201() {
    mostrarZona(`
        <h2>📝 Ejercicio 2.1 - Presentación personal</h2>
        <p>Crea tu presentación con nombre, apellido y edad.</p>
        
        ${crearInput('text', 'nombre21', 'Ejemplo: Sebastián', 'Nombre:')}
        ${crearInput('text', 'apellido21', 'Ejemplo: Yabiku', 'Apellido:')}
        ${crearInput('number', 'edad21', 'Ejemplo: 33', 'Edad:')}
        
        <button onclick="generarPresentacion21()">Generar Presentación</button>
        <button onclick="limpiarTodo()" style="background: linear-gradient(to bottom, #ffcccc, #ff9999); margin-left: 10px;">Cerrar</button>
        
        <div id="resultado21" style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.7); border-radius: 12px; display: none;">
            <!-- Resultado aquí -->
        </div>
    `);
}

function generarPresentacion21() {
    const nombre = document.getElementById('nombre21').value;
    const apellido = document.getElementById('apellido21').value;
    const edad = document.getElementById('edad21').value;
    const resultado = document.getElementById('resultado21');
    
    if (!nombre || !apellido || !edad) {
        resultado.style.display = "block";
        resultado.innerHTML = `
            <h3 style="color: #cc0000;">❌ Error</h3>
            <p>Por favor completa todos los campos.</p>
        `;
        return;
    }
    
    const presentacion = `Hola mi nombre es ${nombre} ${apellido} y mi edad ${edad}`;
    
    resultado.style.display = "block";
    resultado.innerHTML = `
        <h3 style="color: #007700;">✅ Presentación generada</h3>
        <p style="font-size: 1.2em;"><strong>"${presentacion}"</strong></p>
        <code>const presentacion = (nombre, apellido, edad) => \`Hola mi nombre es \${nombre} \${apellido} y mi edad \${edad}\`;</code>
    `;
}

// 2.2 - Suma de cubos (igual que 1.3)
function ejercicio202() {
    ejercicio13(); // Reutilizamos la misma función
}

// 2.3 - Tipo de valor
function ejercicio203() {
    mostrarZona(`
        <h2>📝 Ejercicio 2.3 - Tipo de valor</h2>
        <p>Ingresa un valor y te diré su tipo.</p>
        
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #004a7c;">
                Selecciona un valor:
            </label>
            <select id="tipoValor" style="width: 100%; padding: 10px; border-radius: 12px; border: 1px solid #7fbfff; background: rgba(255,255,255,0.8);">
                <option value="42">42 (número)</option>
                <option value="'Hola'">"Hola" (string)</option>
                <option value="true">true (boolean)</option>
                <option value="null">null</option>
                <option value="undefined">undefined</option>
                <option value="{}">{ } (objeto)</option>
                <option value="[]">[ ] (array)</option>
            </select>
        </div>
        
        <button onclick="obtenerTipo23()">Obtener Tipo</button>
        <button onclick="limpiarTodo()" style="background: linear-gradient(to bottom, #ffcccc, #ff9999); margin-left: 10px;">Cerrar</button>
        
        <div id="resultado23" style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.7); border-radius: 12px; display: none;">
            <!-- Resultado aquí -->
        </div>
    `);
}

function obtenerTipo23() {
    const valorStr = document.getElementById('tipoValor').value;
    const resultado = document.getElementById('resultado23');
    
    let valor;
    try {
        valor = eval(valorStr);
    } catch(e) {
        valor = valorStr;
    }
    
    const tipo = typeof valor;
    
    resultado.style.display = "block";
    resultado.innerHTML = `
        <h3 style="color: #007700;">✅ Resultado</h3>
        <p><strong>Valor: ${valorStr}</strong></p>
        <p><strong>Tipo: ${tipo}</strong></p>
        <code>const obtenerTipo = (valor) => typeof valor;</code>
    `;
}

// Placeholders para el resto de ejercicios
function ejercicio204() {
    mostrarZona(`<h2>📝 Ejercicio 2.4</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio205() {
    mostrarZona(`<h2>📝 Ejercicio 2.5</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio206() {
    mostrarZona(`<h2>📝 Ejercicio 2.6</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio207() {
    mostrarZona(`<h2>📝 Ejercicio 2.7</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}0

function ejercicio208() {
    mostrarZona(`<h2>📝 Ejercicio 2.8</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio209() {
    mostrarZona(`<h2>📝 Ejercicio 2.9</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio210() {
    mostrarZona(`<h2>📝 Ejercicio 2.10</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio211() {
    mostrarZona(`<h2>📝 Ejercicio 2.11</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio212() {
    mostrarZona(`<h2>📝 Ejercicio 2.12</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio213() {
    mostrarZona(`<h2>📝 Ejercicio 2.13</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio214() {
    mostrarZona(`<h2>📝 Ejercicio 2.14</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio215() {
    mostrarZona(`<h2>📝 Ejercicio 2.15</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio216() {
    mostrarZona(`<h2>📝 Ejercicio 2.16</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio217() {
    mostrarZona(`<h2>📝 Ejercicio 2.17</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio218() {
    mostrarZona(`<h2>📝 Ejercicio 2.18</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio219() {
    mostrarZona(`<h2>📝 Ejercicio 2.19</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio220() {
    mostrarZona(`<h2>📝 Ejercicio 2.20</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio221() {
    mostrarZona(`<h2>📝 Ejercicio 2.21</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

function ejercicio222() {
    mostrarZona(`<h2>📝 Ejercicio 2.22</h2><p>Próximamente...</p><button onclick="limpiarTodo()">Cerrar</button>`);
}

// ===============================
// Función de limpieza
// ===============================
function limpiarTodo() {
    const zona = document.getElementById("zona-ejercicio");
    if (zona) {
        zona.style.display = "none";
        zona.innerHTML = "";
    }
}
