---

# 🎨 SmartLogix - Frontend Application

## 📖 Descripción General

Bienvenido al repositorio frontend de **SmartLogix**. Esta aplicación es una **Single Page Application (SPA)** de alto rendimiento, diseñada para integrarse de forma fluida con nuestro ecosistema de microservicios.

Siguiendo el principio **"Don't make me wait"**, la interfaz prioriza la velocidad de respuesta y la eficiencia, utilizando **Vite** para un desarrollo ágil y **React + TypeScript** para garantizar un despliegue seguro y escalable.

---

## 🛠️ Pila Tecnológica (Tech Stack)

Este proyecto utiliza herramientas estandarizadas de nivel producción:

* **Core:** React + TypeScript + Vite.
* **Enrutamiento:** [TanStack Router](https://tanstack.com/router) (Seguridad de tipos en rutas).
* **Estilización:** Tailwind CSS.
* **Gestión de Estado:** [Zustand](https://github.com/pmndrs/zustand) (Estado ligero y reactivo).
* **Sincronización de Datos:** [TanStack Query](https://tanstack.com/query) (Caché y fetching asíncrono).
* **Formularios:** React Hook Form + validación de esquemas con **Zod**.
* **Mocking:** Faker (Para desarrollo local aislado).

---

## 📁 Arquitectura del Repositorio (Metodología ELER)

La estructura de carpetas está diseñada para la fácil localización de módulos y escalabilidad:

```text
src/
├── assets/         # Recursos estáticos (Fuentes, imágenes)
├── components/     # Componentes reutilizables (Atómicos/Moléculas)
├── hooks/          # Lógica de ciclo de vida y hooks personalizados
├── pages/          # Vistas principales vinculadas al enrutador
├── services/       # Clientes de API (Axios) y capas de datos
├── store/          # Definiciones de estado global (Zustand)
└── utils/          # Constantes, helpers y transformadores puros

```

---

## 🚀 Guía de Inicio Rápido

### Requisitos Previos

* [Node.js](https://nodejs.org/) (Versión LTS recomendada)
* [pnpm](https://pnpm.io/) (Gestor de paquetes preferido)

### Instalación y Ejecución

1. **Clonar el repositorio:**
```bash
git clone https://github.com/empresa/frontend-app.git
cd frontend-app

```


2. **Instalar dependencias:**
```bash
pnpm install

```


3. **Iniciar servidor de desarrollo:**
```bash
pnpm run dev "or" npm.cmd run dev

```


> El servidor Vite iniciará en `http://localhost:5173`. El HMR (Hot Module Replacement) está activado por defecto.



---

## 🧪 Control de Calidad y Pruebas

Mantenemos un estándar riguroso donde el código no probado no se integra al flujo principal.

* **Linter:** `pnpm lint` (Reglas restrictivas de ESLint).
* **Pruebas Unitarias:** `pnpm test` (Lanzado con **Vitest**).
* **Componentes:** React Testing Library.
* **E2E:** `pnpm run test:e2e` (Ejecución mediante **Playwright**).

---

## 📐 Convenciones de Contribución

Este repositorio utiliza ganchos de Git (**Husky**) para asegurar la consistencia.

1. **Commits Convencionales:** Se requiere el uso de prefijos semánticos (ej: `feat:`, `fix:`, `chore:`).
2. **Auto-formateo:** Prettier se ejecuta automáticamente antes de cada commit.
3. **Documentación:** Si creas una nueva API o componente, actualiza los contratos en el archivo correspondiente.

---

## 🧠 Filosofía: La Simbiosis de la Documentación Desacoplada

En nuestra arquitectura de microservicios, el frontend y el backend operan como entidades aisladas. Sin embargo, sus `README.md` mantienen una relación simbiótica crítica:

* **Contratos Transparentes:** Un desarrollador frontend debe poder consumir la API basándose únicamente en el README del backend y herramientas como Faker, sin necesidad de compilar el código de Java/Spring Boot.
* **Eficiencia de Red:** Los ingenieros de backend utilizan este documento para entender las estrategias de caché de **TanStack Query** en el cliente, permitiéndoles optimizar proactivamente las consultas en JPA o las capas de Redis.

Esta documentación no es opcional; es el **núcleo central de nuestra infraestructura**, reduciendo la carga cognitiva y acelerando nuestro *Time-to-Market*.

---
