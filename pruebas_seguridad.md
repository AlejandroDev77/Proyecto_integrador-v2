# Auditoría de Seguridad - Aplicación React + Spring Boot

## Rol

Actúa como un auditor de seguridad senior especializado en aplicaciones web modernas, arquitectura cliente-servidor y análisis de vulnerabilidades.

---

# Objetivo

Realiza una auditoría de seguridad completa de esta aplicación React + Spring Boot.

Busca vulnerabilidades, riesgos de seguridad, malas prácticas y posibles vectores de ataque.

Evalúa el sistema completo considerando:

- OWASP Top 10
- Seguridad del frontend
- Seguridad del backend
- Comunicación cliente-servidor
- Protección de datos
- Autenticación
- Autorización
- Configuración de seguridad
- Dependencias utilizadas
- Arquitectura general

Prioriza especialmente:

- Autenticación
- Autorización
- Gestión de usuarios y roles
- JWT y manejo de tokens
- CORS
- SQL Injection
- XSS
- CSRF
- Exposición de información sensible
- Validación de entradas
- Manejo de errores
- Seguridad de APIs REST
- Configuración del servidor

---

# Estructura del proyecto

La aplicación está organizada dentro de una carpeta raíz que contiene dos componentes principales:

```
/frontend
/backend
```

---

# Frontend

Ubicación:

```
/frontend
```

Tecnología:

- React

Responsabilidades:

- Interfaz de usuario
- Gestión de rutas del cliente
- Comunicación con la API del backend
- Manejo de autenticación del usuario
- Gestión de estados y datos mostrados al usuario

Analiza los siguientes aspectos de seguridad:

- Almacenamiento y manejo de tokens
- JWT en el navegador
- Protección de rutas
- Exposición de información sensible
- Validación de formularios
- Cross-Site Scripting (XSS)
- Manejo de errores
- Configuración del cliente
- Dependencias del frontend
- Comunicación segura con el backend

---

# Backend

Ubicación:

```
/backend
```

Tecnología:

- Spring Boot

Responsabilidades:

- API REST
- Lógica de negocio
- Autenticación
- Autorización
- Gestión de usuarios
- Roles y permisos
- Comunicación con base de datos
- Procesamiento de solicitudes

Analiza los siguientes aspectos de seguridad:

- Spring Security
- JWT
- Roles y permisos
- Control de acceso
- Protección de endpoints
- Validación de datos
- SQL Injection
- Configuración del servidor
- Manejo de excepciones
- Exposición de información
- Dependencias vulnerables

---

# Comunicación entre componentes

El sistema funciona con una arquitectura cliente-servidor:

```
Usuario
   |
   |
Frontend React
   |
   |
API REST Spring Boot
   |
   |
Base de datos
```

Analiza la seguridad del flujo completo.

No asumas que frontend y backend son seguros por separado.

Evalúa los puntos donde ambos componentes interactúan:

- Envío de credenciales
- Manejo de tokens
- Permisos
- Validación de información
- Comunicación API
- Exposición de datos

---

# Restricciones

- No modificar código.
- No aplicar cambios directamente.
- Primero analizar y documentar vulnerabilidades.
- No asumir que una implementación es segura sin comprobarla.
- Diferenciar entre vulnerabilidades reales y recomendaciones preventivas.

---

# Análisis de seguridad requerido

Evalúa:

- OWASP Top 10
- Buenas prácticas de desarrollo seguro
- Principio de mínimo privilegio
- Seguridad por diseño
- Protección de información sensible
- Separación de responsabilidades
- Seguridad de autenticación y autorización
- Configuración para producción

---

# Formato del informe

Genera el resultado en formato Markdown (.md).

Para cada vulnerabilidad encontrada utiliza la siguiente estructura:

---

# Vulnerabilidad: [Nombre]

## Severidad

Clasificar como:

- Crítica
- Alta
- Media
- Baja

## Categoría OWASP

Indicar la categoría correspondiente de OWASP Top 10.

## Ubicación

Indicar si es posible:

- Archivo
- Clase
- Componente
- Endpoint
- Módulo afectado

## Descripción

Explicar:

- Qué problema existe.
- Por qué representa un riesgo.
- Cómo podría ser aprovechado.

## Impacto

Describir:

- Información afectada.
- Acciones que podría realizar un atacante.
- Consecuencias para el sistema.

## Evidencia

Mostrar referencias al código, configuración o comportamiento relacionado.

## Recomendación

Explicar la solución recomendada y las buenas prácticas para corregirlo.

---

# Resumen ejecutivo

Al finalizar incluye:

## Nivel general de seguridad

Clasificar:

- Bajo riesgo
- Riesgo medio
- Alto riesgo
- Riesgo crítico

## Resumen de vulnerabilidades

Cantidad encontrada:

- Vulnerabilidades críticas:
- Vulnerabilidades altas:
- Vulnerabilidades medias:
- Vulnerabilidades bajas:

## Componentes afectados

Indicar:

- Frontend React
- Backend Spring Boot
- Base de datos
- Autenticación
- Configuración
- Arquitectura

## Recomendaciones prioritarias

Lista las acciones más importantes para mejorar la seguridad del sistema.

---

# Observaciones adicionales

Incluye riesgos relacionados con:

- Diseño de arquitectura
- Escalabilidad segura
- Mantenimiento futuro
- Configuración de producción
- Protección de datos
- Mejoras preventivas