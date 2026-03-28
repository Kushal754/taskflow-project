// URL base de nuestro servidor Node.js
const API_URL = 'http://localhost:3000/api/v1/tasks';

// Exportamos un objeto que centraliza todas las llamadas a la red
export const apiClient = {
  
  // GET: Recuperar todas las tareas del servidor
  obtenerTareas: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar las tareas del servidor.');
      return await response.json();
    } catch (error) {
      console.error('[Network Error]:', error);
      throw error; // Propagamos el error a la interfaz
    }
  },

  // POST: Crear una nueva tarea en el servidor
  crearTarea: async (tareaData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Convertimos el objeto de JavaScript a un string JSON para enviarlo por la red
        body: JSON.stringify(tareaData)
      });
      
      if (!response.ok) {
        // Si el servidor devuelve 400 (ej. título muy corto), capturamos ese mensaje
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la tarea.');
      }
      
      return await response.json();
    } catch (error) {
      console.error('[Network Error]:', error);
      throw error;
    }
  },

  // DELETE: Eliminar una tarea por ID
  eliminarTarea: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Error al eliminar la tarea.');
      
      return true; // Retornamos true porque un 204 No Content no devuelve JSON
    } catch (error) {
      console.error('[Network Error]:', error);
      throw error;
    }
  }
};