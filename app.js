// --- 1. REFERENCIAS AL DOM ---
const formulario = document.getElementById('formulario-tarea');
const inputTarea = document.getElementById('input-tarea');
const selectCategoria = document.getElementById('select-categoria');
const selectPrioridad = document.getElementById('select-prioridad');
const listaTareas = document.getElementById('lista-tareas');
const mensajeVacio = document.getElementById('mensaje-vacio');
const buscador = document.getElementById('buscador');
const buscadorMovil = document.getElementById('buscador-movil');

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

// --- 5. RENDERIZADO Y LÓGICA ---
function actualizarVista() {
    const textoBusqueda = (window.innerWidth < 768) ? buscadorMovil.value : buscador.value;
    renderizarTareas(textoBusqueda);
}

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

        return coincideTexto && coincideEstado && coincidePrioridad;
    });

    if (tareasFiltradas.length === 0) {
        mensajeVacio.classList.remove('hidden');
    } else {
        mensajeVacio.classList.add('hidden');
    }

    tareasFiltradas.forEach(tarea => {
        const article = document.createElement('article');
        article.className = 'bg-white dark:bg-gray-800 p-4 md:p-5 rounded-xl shadow-md hover:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-green-500 dark:border-green-400 group';
        
        const categoriaSegura = tarea.categoria || 'personal';
        const nombreCat = categoriaSegura.charAt(0).toUpperCase() + categoriaSegura.slice(1);
        
        let colorClases = '';
        if (categoriaSegura === 'hogar') colorClases = 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
        else if (categoriaSegura === 'trabajo') colorClases = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        else if (categoriaSegura === 'estudio') colorClases = 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
        else if (categoriaSegura === 'salud') colorClases = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        else colorClases = 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';

        const prioridadSegura = tarea.prioridad || 'media';
        let iconoPrio = '🟡';
        let colorPrio = 'text-yellow-600';
        if (prioridadSegura === 'alta') { iconoPrio = '🔴'; colorPrio = 'text-red-600'; }
        if (prioridadSegura === 'baja') { iconoPrio = '🟢'; colorPrio = 'text-green-600'; }

        const textoTachado = tarea.completada ? 'line-through opacity-50' : '';
        const checkMarcado = tarea.completada ? 'checked' : '';

        article.innerHTML = `
            <div class="flex items-center gap-4 flex-1">
                <input type="checkbox" ${checkMarcado} onchange="cambiarEstado(${tarea.id})" class="w-6 h-6 text-green-500 rounded border-gray-300 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 cursor-pointer accent-green-500 shrink-0">
                <div class="flex flex-col">
                    <p class="text-lg font-medium text-gray-800 dark:text-gray-200 transition-all ${textoTachado}">${tarea.texto}</p>
                    <span class="text-xs font-bold ${colorPrio} md:hidden mt-1 flex items-center gap-1">${iconoPrio} Prioridad ${prioridadSegura}</span>
                </div>
            </div>
            <div class="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0 pl-10 md:pl-0">
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

// --- INICIAR ---
actualizarVista();