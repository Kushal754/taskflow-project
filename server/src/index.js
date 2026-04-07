const express = require('express');
const cors = require('cors');
const { port } = require('./config/env'); 
const taskRoutes = require('./routes/task.routes'); 

const app = express();

// 1. Middlewares Globales
app.use(cors()); 
app.use(express.json()); 

// 2. Enrutamiento centralizado bajo un prefijo profesional (Fase B)
app.use('/api/v1/tasks', taskRoutes);

// 3. Middleware Global de Manejo de Excepciones (Fase C)
// Debe tener exactamente 4 parámetros para que Express lo reconozca como manejador de errores
app.use((err, req, res, next) => {
  
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'La tarea solicitada no existe.' });
  }

  
  console.error('[Error Interno]:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}


module.exports = app;

