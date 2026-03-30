const express = require('express');
const cors = require('cors');
const { port } = require('./config/env'); 
const taskRoutes = require('./routes/task.routes'); // Importamos nuestras rutas

const app = express();

// 1. Middlewares Globales
app.use(cors()); 
app.use(express.json()); 

// 2. Enrutamiento centralizado bajo un prefijo profesional (Fase B)
app.use('/api/v1/tasks', taskRoutes);

// 3. Middleware Global de Manejo de Excepciones (Fase C)
// Debe tener exactamente 4 parámetros para que Express lo reconozca como manejador de errores
app.use((err, req, res, next) => {
  // Mapeo semántico: Si el servicio lanzó un 'NOT_FOUND', devolvemos 404
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'La tarea solicitada no existe.' });
  }

  // Fallo genérico no controlado: Registramos la traza en consola y devolvemos 500
  console.error('[Error Interno]:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// 4. Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});

// Para que Vercel Serverless pueda usar nuestra app de Express
module.exports = app;