const rutinas = {
    pecho: ["Flexiones", "Press de banca", "Aperturas con mancuernas", "Fondos en paralelas"],
    espalda: ["Dominadas", "Remo con barra", "Superman", "Pull-over con mancuerna"],
    piernas: ["Sentadillas", "Zancadas", "Peso muerto", "Elevaciones de talones"],
    abdomen: ["Plancha", "Abdominales", "Mountain climbers", "Crunch inverso"]
};

let cicloActual = 0;
let timerInterval;
let esperaTimeout;
const maxCiclos = 5;
const historial = [];
let nombreUsuario;
let puntuacion = 0;
const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
const output = document.getElementById("output");
let temporizadorActivo = false;

// Solicitar nombre al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    nombreUsuario = prompt("¡Bienvenido! Por favor, ingresa tu nombre:");
    if (!nombreUsuario) {
        nombreUsuario = "Invitado";
    }

    const usuarioExistente = leaderboard.find(user => user.nombre === nombreUsuario);
    puntuacion = usuarioExistente ? usuarioExistente.puntos : 0;

    alert(`Hola ${nombreUsuario}, ¡prepárate para comenzar!`);
    document.getElementById("usuarioNombre").textContent = `👤 ${nombreUsuario}`;
    actualizarPuntos();
    mostrarLeaderboard();
});

// Reiniciar la rutina
function reiniciarRutina() {
    cicloActual = 0;
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    if (esperaTimeout) {
        clearTimeout(esperaTimeout);
    }

    temporizadorActivo = false;
    document.getElementById("btnIniciarTimer").disabled = false;

    const timerIcon = document.getElementById("timerIcon");
    if (timerIcon) {
        timerIcon.style.display = 'none';
    }

    output.innerHTML = `<p>¡La rutina ha sido reiniciada! Presiona el timer para comenzar nuevamente.</p>`;
}

// Obtener un ejercicio aleatorio
function obtenerEjercicio(categoria) {
    const ejercicios = rutinas[categoria];
    return ejercicios[Math.floor(Math.random() * ejercicios.length)];
}

// Iniciar temporizador
function iniciarTimer(duracion, callback) {
    if (temporizadorActivo) return;

    temporizadorActivo = true;

    let tiempoRestante = duracion;
    const btnIniciarTimer = document.getElementById("btnIniciarTimer");
    const timerIcon = document.getElementById("timerIcon");

    btnIniciarTimer.disabled = true;
    timerIcon.style.display = 'inline';

    output.innerHTML = `<p>Tiempo restante: ${tiempoRestante} segundos</p>`;

    const audio = new Audio("sounds/start.mp3");
    audio.play();

    timerInterval = setInterval(() => {
        tiempoRestante--;
        output.innerHTML = `<p>Tiempo restante: ${tiempoRestante} segundos</p>`;
        if (tiempoRestante === 0) {
            clearInterval(timerInterval);
            temporizadorActivo = false;
            btnIniciarTimer.disabled = false;
            timerIcon.style.display = 'none';
            callback();
        }
    }, 1000);
}

// Iniciar rutina
document.getElementById("btnIniciarTimer").addEventListener("click", () => {
    if (cicloActual < maxCiclos) {
        const categoria = document.getElementById("categoria").value;
        if (!categoria) {
            output.innerHTML = `<p>Por favor, selecciona una categoría.</p>`;
            return;
        }

        const ejercicio = obtenerEjercicio(categoria);
        cicloActual++;
        historial.push({ ejercicio, fecha: new Date() });

        output.innerHTML = `<p>Ciclo ${cicloActual}/${maxCiclos}: ¡Prepárate para realizar ${ejercicio}!</p>`;
        document.getElementById("btnIniciarTimer").disabled = true;

        esperaTimeout = setTimeout(() => {
            output.innerHTML = `<p>Ciclo ${cicloActual}/${maxCiclos}: ¡Realiza ${ejercicio} durante 30 segundos!</p>`;

            iniciarTimer(30, () => {
                if (cicloActual < maxCiclos) {
                    output.innerHTML += `<p>¡Listo para el siguiente ejercicio! Presiona el timer de nuevo para continuar.</p>`;
                } else {
                    output.innerHTML += `<p>¡Rutina completada! 🎉 Presiona el botón de reiniciar para comenzar de nuevo.</p>`;
                    completarRutina();
                }
            });
        }, 5000);
    } else {
        output.innerHTML = `<p>Ya has completado los 5 ciclos. ¡Buen trabajo! 💪</p>`;
    }
});

// Mostrar historial
document.getElementById("btnHistorial").addEventListener("click", () => {
    output.innerHTML = "<h3>Historial:</h3>";
    historial.forEach((registro, index) => {
        output.innerHTML += `<p>${index + 1}. ${registro.ejercicio} - ${registro.fecha.toLocaleString()}</p>`;
    });
});

// Al completar rutina
function completarRutina() {
    puntuacion += 10;
    alert(`¡Felicidades ${nombreUsuario}! Has completado una rutina y ganado 10 puntos.`);

    const index = leaderboard.findIndex(user => user.nombre === nombreUsuario);
    if (index !== -1) {
        leaderboard[index].puntos = puntuacion;
    } else {
        leaderboard.push({ nombre: nombreUsuario, puntos: puntuacion });
    }

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    actualizarPuntos();
    mostrarLeaderboard();

    document.getElementById("btnIniciarTimer").disabled = false;
}

// Mostrar tabla de líderes
function mostrarLeaderboard() {
    const tablaBody = document.querySelector("#tablaLeaderboard tbody");
    tablaBody.innerHTML = "";

    leaderboard.sort((a, b) => b.puntos - a.puntos);
    leaderboard.forEach(user => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${user.nombre}</td><td>${user.puntos}</td>`;
        tablaBody.appendChild(fila);
    });
}

// Actualizar puntos en pantalla
function actualizarPuntos() {
    const puntosDiv = document.getElementById("puntosUsuario");
    if (puntosDiv) {
        puntosDiv.textContent = `🏅 Puntos: ${puntuacion}`;
    }
}

// Botón de reinicio
document.getElementById("btnReiniciar").addEventListener("click", reiniciarRutina);
