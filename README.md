# Parking PWA - Next.js

Aplicación Progressive Web App para gestión de parqueo, construida con Next.js 16, TypeScript y Tailwind CSS.

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 22.x o superior
- npm 10.x o superior

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 📁 Estructura del Proyecto

```
parking/
├── public/
│   ├── icons/          # Iconos para PWA
│   └── images/         # Imágenes estáticas
├── src/
│   ├── app/            # App Router de Next.js
│   ├── components/     # Componentes reutilizables
│   ├── services/       # Servicios y API calls
│   ├── stores/         # Estado global
│   ├── types/          # Tipos TypeScript
│   └── utils/          # Utilidades
└── package.json
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 📦 Tecnologías

- **Framework**: Next.js 16.1.1
- **UI**: React 19.2.3
- **Estilos**: Tailwind CSS 4
- **Lenguaje**: TypeScript 5
- **Linting**: ESLint 9

## 🔄 Fases de Desarrollo

- [x] **Fase 1**: Configuración Inicial del Proyecto
- [ ] **Fase 2**: Configuración PWA
- [ ] **Fase 3**: Configuración de Herramientas de Desarrollo
- [ ] **Fase 4**: Configuración de UI y Estilos

## 📝 Variables de Entorno

Crea un archivo `.env.local` basado en `.env.example`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Parking App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🌐 PWA

Esta aplicación está configurada como una Progressive Web App, lo que permite:
- Instalación en dispositivos móviles y escritorio
- Funcionamiento offline
- Notificaciones push
- Actualizaciones automáticas

## 📄 Licencia

Proyecto privado - Todos los derechos reservados
