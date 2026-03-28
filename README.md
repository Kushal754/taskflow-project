# 📝 TaskFlow Pro - Aplicación Full-Stack de Gestión de Tareas

TaskFlow Pro es una aplicación web completa y robusta para la gestión de tareas. Este proyecto ha evolucionado desde una interfaz estática hasta convertirse en una arquitectura cliente-servidor real, implementando buenas prácticas de ingeniería de software, diseño responsive y consumo de APIs RESTful.

## 🔗 Enlace del Proyecto (Live Demo)
Puedes ver la aplicación final funcionando aquí: **[TaskFlow Pro en Vercel](https://taskflow-project-six-pi.vercel.app/)**

*(Nota: El backend está alojado en la capa gratuita de Render, por lo que la primera petición puede tardar unos segundos en "despertar" al servidor).*

---

## 🚀 Características Principales

### Frontend (Interfaz de Usuario)
* **Diseño Profesional con Tailwind CSS:** Interfaz moderna, limpia y construida 100% con clases de utilidad.
* **Modo Oscuro Dinámico:** Soporte total para `dark mode` mediante un botón interactivo y guardado de preferencias.
* **Filtros Avanzados:** Capacidad de filtrar tareas en tiempo real por Estado (Pendiente/Completada), Prioridad (Alta/Media/Baja), Categoría y Búsqueda por texto.
* **🎤 Bonus - Dictado por Voz:** Integración con la Web Speech API para añadir tareas dictándolas por el micrófono.
* **Manejo de Estados de Red:** Feedback visual para el usuario ("Cargando...", mensajes de error amigables) mientras se espera la respuesta del servidor.

### Backend (Servidor y API)
* **API RESTful:** Servidor propio construido desde cero para manejar el CRUD completo de las tareas (GET, POST, DELETE).
* **Arquitectura por Capas:** Separación estricta de responsabilidades (Rutas -> Controladores -> Servicios) para un código escalable y mantenible.
* **Validación Defensiva:** El controlador intercepta peticiones malformadas (ej. títulos cortos o vacíos) y devuelve códigos de error HTTP semánticos (400 Bad Request).
* **CORS Habilitado:** Configuración de seguridad perimetral para permitir la comunicación entre distintos dominios.

---

## 🛠️ Tecnologías Utilizadas

**Frontend:**
* HTML5 Semántico
* Tailwind CSS (Framework de diseño)
* JavaScript Vanilla (ES6+, Modules, Async/Await, Fetch API)

**Backend:**
* Node.js (Entorno de ejecución)
* Express.js (Framework para el servidor HTTP)

**Despliegue e Infraestructura:**
* **Vercel:** Hosting del Frontend.
* **Render:** Hosting del Backend Node.js.
* **GitHub:** Control de versiones y CI/CD integrado con las plataformas de despliegue.

---

## 📚 Documentación Adicional del Proyecto

Para profundizar en las decisiones técnicas de este proyecto, puedes consultar la siguiente documentación interna:
* [Arquitectura del Servidor y Endpoints (API)](./server/README.md)
* [Investigación de Herramientas Backend (Axios, Postman, Sentry, Swagger)](./docs/backend-api.md)