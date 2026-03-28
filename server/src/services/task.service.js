
let tasks = []; 
let currentId = 1; 

const obtenerTodas = () => {
  return tasks;
};

const crearTarea = (data) => {
  const nuevaTarea = {
    id: currentId++,
    titulo: data.titulo,
    prioridad: data.prioridad,
    completada: false,
    categoria: data.categoria || 'General' 
  };
  
  tasks.push(nuevaTarea);
  return nuevaTarea;
};

const eliminarTarea = (id) => {
 
  const index = tasks.findIndex(task => task.id === parseInt(id));
  
  
  if (index === -1) {
    throw new Error('NOT_FOUND');
  }
  
  
  tasks.splice(index, 1);
  return true;
};


module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea
};