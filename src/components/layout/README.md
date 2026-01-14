# Componentes de Layout - Parking Admin

## 📦 Componentes Creados

### 1. AdminLayout (Contenedor Padre)

**Ubicación:** `src/components/layout/AdminLayout.tsx`

Contenedor principal que encapsula toda la estructura de la aplicación admin:

- Header (fijo arriba)
- Área de contenido (slot para vistas)
- Bottom Navigation (fijo abajo)
- Toast global

### 2. Header

**Ubicación:** `src/components/layout/Header.tsx`

Componente de cabecera con título, subtítulo e icono de usuario.

### 3. BottomNav

**Ubicación:** `src/components/layout/BottomNav.tsx`

Navegación inferior con tabs y botón FAB central.

---

## 🚀 Uso Básico

### Ejemplo 1: Uso Simple

```tsx
import { AdminLayout } from "@/components/layout";

export default function ParkingPage() {
  return (
    <AdminLayout>
      <div className="max-w-md mx-auto">
        <h2>Contenido de tu página aquí</h2>
      </div>
    </AdminLayout>
  );
}
```

### Ejemplo 2: Con Configuración Personalizada

```tsx
import { AdminLayout } from "@/components/layout";

export default function CustomPage() {
  const handleTabChange = (tab: "search" | "visitors") => {
    console.log("Tab cambiado a:", tab);
  };

  return (
    <AdminLayout
      title="Mi Parqueadero"
      subtitle="Edificio Central"
      userIcon="fa-user-tie"
      initialTab="visitors"
      onTabChange={handleTabChange}
    >
      <div className="max-w-md mx-auto">{/* Tu contenido aquí */}</div>
    </AdminLayout>
  );
}
```

### Ejemplo 3: Con Cambio de Vista Dinámico

```tsx
"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/layout";
import SearchView from "@/components/views/SearchView";
import VisitorsView from "@/components/views/VisitorsView";

export default function DynamicPage() {
  const [currentView, setCurrentView] = useState<"search" | "visitors">("search");

  return (
    <AdminLayout initialTab={currentView} onTabChange={setCurrentView}>
      {currentView === "search" ? <SearchView /> : <VisitorsView />}
    </AdminLayout>
  );
}
```

---

## 📋 Props

### AdminLayout Props

| Prop          | Tipo                     | Default               | Descripción                                 |
| ------------- | ------------------------ | --------------------- | ------------------------------------------- |
| `children`    | `ReactNode`              | -                     | Contenido a renderizar en el área principal |
| `title`       | `string`                 | `'Control PH'`        | Título del header                           |
| `subtitle`    | `string`                 | `'Torres del Parque'` | Subtítulo del header                        |
| `userIcon`    | `string`                 | `'fa-user-shield'`    | Clase del icono de usuario (FontAwesome)    |
| `initialTab`  | `'search' \| 'visitors'` | `'search'`            | Tab inicial activo                          |
| `onTabChange` | `(tab) => void`          | -                     | Callback cuando cambia el tab               |

### Header Props

| Prop       | Tipo     | Default               | Descripción                   |
| ---------- | -------- | --------------------- | ----------------------------- |
| `title`    | `string` | `'Control PH'`        | Título principal              |
| `subtitle` | `string` | `'Torres del Parque'` | Subtítulo                     |
| `userIcon` | `string` | `'fa-user-shield'`    | Clase del icono (FontAwesome) |

### BottomNav Props

| Prop          | Tipo                     | Default    | Descripción                            |
| ------------- | ------------------------ | ---------- | -------------------------------------- |
| `activeTab`   | `'search' \| 'visitors'` | `'search'` | Tab actualmente activo                 |
| `onTabChange` | `(tab) => void`          | -          | Callback cuando se hace clic en un tab |

---

## 🎨 Personalización

### Cambiar Colores del Header

Edita `src/components/layout/Header.tsx`:

```tsx
// Cambiar de slate-800 a otro color
<header className="bg-blue-900 text-white ...">
```

### Agregar Más Tabs

Edita `src/components/layout/BottomNav.tsx` y agrega más items en el render.

### Modificar Altura del Header

```tsx
// En Header.tsx, cambiar h-[60px] a otra altura
<header className="... h-[80px]">
```

---

## 📁 Estructura de Archivos

```
src/components/layout/
├── AdminLayout.tsx    # Contenedor padre
├── Header.tsx         # Componente de cabecera
├── BottomNav.tsx      # Navegación inferior
└── index.ts           # Exportaciones
```

---

## ✅ Próximos Pasos

1. **Crear vistas específicas:**
   - `src/components/views/SearchView.tsx`
   - `src/components/views/VisitorsView.tsx`

2. **Agregar estilos globales:**
   - Asegúrate de tener FontAwesome en `layout.tsx` o `globals.css`

3. **Integrar con rutas:**
   - Usar AdminLayout en tus páginas de Next.js

---

## 🔧 Dependencias Requeridas

- **FontAwesome**: Para los iconos
- **Tailwind CSS**: Para los estilos (ya configurado)

### Agregar FontAwesome

En `src/app/layout.tsx`:

```tsx
import { Inter } from "next/font/google";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🐛 Troubleshooting

### El toast no se muestra

Asegúrate de tener los estilos de transición en `globals.css`:

```css
.hide-scroll::-webkit-scrollbar {
  display: none;
}
.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

### Los tabs no cambian

Verifica que estés usando el callback `onTabChange` correctamente y actualizando el estado.

---

## 📝 Notas

- El componente `AdminLayout` usa `'use client'` porque maneja estado
- Los componentes `Header` y `BottomNav` son componentes de servidor por defecto
- El layout es completamente responsive y mobile-first
