
const laberinto = document.querySelector("#laberinto");
const boton = document.querySelector("#btnIniciar");
const mensaje = document.querySelector("#mensaje");

const filas = 11;
const columnas = 11;

// 1 = Pared
// 0 = Camino

let mapa = [];

// Crear fantasmita
const fantasma = document.createElement("div");

fantasma.id = "fantasma";
fantasma.className = "fantasma";

fantasma.innerHTML = `
    <div class="ojos">
        <span class="ojo"></span>
        <span class="ojo"></span>
    </div>
    <div class="boca"></div>
`;

function generarLaberinto() {

    mapa = Array.from(
        { length: filas },
        () => Array(columnas).fill(1)
    );

    const pila = [];

    // Punto de inicio
    mapa[1][1] = 0;

    pila.push([1, 1]);

    const direcciones = [
        [-2, 0],
        [2, 0],
        [0, -2],
        [0, 2]
    ];

    while (pila.length > 0) {

        const actual = pila[pila.length - 1];

        const f = actual[0];
        const c = actual[1];

        // Mezclar direcciones
        const opciones = [...direcciones].sort(
            () => Math.random() - 0.5
        );

        let encontrado = false;

        for (const [df, dc] of opciones) {

            const nf = f + df;
            const nc = c + dc;

            if (
                nf > 0 &&
                nf < filas - 1 &&
                nc > 0 &&
                nc < columnas - 1 &&
                mapa[nf][nc] === 1
            ) {

                // Abrir el camino intermedio
                mapa[f + df / 2][c + dc / 2] = 0;

                // Abrir la nueva casilla
                mapa[nf][nc] = 0;

                pila.push([nf, nc]);

                encontrado = true;

                break;
            }

        }

        // Retroceder cuando no hay caminos disponibles
        if (!encontrado) {
            pila.pop();
        }

    }

}


function buscarCamino() {

    const inicio = [1, 1];
    const final = [9, 9];

    const cola = [inicio];

    const visitados = new Map();

    const clave = (f, c) => `${f},${c}`;

    visitados.set(clave(1, 1), null);

    const movimientos = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    while (cola.length > 0) {

        const [f, c] = cola.shift();

        // Llegamos a la salida
        if (f === final[0] && c === final[1]) {

            const camino = [];

            let actual = clave(f, c);

            while (actual !== null) {

                const [fila, columna] = actual
                    .split(",")
                    .map(Number);

                camino.unshift([fila, columna]);

                actual = visitados.get(actual);

            }

            return camino;

        }

        // Revisar casillas vecinas
        for (const [df, dc] of movimientos) {

            const nf = f + df;
            const nc = c + dc;

            const id = clave(nf, nc);

            if (
                nf >= 0 &&
                nf < filas &&
                nc >= 0 &&
                nc < columnas &&
                mapa[nf][nc] === 0 &&
                !visitados.has(id)
            ) {

                visitados.set(id, clave(f, c));

                cola.push([nf, nc]);

            }

        }

    }

    return [];

}

function dibujarLaberinto() {

    laberinto.innerHTML = "";

    mapa.forEach((fila, f) => {

        fila.forEach((valor, c) => {

            const celda = document.createElement("div");

            celda.classList.add("celda");

            if (valor === 1) {

                celda.classList.add("muro");

            } else {

                celda.classList.add("camino");

            }

            // Entrada
            if (f === 1 && c === 1) {
                celda.classList.add("entrada");
            }

            // Salida
            if (f === 9 && c === 9) {

                celda.classList.add("salida");
                celda.textContent = "⭐";

            }

            laberinto.appendChild(celda);

        });

    });

    // Agregar fantasmita encima del laberinto
    laberinto.appendChild(fantasma);

}

function obtenerPosicion(fila, columna) {

    const celdas = laberinto.querySelectorAll(".celda");

    const indice = fila * columnas + columna;

    const celda = celdas[indice];

    return {

        x: celda.offsetLeft +
           (celda.offsetWidth - fantasma.offsetWidth) / 2,

        y: celda.offsetTop +
           (celda.offsetHeight - fantasma.offsetHeight) / 2

    };

}

let animacion;

function prepararAnimacion(camino) {

    const posicionInicial = obtenerPosicion(1, 1);

    // Colocar al fantasma en la entrada
    anime.set(fantasma, {

        translateX: posicionInicial.x,
        translateY: posicionInicial.y,
        scale: 1,
        rotate: 0

    });

    // Crear una secuencia de animación
    animacion = anime.timeline({

        autoplay: false,

        complete: function () {

            mensaje.textContent = "¡FELICIDADES! 👻 ¡ENCONTRASTE LA SALIDA!";

            boton.disabled = false;

        }

    });

    // Recorrer cada casilla del camino
    for (let i = 1; i < camino.length; i++) {

        const [fila, columna] = camino[i];

        const posicion = obtenerPosicion(fila, columna);

        animacion.add({

            targets: fantasma,

            translateX: posicion.x,
            translateY: posicion.y,

            scale: [1, 1.12, 1],

            duration: 180,

            easing: "linear"

        });

    }

    // Animación final al llegar a la estrella
    animacion.add({

        targets: fantasma,

        scale: [1, 1.5, 1],

        rotate: [0, 15, -15, 0],

        duration: 600,

        easing: "easeInOutSine"

    });

}

anime({

    targets: ".ojo",

    scaleY: [1, 0.2, 1],

    duration: 250,

    delay: 2000,

    loop: true,

    loopDelay: 2500,

    easing: "easeInOutQuad"

});

function iniciarJuego() {

    boton.disabled = true;

    mensaje.textContent = "¡El fantasmita está buscando la salida!";

    // Generar un nuevo laberinto
    generarLaberinto();

    // Dibujarlo
    dibujarLaberinto();

    // Buscar una ruta válida
    const camino = buscarCamino();

    // Preparar y ejecutar Anime.js
    prepararAnimacion(camino);

    animacion.play();

}

// Botón de inicio y reinicio
boton.addEventListener("click", iniciarJuego);

iniciarJuego();
