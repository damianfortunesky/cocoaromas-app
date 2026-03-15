# Task 21 - Frontend flows mínimos viables

## Objetivo
Alinear frontend con los nuevos flujos mínimos expuestos por backend para operar:

- información de usuario autenticado (`/me/profile`, `/me/addresses`)
- productos
- promociones
- categorías administrativas
- gestión de stock con motivo de ajuste

## Cambios implementados

### 1) Mi cuenta (perfil + direcciones)
Se creó una nueva pantalla autenticada **Mi cuenta** (`/mi-cuenta`) para completar y mantener datos del usuario:

- actualización de perfil (`GET/PUT /me/profile`)
- listado/alta/edición/baja de direcciones (`GET/POST/PUT/DELETE /me/addresses`)

Además, se actualizó la navegación principal para que el acceso de cuenta apunte a este flujo.

### 2) Categorías administrativas
Se incorporó el flujo administrativo completo de categorías:

- hooks de React Query para listar/crear/editar/eliminar
- repositorio API para `/admin/categories`
- pantalla nueva en admin: `/admin/categorias`
- enlace en menú lateral admin y acceso rápido en dashboard

### 3) Productos y promociones consumiendo categorías administrativas
Se cambió el consumo de categorías en formularios admin de:

- productos
- promociones

para usar listado administrativo (`useAdminCategories`) y mantener consistencia operativa con el panel.

### 4) Stock completo con motivo
Se extendió el flujo de actualización de stock para enviar `reason` en ajustes manuales:

- campo "Motivo del ajuste" en UI
- propagación de `reason` en reglas y payload
- envío del campo al endpoint de actualización de stock

### 5) Endpoints centralizados
Se agregaron endpoints faltantes en `API_ENDPOINTS`:

- `adminCategories`, `adminCategoryById`
- `me.profile`, `me.addresses`, `me.addressById`

## Observación de alcance
El módulo de pedidos/pagos se mantiene en el proyecto, pero no fue removido ni priorizado en esta task.
