// --- 1. REFERENCIAS AL DOM ---
const formulario = document.getElementById('formulario-tarea');
const inputTarea = document.getElementById('input-tarea');
const selectCategoria = document.getElementById('select-categoria');
const selectPrioridad = document.getElementById('select-prioridad');
const listaTareas = document.getElementById('lista-tareas');
const mensajeVacio = document.getElementById('mensaje-vacio');
const buscador = document.getElementById('buscador');
const buscadorMovil = document.getElementById('buscador-movil');
const filtroCategoriaSelect = document.getElementById('filtro-categoria');
const btnMic = document.getElementById('btn-mic');

// Botones de filtro
const botonesEstado = document.querySelectorAll('.filtro-estado-btn');
const botonesPrioridad = document.querySelectorAll('.filtro-prio-btn');

// --- 2. MODO OSCURO ---
const btnDarkMode = document.getElementById('btn-dark-mode');
const htmlRoot = document.getElementById('html-root');
if (localStorage.getItem('tema') === 'oscuro') htmlRoot.classList.add('dark');

btnDarkMode.addEventListener('click', () => {
    htmlRoot.classList.toggle('dark');
    localStorage.setItem('tema', htmlRoot.classList.contains('dark') ? 'oscuro' : 'claro');
});

// --- 3. ESTADO DE LA APLICACIÓN ---
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
let filtroEstado = 'todas';
let filtroPrioridad = 'todas';
let filtroCategoria = 'todas';

// --- 4. EVENTOS DE FILTROS ---
// Filtros de Estado
botonesEstado.forEach(boton => {
    boton.addEventListener('click', () => {
        botonesEstado.forEach(b => {
            b.classList.remove('bg-green-200', 'dark:bg-green-900', 'text-green-800', 'dark:text-green-100');
            b.classList.add('hover:bg-green-100', 'dark:hover:bg-green-800', 'text-gray-700', 'dark:text-gray-300');
        });
        boton.classList.remove('hover:bg-green-100', 'dark:hover:bg-green-800', 'text-gray-700', 'dark:text-gray-300');
        boton.classList.add('bg-green-200', 'dark:bg-green-900', 'text-green-800', 'dark:text-green-100');
        
        filtroEstado = boton.dataset.filtro;
        actualizarVista();
    });
});

// Filtros de Prioridad
botonesPrioridad.forEach(boton => {
    boton.addEventListener('click', () => {
        botonesPrioridad.forEach(b => {
            b.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'bg-red-100', 'bg-yellow-100', 'bg-green-100', 'dark:bg-red-900/50', 'dark:bg-yellow-900/50', 'dark:bg-green-900/50');
        });
        
        const prio = boton.dataset.prioridad;
        if (prio === 'todas') boton.classList.add('bg-gray-200', 'dark:bg-gray-700');
        if (prio === 'alta') boton.classList.add('bg-red-100', 'dark:bg-red-900/50');
        if (prio === 'media') boton.classList.add('bg-yellow-100', 'dark:bg-yellow-900/50');
        if (prio === 'baja') boton.classList.add('bg-green-100', 'dark:bg-green-900/50');

        filtroPrioridad = prio;
        actualizarVista();
    });
});

// Filtro de Categoría
if (filtroCategoriaSelect) {
    filtroCategoriaSelect.addEventListener('change', () => {
        filtroCategoria = filtroCategoriaSelect.value || 'todas';
        actualizarVista();
    });
}

// --- 5. RENDERIZADO Y LÓGICA ---
/**
 * Recalcula el texto de búsqueda activo (desktop/móvil) y re-renderiza la lista
 * aplicando todos los filtros actuales.
 * @returns {void}
 */
function actualizarVista() {
    const textoBusqueda = (window.innerWidth < 768) ? buscadorMovil.value : buscador.value;
    renderizarTareas(textoBusqueda);
}

/**
 * Renderiza el listado de tareas aplicando filtros por texto, estado, prioridad y categoría.
 * @param {string} [filtroTexto=''] Texto del buscador.
 * @returns {void}
 */
function renderizarTareas(filtroTexto = '') {
    listaTareas.innerHTML = '';

    let tareasFiltradas = tareas.filter(tarea => {
        const coincideTexto = tarea.texto.toLowerCase().includes(filtroTexto.toLowerCase());
        
        let coincideEstado = true;
        if (filtroEstado === 'pendientes') coincideEstado = !tarea.completada;
        if (filtroEstado === 'completadas') coincideEstado = tarea.completada;

        let coincidePrioridad = true;
        if (filtroPrioridad !== 'todas') {
            const prioTarea = tarea.prioridad || 'media';
            coincidePrioridad = (prioTarea === filtroPrioridad);
        }

        let coincideCategoria = true;
        if (filtroCategoria !== 'todas') {
            const catTarea = (tarea.categoria || 'personal');
            coincideCategoria = (catTarea === filtroCategoria);
        }

        return coincideTexto && coincideEstado && coincidePrioridad && coincideCategoria;
    });

    if (tareasFiltradas.length === 0) {
        mensajeVacio.classList.remove('hidden');
    } else {
        mensajeVacio.classList.add('hidden');
    }

    tareasFiltradas.forEach(tarea => {
        const article = document.createElement('article');
        article.className = 'bg-white dark:bg-gray-800 p-4 md:p-5 rounded-xl shadow-md hover:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-green-500 dark:border-green-400 group w-full';
        
        const categoriaSegura = tarea.categoria || 'personal';
        const nombreCat = categoriaSegura.charAt(0).toUpperCase() + categoriaSegura.slice(1);
        
        let colorClases = '';
        if (categoriaSegura === 'hogar') colorClases = 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
        else if (categoriaSegura === 'trabajo') colorClases = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        else if (categoriaSegura === 'estudio') colorClases = 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
        else if (categoriaSegura === 'salud') colorClases = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        else if (categoriaSegura === 'compras') colorClases = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
        else colorClases = 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';

        const prioridadSegura = tarea.prioridad || 'media';
        let iconoPrio = '🟡';
        let colorPrio = 'text-yellow-600';
        if (prioridadSegura === 'alta') { iconoPrio = '🔴'; colorPrio = 'text-red-600'; }
        if (prioridadSegura === 'baja') { iconoPrio = '🟢'; colorPrio = 'text-green-600'; }

        const textoTachado = tarea.completada ? 'line-through opacity-50' : '';
        const checkMarcado = tarea.completada ? 'checked' : '';

        // AQUI ESTÁ LA CORRECCIÓN DEL TEXTO (Añadido min-w-0, w-full, break-words y shrink-0)
        article.innerHTML = `
            <div class="flex items-center gap-4 flex-1 min-w-0 w-full">
                <input type="checkbox" ${checkMarcado} onchange="cambiarEstado(${tarea.id})" class="w-6 h-6 text-green-500 rounded border-gray-300 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 cursor-pointer accent-green-500 shrink-0">
                <div class="flex flex-col flex-1 min-w-0">
                    <p class="text-lg font-medium text-gray-800 dark:text-gray-200 transition-all break-words ${textoTachado}">${tarea.texto}</p>
                    <span class="text-xs font-bold ${colorPrio} md:hidden mt-1 flex items-center gap-1">${iconoPrio} Prioridad ${prioridadSegura}</span>
                </div>
            </div>
            <div class="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0 pl-10 md:pl-0 shrink-0">
                <span class="hidden md:flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg border border-gray-100 dark:border-gray-700 ${colorPrio}" title="Prioridad ${prioridadSegura}">
                    ${iconoPrio}
                </span>
                <span class="px-3 py-1 text-xs font-bold rounded-full shadow-sm ${colorClases}">${nombreCat}</span>
                <button class="text-xl opacity-70 hover:opacity-100 hover:scale-125 transition-all text-red-500 focus:outline-none" onclick="borrarTarea(${tarea.id})" title="Borrar tarea">
                    🗑️
                </button>
            </div>
        `;
        listaTareas.appendChild(article);
    });
}

// --- 6. ACCIONES ---
window.cambiarEstado = function(id) {
    tareas = tareas.map(t => t.id === id ? { ...t, completada: !t.completada } : t);
    localStorage.setItem('tareas', JSON.stringify(tareas));
    actualizarVista();
};

formulario.addEventListener('submit', function(e) {
    e.preventDefault(); 
    const texto = inputTarea.value.trim(); 
    if (texto !== '') {
        tareas.unshift({
            id: Date.now(),
            texto: texto,
            categoria: selectCategoria.value,
            prioridad: selectPrioridad.value,
            completada: false
        });
        localStorage.setItem('tareas', JSON.stringify(tareas));
        
        if (filtroEstado === 'completadas') document.querySelector('[data-filtro="todas"]').click();
        if (filtroPrioridad !== 'todas' && filtroPrioridad !== selectPrioridad.value) {
            document.querySelector('[data-prioridad="todas"]').click();
        } else if (filtroCategoriaSelect && filtroCategoria !== 'todas' && filtroCategoria !== selectCategoria.value) {
            // Mantiene la UX consistente: si el usuario está filtrando por otra categoría,
            // al crear una tarea fuera de ese filtro volvemos a "todas" para que la vea.
            filtroCategoriaSelect.value = 'todas';
            filtroCategoria = 'todas';
            actualizarVista();
        } else {
            actualizarVista(); 
        }
        
        inputTarea.value = ''; 
    }
});

window.borrarTarea = function(id) {
    tareas = tareas.filter(t => t.id !== id);
    localStorage.setItem('tareas', JSON.stringify(tareas));
    actualizarVista(); 
};

buscador.addEventListener('input', actualizarVista);
buscadorMovil.addEventListener('input', actualizarVista);

// --- 7. DICTADO POR VOZ (WEB SPEECH API) ---
/**
 * Crea (si existe) una instancia de SpeechRecognition del navegador.
 * Devuelve null si el navegador no lo soporta.
 * @returns {SpeechRecognition|null}
 */
function crearSpeechRecognition() {
    const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionImpl) return null;

    const recognition = new SpeechRecognitionImpl();
    recognition.lang = 'es-ES';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    return recognition;
}

/**
 * Configura el botón de micrófono para dictado por voz.
 * - Click: alterna entre empezar/detener
 * - Feedback visual: rojo + animate-pulse mientras escucha
 * @returns {void}
 */
function inicializarDictadoPorVoz() {
    if (!btnMic || !inputTarea) return;

    const recognition = crearSpeechRecognition();
    if (!recognition) {
        btnMic.disabled = true;
        btnMic.classList.add('opacity-40', 'cursor-not-allowed');
        btnMic.title = 'Dictado por voz no disponible en este navegador';
        return;
    }

    /** @type {boolean} */
    let escuchando = false;

    const actualizarUI = () => {
        btnMic.classList.toggle('animate-pulse', escuchando);
        btnMic.classList.toggle('bg-red-500', escuchando);
        btnMic.classList.toggle('text-white', escuchando);
        btnMic.classList.toggle('border-red-600', escuchando);
        if (escuchando) {
            btnMic.title = 'Escuchando... (clic para parar)';
        } else {
            btnMic.title = 'Dictar por voz';
        }
    };

    recognition.addEventListener('start', () => {
        escuchando = true;
        actualizarUI();
    });

    recognition.addEventListener('end', () => {
        escuchando = false;
        actualizarUI();
    });

    recognition.addEventListener('result', (event) => {
        // Concatenamos resultados parciales y finales para una experiencia fluida.
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        inputTarea.value = transcript.trimStart();
        inputTarea.focus();
    });

    recognition.addEventListener('error', () => {
        // Si hay error (permisos, etc.), salimos del modo "escuchando" con feedback.
        escuchando = false;
        actualizarUI();
    });

    btnMic.addEventListener('click', () => {
        if (escuchando) {
            recognition.stop();
            return;
        }
        try {
            recognition.start();
        } catch {
            // Algunos navegadores lanzan si start() se llama muy seguido.
        }
    });
}

// --- INICIAR ---
inicializarDictadoPorVoz();
actualizarVista();