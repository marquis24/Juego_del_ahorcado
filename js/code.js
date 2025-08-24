// Configuración de constantes y variables de juego
const maxIntentos = 10; // Número máximo de intentos permitidos
let palabrasGuardadas = []; // Almacena las palabras utilizadas en la partida
let letrasAdivinadas = []; // Almacena las letras adivinadas
let botonesAlfabeto = []; // Almacena los botones de letras para el juego
let palabra = ""; // Palabra secreta para adivinar
let puntosActuales = 0; // Puntos actuales del jugador
let totalPartidas = 0; // Total de partidas jugadas
let ganadas = 0; // Total de partidas ganadas
let maxPuntos = 0; // Puntaje máximo alcanzado
let recordPartida = ""; // Formato: "día/hora - puntos" para el récord de la partida

// Información y estadísticas de cada jugador
let jugadores = [
    { puntos: 0, totalPartidas: 0, ganadas: 0, maxPuntos: 0, recordPartida: "" }, // Jugador 1
    { puntos: 0, totalPartidas: 0, ganadas: 0, maxPuntos: 0, recordPartida: "" }  // Jugador 2
];
let turnoActual = 0; // Indica el turno actual (0 para Jugador 1, 1 para Jugador 2)
let aciertosConsecutivos = [0, 0]; // Almacena los aciertos consecutivos por jugador

// Objetos del DOM para manipular elementos de la interfaz
const objetoEntrada = document.getElementById("palabraSecreta"); // Entrada para la palabra secreta
const titulo = document.getElementById("tituloJuego"); // Título del juego
const contenedorTitulo = document.getElementsByClassName("contenedor-titulo")[0]; // Contenedor del título


// Función para iniciar una nueva partida
function comenzarPartida() {
    totalPartidas++;
    palabra = objetoEntrada.value.trim().toUpperCase();

    if (!palabra) {
        alert("Por favor, escribe una palabra.");
        return;
    }
    if (palabra.length < 4) {
        alert("La palabra debe tener más de 3 caracteres.");
        return;
    }
    if (/\d/.test(palabra)) {
        alert("La palabra no puede contener números.");
        return;
    }

    // Reiniciar contadores de intento e imagen
    palabrasGuardadas.push(palabra);
    letrasAdivinadas = Array(palabra.length).fill("_");
    intentosFallidos = 0;
    indiceImagen = 0;

    // Establecer imagen inicial
    document.getElementById("img_ahorcado").src = imagenes[indiceImagen];

    // Configuración visual y de control
    mostrarPalabraOculta();
    document.getElementById("palabraSecreta").disabled = true;
    document.getElementById("comenzarPartida").disabled = true;
    botonesAlfabeto.forEach((boton) => {
        boton.style.color = "black";
        boton.style.borderColor = "black";
        boton.disabled = false;
    });

    // Cambiar fondo a azul al comenzar la partida
    document.querySelector(".contenedor-titulo").style.backgroundColor = "#bbc6ee";
}




// Función ejecutada al cargar la página para inicializar botones del alfabeto
window.onload = function () {
    const contenedorAlfabeto = document.getElementById("alfabeto");
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    letras.forEach((letra) => {
        const boton = document.createElement("button");
        boton.innerText = letra;
        boton.id = `boton_${letra}`;
        boton.style.color = "red";
        boton.style.borderColor = "red";
        boton.disabled = true;

        boton.addEventListener("click", function () {
            boton.style.color = "red";
            boton.style.borderColor = "red";
            boton.disabled = true;
            verificarLetra(letra); // Llama a la función para verificar la letra seleccionada
        });

        botonesAlfabeto.push(boton);
        contenedorAlfabeto.appendChild(boton);
    });

    actualizarUIJugador(); // Muestra el color de jugador actual al iniciar
}


// Función para verificar si la letra adivinada está en la palabra
function verificarLetra(letra) {
    let letraEncontrada = false; // Marca si la letra se encuentra en la palabra
    let vecesEnPalabra = 0; // Cuenta cuántas veces aparece la letra

    for (let i = 0; i < palabra.length; i++) {
        if (palabra[i] === letra) {
            letrasAdivinadas[i] = letra;
            letraEncontrada = true;
            vecesEnPalabra++;
        }
    }

    mostrarPalabraOculta(); // Actualiza la palabra oculta en la interfaz

    if (letraEncontrada) {
        aciertosConsecutivos[turnoActual]++; // Aumenta aciertos consecutivos
        jugadores[turnoActual].puntos += aciertosConsecutivos[turnoActual] * vecesEnPalabra;
    } else {
        aciertosConsecutivos[turnoActual] = 0; // Reinicia aciertos consecutivos
        jugadores[turnoActual].puntos = Math.max(jugadores[turnoActual].puntos - 1, 0); // Reduce puntos
        siguienteImagen(); // Cambia la imagen en caso de fallo
        turnoActual = 1 - turnoActual; // Cambia el turno
        actualizarUIJugador(); // Actualiza el color del turno actual
    }

    actualizarPuntos(); // Muestra los puntos actualizados
    verificarVictoria(); // Comprueba si alguien ha ganado o perdido
}

// Función para actualizar los puntos en la interfaz
function actualizarPuntos() {
    document.getElementById("puntosJugador1").textContent = jugadores[0].puntos;
    document.getElementById("puntosJugador2").textContent = jugadores[1].puntos;
}

// Cambia el fondo para mostrar el turno del jugador actual
function actualizarUIJugador() {
    const jugador1Div = document.getElementById("jugador1");
    const jugador2Div = document.getElementById("jugador2");

    if (turnoActual === 0) {
        jugador1Div.style.backgroundColor = "green";
        jugador2Div.style.backgroundColor = "red";
    } else {
        jugador1Div.style.backgroundColor = "red";
        jugador2Div.style.backgroundColor = "green";
    }
}
// Actualizar estadísticas después de cada partida
function actualizarEstadisticas(jugador) {
    // Incrementa el total de partidas jugadas por el jugador actual
    jugadores[jugador].totalPartidas++;
    document.getElementById(`totalPartidasJugador${jugador + 1}`).textContent = jugadores[jugador].totalPartidas;

    // Actualiza partidas ganadas
    document.getElementById(`ganadasJugador${jugador + 1}`).textContent = jugadores[jugador].ganadas;

    // Calcula y muestra el porcentaje de partidas ganadas
    const porcentajeGanadas = ((jugadores[jugador].ganadas / jugadores[jugador].totalPartidas) * 100).toFixed(2);
    document.getElementById(`porcentajeGanadasJugador${jugador + 1}`).textContent = `${porcentajeGanadas}%`;

    // Si los puntos actuales son el máximo alcanzado, actualiza el récord de puntos
    if (jugadores[jugador].puntos > jugadores[jugador].maxPuntos) {
        jugadores[jugador].maxPuntos = jugadores[jugador].puntos; // Actualiza el puntaje máximo
        const fecha = new Date(); // Obtiene la fecha y hora actuales
        // Guarda el nuevo récord de partida con fecha, hora y puntos alcanzados
        jugadores[jugador].recordPartida = `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()} - ${jugadores[jugador].puntos} puntos`;
        // Muestra el récord en el elemento correspondiente del DOM
        document.getElementById(`recordPartidaJugador${jugador + 1}`).textContent = jugadores[jugador].recordPartida;
    }

    // Reinicia los puntos y aciertos consecutivos para ambos jugadores para la siguiente partida
    jugadores[0].puntos = 0;
    jugadores[1].puntos = 0;
    aciertosConsecutivos = [0, 0];
    intentosFallidos = 0; // Restablece los intentos fallidos
}

// Muestra la palabra oculta en el título del juego usando guiones bajos para letras no adivinadas
function mostrarPalabraOculta() {
    const palabraConGuiones = letrasAdivinadas.join(" "); // Combina letras y guiones en una sola cadena
    document.getElementById("tituloJuego").textContent = palabraConGuiones; // Muestra la cadena resultante en el título
}


// Modifica la función de verificación para que solo llame a iniciarNuevaPartida al empezar
function verificarVictoria() {
    const titulo = document.getElementById("tituloJuego");
    const contenedorTitulo = document.getElementsByClassName("contenedor-titulo")[0];

    if (!letrasAdivinadas.includes("_")) { // El jugador ha ganado
        titulo.textContent = `¡Ganaste! La palabra era: ${palabra}`;
        contenedorTitulo.style.backgroundColor = "green";
        jugadores[turnoActual].ganadas++; // Incrementa partidas ganadas para el jugador actual
        actualizarEstadisticas(turnoActual); // Actualiza estadísticas
        reiniciarPartida(); // Inicia una nueva partida tras una victoria
    } else if (intentosFallidos >= maxIntentos) { // El jugador ha perdido
        titulo.textContent = `Perdiste. La palabra era: ${palabra}`;
        contenedorTitulo.style.backgroundColor = "red";
        reiniciarPartida(); // Inicia una nueva partida tras una victoria
    } else {
        titulo.style.color = "black"; // Mantiene el color si la partida continúa
    }
}


// Configuración inicial de variables e imágenes para los intentos fallidos
let indiceImagen = 0; // Índice actual de imagen
let intentosFallidos = 0; // Conteo de intentos fallidos
const imagenes = [
    "img_ahorcado/ahorcado_1.jpg",
    "img_ahorcado/ahorcado_2.jpg",
    "img_ahorcado/ahorcado_3.jpg",
    "img_ahorcado/ahorcado_4.jpg",
    "img_ahorcado/ahorcado_5.jpg",
    "img_ahorcado/ahorcado_6.jpg",
    "img_ahorcado/ahorcado_7.jpg",
    "img_ahorcado/ahorcado_8.jpg",
    "img_ahorcado/ahorcado_9.jpg",
    "img_ahorcado/ahorcado_10.jpg",
];

// Función de actualización de imagen en caso de fallar
function siguienteImagen() {
    const imgElemento = document.getElementById("img_ahorcado");

    if (imgElemento && intentosFallidos < maxIntentos) {
        intentosFallidos++;
        indiceImagen = intentosFallidos; // La imagen sigue el índice de fallos
        imgElemento.src = imagenes[indiceImagen];
    }
    verificarVictoria();
}



function reiniciarPartida() {
    // Llamando al id del elemento HTML para habilitar 
    //la entrada de la palabra y el botón de comenzar partida
    document.getElementById("palabraSecreta").disabled = false;
    document.getElementById("comenzarPartida").disabled = false;

}



// Función para mostrar o ocultar la palabra secreta con iconos
function mostrarPalabra() {
    const img = document.querySelector("img");
    if (objetoEntrada.type === "password") {
        objetoEntrada.type = "text"; // Cambia a texto para mostrar la palabra
        img.src = "icons/eye-secret.png";
    } else {
        objetoEntrada.type = "password"; // Cambia a password para ocultar
        img.src = "icons/eye-open.png";
    }
}
