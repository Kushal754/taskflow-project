// Elementos del DOM
const formulario = document.getElementById('formulario-tarea');
const inputTarea = document.getElementById('input-tarea');
const selectCategoria = document.getElementById('select-categoria');
const listaTareas = document.getElementById('lista-tareas');
const buscador = document.getElementById('buscador');

// --- LÓGICA DEL MODO OSCURO ---
const btnDarkMode = document.getElementById('btn-dark-mode');
const htmlRoot = document.getElementById('html-root');

if (localStorage.getItem('tema') === 'oscuro') {
    htmlRoot.classList.add('dark');
}

btnDarkMode.addEventListener('click', () => {
    htmlRoot.classList.toggle('dark');
    if (htmlRoot.classList.contains('dark')) {
        localStorage.setItem('tema', 'oscuro');
    } else {
        localStorage.setItem('tema', 'claro');
    }
});

// --- Cargar tareas guardadas ---
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

function renderizarTareas(filtroTexto = '') {
    listaTareas.innerHTML = '';

    const tareasFiltradas = tareas.filter(tarea => 
        tarea.texto.toLowerCase().includes(filtroTexto.toLowerCase())
    );

    tareasFiltradas.forEach(tarea => {
        const article = document.createElement('article');
        article.className = 'bg-white dark:bg-gray-800 p-4 md:p-5 rounded-xl shadow-md hover:shadow-lg flex items-center justify-between transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-green-500 dark:border-green-400 group';
        
        const categoriaSegura = tarea.categoria || 'personal';
        const nombreCat = categoriaSegura.charAt(0).toUpperCase() + categoriaSegura.slice(1);
        
        
        let colorClases = '';
        if (categoriaSegura === 'hogar') colorClases = 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
        else if (categoriaSegura === 'trabajo') colorClases = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        else if (categoriaSegura === 'estudio') colorClases = 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
        else if (categoriaSegura === 'salud') colorClases = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        else colorClases = 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'; // personal

        article.innerHTML = `
            <div class="flex items-center gap-4 flex-1">
                <input type="checkbox" class="w-5 h-5 text-green-500 rounded border-gray-300 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600">
                <p class="text-lg font-medium text-gray-800 dark:text-gray-200">${tarea.texto}</p>
            </div>
            <div class="flex items-center gap-3">
                <span class="px-3 py-1 text-xs font-bold rounded-full hidden md:block shadow-sm ${colorClases}">${nombreCat}</span>
                <button class="text-xl opacity-70 hover:opacity-100 hover:scale-125 transition-all text-red-500 focus:outline-none" onclick="borrarTarea(${tarea.id})">
                    🗑️
                </button>
            </div>
        `;
        
        listaTareas.appendChild(article);
    });
}

function guardarEnLocalStorage() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault(); 
    const texto = inputTarea.value.trim(); 
    if (texto !== '') {
        const nuevaTarea = {
            id: Date.now(),
            texto: texto,
            categoria: selectCategoria.value
        };
        tareas.push(nuevaTarea); 
        guardarEnLocalStorage(); 
        renderizarTareas(buscador.value); 
        inputTarea.value = ''; 
    }
});

window.borrarTarea = function(id) {
    tareas = tareas.filter(tarea => tarea.id !== id);
    guardarEnLocalStorage(); 
    renderizarTareas(buscador.value); 
};

buscador.addEventListener('input', function(evento) {
    renderizarTareas(evento.target.value);
});

renderizarTareas();