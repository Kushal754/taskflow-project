const express = require('express');
const cors = require('cors');
const { port } = require('./config/env'); 
const taskRoutes = require('./routes/task.routes'); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/v1/tasks', taskRoutes);

// --- CONFIGURACIÓN CRÍTICA PARA VERCEL ---

// 1. Exportar la app (Obligatorio para que Vercel levante el Backend)
module.exports = app;

// 2. Escuchar el puerto SOLO si estamos en local (Evita el Error 500 EADDRINUSE en Vercel)
if (!process.env.VERCEL) {
    const PORT = port || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor local en puerto ${PORT}`);
    });
}