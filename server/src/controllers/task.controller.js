
const taskService = require('../services/task.service');

const obtenerTodas = (req, res, next) => {
  try {
    const tasks = taskService.obtenerTodas();
    res.status(200).json(tasks);
  } catch (error) {
    next(error); 
  }
};

const crearTarea = (req, res, next) => {
  try {
    const { titulo, prioridad, categoria } = req.body;


    if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
      return res.status(400).json({ error: "El título es obligatorio y debe tener al menos 3 caracteres." });
    }

    if (typeof prioridad !== 'number' || prioridad < 1) {
      return res.status(400).json({ error: "La prioridad debe ser un número positivo." });
    }

   
    const nuevaTarea = taskService.crearTarea({ titulo, prioridad, categoria });
    
    
    res.status(201).json(nuevaTarea);
  } catch (error) {
    next(error);
  }
};

const eliminarTarea = (req, res, next) => {
  try {
    const { id } = req.params; 
    
    taskService.eliminarTarea(id);
    
    
    res.status(204).send(); 
  } catch (error) {
    next(error); 
  }
};

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea
};