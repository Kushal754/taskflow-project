# 💻 Flujo de trabajo con Cursor IDE
## Exploración de la Interfaz y Atajos
Durante mi primer contacto con Cursor, he experimentado con sus herramientas integradas, las cuales cambian por completo el flujo de trabajo tradicional:

### Atajos de teclado más frecuentes:
* **`Tab` (Autocompletado):** Al escribir un comentario como `// Función para eliminar tareas completadas`, Cursor genera el código en texto fantasma (Ghost Text) y se acepta con Tab.
* **`Ctrl + K` (Edición Inline):** Permite seleccionar un bloque de código y pedirle a la IA que lo modifique directamente en el archivo. Lo usé para inyectar `console.log` sin escribirlo manualmente.
* **`Ctrl + L` (Chat Contextual):** Abre un panel lateral para hacer preguntas sobre el código seleccionado, permitiendo a la IA "leer" el archivo en el que estoy trabajando.
* **`Ctrl + I` (Composer):** Herramienta avanzada para generar cambios arquitectónicos o que afecten a varios archivos simultáneamente.

## 🔌 Integración de Model Context Protocol (MCP)

### ¿Qué es MCP y por qué es útil?
El Model Context Protocol (MCP) es un estándar abierto que permite a los asistentes de IA conectarse de forma segura a fuentes de datos externas y herramientas locales. En proyectos reales, esto es extremadamente útil porque permite a la IA interactuar directamente con bases de datos, repositorios de GitHub o el sistema de archivos completo del ordenador. Esto elimina la necesidad de copiar y pegar código manualmente y le da a la IA un contexto global de todo el proyecto a la vez.

### Instalación del Servidor MCP (Filesystem) paso a paso:
1. Abrí la configuración de Cursor (Settings) y navegué hasta la sección `Features > MCP`.
2. Hice clic en `Add Custom MCP` (que me abrió el archivo de configuración `mcp.json`).
3. Configuré el servidor escribiendo este objeto JSON:
   - **Name:** `MyFileSystem`
   - **Command:** `npx`
   - **Args:** `["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\kusha\\Downloads\\taskflow-project"]`
4. Guardé el archivo y verifiqué en Settings que el servidor apareciera con el indicador verde de estado activo.

### Consultas realizadas usando MCP:
Para verificar el funcionamiento, abrí el chat de Cursor (`Ctrl + L`) y realicé 5 consultas pidiéndole a la IA que usara la herramienta MCP conectada a mis archivos:
1. Listar todos los archivos en la raíz del proyecto.
2. Contar el número exacto de botones dentro de `index.html`.
3. Explorar la estructura de carpetas dentro de `docs/`.
4. Leer el archivo `docs/ai/ai-comparison.md` y resumir el ganador del Asalto 3.
5. Analizar `app.js` para identificar qué función interactúa con el `localStorage`.
La IA fue capaz de ejecutar comandos de lectura en mi disco duro local de forma autónoma y responder con precisión basándose en los archivos reales.

