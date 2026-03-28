# ⚙️ TaskFlow Backend - API RESTful

Este módulo contiene la implementación del servidor Node.js/Express para la aplicación TaskFlow, diseñado con principios estrictos de ingeniería de software para proporcionar una arquitectura cliente-servidor robusta.

## 🏗️ Arquitectura por Capas (Layered Architecture)
Para garantizar la escalabilidad y la estricta Separación de Responsabilidades (SoC), la API está estructurada en tres capas unidireccionales:

1. **Capa de Enrutamiento (`src/routes/`):** Capa de presentación de red. Se limita a escuchar peticiones HTTP, mapear los verbos (GET, POST, DELETE) y URLs, delegando el control inmediatamente al controlador correspondiente.
2. **Capa de Controladores (`src/controllers/`):** Actúa como la **frontera de red estricta (Network Boundary)**. Extrae el `req.body` o `req.params`, realiza la validación defensiva (ej. rechazar peticiones con títulos cortos o prioridades numéricas inválidas) y, solo si el contrato se cumple, invoca a la capa de servicios. Formatea y devuelve la respuesta HTTP exacta (200, 201, 204).
3. **Capa de Servicios (`src/services/`):** El núcleo intelectual o "Cerebro". Contiene la lógica de negocio pura y la mutación de estado. Esta capa desconoce por completo la existencia de HTTP, Express, `req` o `res`, lo que la hace agnóstica de la red.

## 🛡️ Patrón Pipeline y Middlewares
El ciclo de vida de la petición fluye a través de una Cadena de Responsabilidad (Middlewares) configurada en `index.js`:

* **`cors()`:** Middleware de seguridad perimetral que gestiona el Intercambio de Recursos de Origen Cruzado (CORS), permitiendo que nuestro frontend consuma la API de forma segura.
* **`express.json()`:** Middleware de parseo que intercepta el flujo crudo de la red y lo transforma en objetos nativos de JavaScript disponibles en `req.body`.
* **Manejador Global de Errores (Global Error Handler):** Un middleware final de 4 parámetros `(err, req, res, next)` que captura cualquier excepción no controlada en la aplicación, garantizando que el servidor Node.js (que es single-thread) no sufra un crash. Mapea errores semánticos (ej. un error `NOT_FOUND` lanzado por el servicio se convierte en un HTTP 404 limpio).

## 🔌 Ejemplos de Interacción (Endpoints REST)

### 1. Obtener todas las tareas (Idempotente)
* **Petición:** `GET /api/v1/tasks`
* **Respuesta Exitosa (200 OK):**
  ```json
  [
    { "id": 1, "titulo": "Aprender Node", "prioridad": 2, "categoria": "Estudio", "completada": false }
  ]
  ```

### 2. Crear una tarea (No Idempotente)
* **Petición:** `POST /api/v1/tasks`
* **Cuerpo (Payload):**
  ```json
  { "titulo": "Comprar pan", "prioridad": 1, "categoria": "Compras" }
  ```
* **Respuesta Exitosa (201 Created):** Devuelve el objeto creado con su ID generado por el servidor.
* **Respuesta de Error (400 Bad Request):** Si el título tiene menos de 3 caracteres o falta.

### 3. Eliminar una tarea
* **Petición:** `DELETE /api/v1/tasks/:id`
* **Respuesta Exitosa (204 No Content):** Sin cuerpo de respuesta.
* **Respuesta de Error (404 Not Found):** Si se intenta borrar un ID que no existe en el sistema.