import { apiClient } from './services/client.js';

// --- ESTADO GLOBAL ---
let tareas = [];
let filtroEstado = 'todas';
let filtroPrioridad = 'todas';
let filtroCategoria = 'todas';
let textoBusqueda = '';

// --- REFERENCIAS AL DOM ---
const formTarea = document.getElementById('formulario-tarea');
const inputTarea = document.getElementById('input-tarea');
const selectCategoria = document.getElementById('select-categoria');
const selectPrioridad = document.getElementById('select-prioridad');
const listaTareas = document.getElementById('lista-tareas');
const mensajeVacio = document.getElementById('mensaje-vacio');

// Filtros y Buscadores
const btnFiltrosEstado = document.querySelectorAll('.filtro-estado-btn');
const btnFiltrosPrioridad = document.querySelectorAll('.filtro-prio-btn');
const selectFiltroCategoria = document.getElementById('filtro-categoria');
const buscadorDesktop = document.getElementById('buscador');
const buscadorMovil = document.getElementById('buscador-movil');

// Extras
const btnMic = document.getElementById('btn-mic');
const btnDarkMode = document.getElementById('btn-dark-mode');
const htmlRoot = document.getElementById('html-root');

// --- UTILIDADES ---
// El backend espera una prioridad numérica (1, 2, 3). Convertimos los textos.
const prioridadANumero = (prioStr) => {
    if (prioStr === 'alta') return 3;
    if (prioStr === 'media') return 2;
    return 1; // baja por defecto
};

// --- MODO OSCURO ---
if (btnDarkMode) {
    btnDarkMode.addEventListener('click', () => {
        htmlRoot.classList.toggle('dark');
    });
}

// --- RED Y RENDERIZADO ---
async function inicializarApp() {
    listaTareas.innerHTML = '<div class="text-center py-10 font-bold text-gray-500">⏳ Cargando tareas desde el servidor...</div>';
    mensajeVacio.classList.add('hidden');
    try {
        tareas = await apiClient.obtenerTareas();
        actualizarVista();
    } catch (error) {
        listaTareas.innerHTML = `<div class="text-center py-10 font-bold text-red-500">❌ Error de conexión: ${error.message}</div>`;
    }
}

function actualizarVista() {
    listaTareas.innerHTML = '';
    
    // Aplicar Filtros combinados
    let tareasFiltradas = tareas.filter(tarea => {
        // 1. Filtro Estado
        let pasaEstado = true;
        if (filtroEstado === 'pendientes') pasaEstado = !tarea.completada;
        if (filtroEstado === 'completadas') pasaEstado = tarea.completada;

        // 2. Filtro Categoría
        let pasaCategoria = true;
        if (filtroCategoria !== 'todas') {
            pasaCategoria = tarea.categoria && tarea.categoria.toLowerCase() === filtroCategoria.toLowerCase();
        }

        // 3. Filtro Búsqueda
        let pasaBusqueda = true;
        if (textoBusqueda) {
            pasaBusqueda = tarea.titulo.toLowerCase().includes(textoBusqueda.toLowerCase());
        }

        // 4. Filtro Prioridad (AÑADIDO)
        let pasaPrioridad = true;
        if (filtroPrioridad !== 'todas') {
            const prioNum = prioridadANumero(filtroPrioridad);
            pasaPrioridad = tarea.prioridad === prioNum;
        }

        return pasaEstado && pasaCategoria && pasaBusqueda && pasaPrioridad;
    });

    // Mostrar mensaje vacío si no hay tareas
    if (tareasFiltradas.length === 0) {
        mensajeVacio.classList.remove('hidden');
    } else {
        mensajeVacio.classList.add('hidden');
        
        // Renderizar tareas
        tareasFiltradas.forEach(tarea => {
            const div = document.createElement('div');
            div.className = `flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl shadow-sm border ${tarea.completada ? 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 opacity-70' : 'bg-white border-green-100 dark:bg-gray-800 dark:border-gray-600'} transition-all`;
            
            // Determinar color del circulito según la prioridad
            let colorPrioridad = 'bg-green-500'; // Baja (1) por defecto
            if (tarea.prioridad === 3) colorPrioridad = 'bg-red-500';
            if (tarea.prioridad === 2) colorPrioridad = 'bg-yellow-500';

            div.innerHTML = `
                <div class="flex items-center gap-3 w-full sm:w-auto mb-3 sm:mb-0">
                    <input type="checkbox" ${tarea.completada ? 'checked' : ''} onchange="cambiarEstado(${tarea.id})" class="w-5 h-5 text-green-500 rounded focus:ring-green-400 cursor-pointer">
                    
                    <div class="w-3 h-3 rounded-full ${colorPrioridad} shrink-0" title="Prioridad"></div>
                    
                    <span class="font-semibold text-lg ${tarea.completada ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}">
                        ${tarea.titulo}
                    </span>
                    <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 capitalize">${tarea.categoria || 'General'}</span>
                </div>
                <button onclick="borrarTarea(${tarea.id})" class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Eliminar tarea">
                    🗑️
                </button>
            `;
            listaTareas.appendChild(div);
        });
    }
}

// --- EVENTOS PRINCIPALES ---
formTarea.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const titulo = inputTarea.value.trim();
    const categoria = selectCategoria.value;
    const prioridadNum = prioridadANumero(selectPrioridad.value);

    try {
        const nuevaTarea = await apiClient.crearTarea({ titulo, prioridad: prioridadNum, categoria });
        tareas.push(nuevaTarea);
        actualizarVista();
        formTarea.reset();
    } catch (error) {
        alert(`❌ No se pudo crear la tarea:\n${error.message}`);
    }
});

window.borrarTarea = async (id) => {
    try {
        await apiClient.eliminarTarea(id);
        tareas = tareas.filter(t => t.id !== parseInt(id));
        actualizarVista();
    } catch (error) {
        alert(`❌ Error al eliminar:\n${error.message}`);
    }
};

window.cambiarEstado = (id) => {
    tareas = tareas.map(t => {
        if (t.id === parseInt(id)) t.completada = !t.completada;
        return t;
    });
    actualizarVista();
};

// --- LISTENERS DE FILTROS ---
// Filtro de Estado (Todas, Pendientes, Completadas)
btnFiltrosEstado.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Obtenemos el valor del data-attribute (ej: data-filtro="pendientes")
        filtroEstado = e.target.closest('button').dataset.filtro;
        actualizarVista();
    });
});

// Filtro de Prioridad (Todas, Alta, Media, Baja)
btnFiltrosPrioridad.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Obtenemos el valor del data-attribute (ej: data-prio="alta")
        filtroPrioridad = e.target.closest('button').dataset.prio;
        actualizarVista();
    });
});

selectFiltroCategoria.addEventListener('change', (e) => {
    filtroCategoria = e.target.value;
    actualizarVista();
});

const manejarBusqueda = (e) => {
    textoBusqueda = e.target.value;
    actualizarVista();
};
if (buscadorDesktop) buscadorDesktop.addEventListener('input', manejarBusqueda);
if (buscadorMovil) buscadorMovil.addEventListener('input', manejarBusqueda);

// --- DICTADO POR VOZ ---
if (btnMic) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        
        btnMic.addEventListener('click', () => {
            recognition.start();
            btnMic.classList.add('bg-red-100', 'border-red-400'); // Feedback visual
        });

        recognition.onresult = (evento) => {
            inputTarea.value = evento.results[0][0].transcript;
            btnMic.classList.remove('bg-red-100', 'border-red-400');
        };

        recognition.onerror = () => {
            btnMic.classList.remove('bg-red-100', 'border-red-400');
            alert("⚠️ Error con el micrófono.");
        };
    } else {
        btnMic.style.display = 'none';
    }
}

// ARRANCAR APP
inicializarApp();