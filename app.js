
const formulario = document.getElementById('formulario-tarea');
const inputTarea = document.getElementById('input-tarea');
const selectCategoria = document.getElementById('select-categoria');
const listaTareas = document.getElementById('lista-tareas');
const buscador = document.getElementById('buscador');


let tareas = JSON.parse(localStorage.getItem('tareas')) || [];


function renderizarTareas(filtroTexto = '') {
    listaTareas.innerHTML = '';

    
    const tareasFiltradas = tareas.filter(tarea => 
        tarea.texto.toLowerCase().includes(filtroTexto.toLowerCase())
    );

    tareasFiltradas.forEach(tarea => {
        const article = document.createElement('article');
        article.className = 'tarjeta-tarea';
        
        
        const categoriaSegura = tarea.categoria || 'personal';
        
        
        const nombreCat = categoriaSegura.charAt(0).toUpperCase() + categoriaSegura.slice(1);
        
        article.innerHTML = `
            <input type="checkbox" class="checkbox">
            <p class="titulo-tarea">${tarea.texto}</p>
            <div class="grupo-badges">
                <span class="badge badge-${categoriaSegura}">${nombreCat}</span>
                <button class="btn-borrar" onclick="borrarTarea(${tarea.id})">🗑️</button>
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