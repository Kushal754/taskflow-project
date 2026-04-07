# 🚀 TaskFlow Pro: Full-Stack Task Management

TaskFlow Pro es una solución integral para la gestión de productividad personal. En esta versión (Tarea 3), el proyecto ha evolucionado de una aplicación estática a una **Arquitectura Full-Stack**, desacoplando el cliente del servidor mediante una API RESTful de alto rendimiento.

🌐 **Despliegue en Producción:** [https://taskflow-project-jvx2.vercel.app/]

---

## 💎 Características Principales
- **Persistencia Asíncrona:** Comunicación fluida con el backend mediante `Fetch API`.
- **Interfaz Reactiva:** Estilizada con Tailwind CSS, optimizada para dispositivos móviles y con soporte nativo para **Modo Oscuro**.
- **UX Optimizada:** Implementación de *Skeleton Screens* y estados de carga durante las peticiones asíncronas (Requisito Extra).
- **Gestión Avanzada:** Filtrado multidimensional por estado, categoría y prioridad.
- **Accesibilidad:** Soporte integrado para dictado por voz mediante `Web Speech API`.

## 🛠️ Stack Tecnológico
- **Frontend:** HTML5, JavaScript Moderno (ES6+), Tailwind CSS.
- **Backend:** Node.js, Express Framework.
- **Infraestructura:** Vercel (Serverless Environment).

## 📂 Estructura del Proyecto
```text
.
├── api/                # Enrutamiento para Vercel
├── public/             # Activos estáticos (HTML, CSS, JS)
├── server/             # Lógica del Servidor (Node/Express)
│   ├── src/
│   │   ├── routes/     # Definición de Endpoints
│   │   └── config/     # Variables de entorno y configuración
│   └── README.md       # Documentación técnica del servidor
├── vercel.json         # Configuración de despliegue y routing
└── package.json        # Dependencias del proyecto