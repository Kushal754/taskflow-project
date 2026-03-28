# 📚 Conceptos Clave de Backend y APIs

Como parte del desarrollo de la Fase 3, aquí se documentan las herramientas estándar de la industria utilizadas para la construcción, consumo, prueba y monitorización de APIs RESTful.

## 1. Axios
**¿Qué es?** Es un cliente HTTP basado en promesas para Node.js y el navegador. Es una alternativa a la API nativa `fetch` que hemos utilizado en nuestro proyecto.
**¿Por qué se usa?**
A diferencia de `fetch`, Axios transforma automáticamente los datos JSON (no necesitas hacer `response.json()`), maneja mejor los tiempos de espera (timeouts), y rechaza automáticamente las promesas cuando hay códigos de error HTTP (como 400 o 500), lo que simplifica enormemente la gestión de errores en el frontend.

## 2. Postman
**¿Qué es?**
Es una plataforma colaborativa para el desarrollo de APIs. Proporciona una interfaz gráfica para interactuar con servidores HTTP.
**¿Por qué se usa?**
Permite a los desarrolladores simular peticiones del cliente (GET, POST, DELETE, etc.) hacia el backend sin necesidad de tener un frontend construido. En este proyecto, lo utilizamos para probar la validación defensiva de nuestro controlador forzando errores `400 Bad Request` antes de conectar la interfaz de usuario.

## 3. Sentry
**¿Qué es?**
Es una plataforma de monitorización de errores y rendimiento de aplicaciones (APM - Application Performance Monitoring) en tiempo real.
**¿Por qué se usa?**
En producción, si un usuario experimenta un error 500 (Internal Server Error) que tira el servidor, el desarrollador no está mirando la consola de la terminal. Sentry captura ese error automáticamente, guarda el contexto (qué usuario era, qué petición hizo, en qué línea exacta del código falló) y envía una alerta al equipo de desarrollo para solucionarlo rápidamente.

## 4. Swagger (OpenAPI)
**¿Qué es?**
Es un conjunto de herramientas de código abierto construidas en torno a la Especificación OpenAPI (OAS) que ayuda a diseñar, construir y documentar APIs REST.
**¿Por qué se usa?**
En lugar de escribir documentos de texto planos explicando cómo usar la API, Swagger genera una página web interactiva donde cualquier desarrollador puede ver todos los endpoints disponibles, qué datos requiere el `req.body`, qué devolverá el servidor, e incluso probar las peticiones directamente desde la documentación. Es el estándar absoluto para contratos de red.