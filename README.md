# CocoAromas Frontend

Frontend ecommerce construido con **React + TypeScript + Vite + SCSS Modules** y conectado a API HTTP.

## Stack
- React / React Router
- TanStack Query
- Axios
- React Hook Form + Zod
- SCSS Modules

## Arquitectura (feature-first + clean)
```txt
src/
  app/                 # bootstrap transversal (queryClient)
  router/              # árbol de rutas + guards
  layouts/             # layouts público/admin
  modules/
    <feature>/
      domain/          # entidades y contratos
      application/     # casos de uso + hooks
      infrastructure/  # repositorios/adapters HTTP
      presentation/    # páginas y componentes UI del módulo
  shared/
    api/               # cliente HTTP reusable
    styles/            # tokens, mixins y estilos base
    ui/                # componentes UI reutilizables
    types/             # tipos transversales
```

## Reglas de negocio implementadas
- Compra solo para usuarios autenticados (guard en `/checkout`).
- Roles y permisos por ruta: admin/owner/employee/client.
- Stock editable por admin/owner/employee.
- Estados de pedidos editables por admin/employee.
- Productos sin stock visibles y bloqueados para compra.
- Cálculo de promociones aplicado sobre carrito y checkout.

## Configuración API HTTP
Variables de entorno:
- `VITE_API_URL`: URL base de la API Java REST (default `http://localhost:8080/api/v1`).

## Endpoints esperados (resumen)
- `POST /auth/login`
- `POST /auth/register`
- `GET /catalog/products`
- `GET /catalog/products/:id`
- `GET /orders/me`
- `POST /orders`
- `GET /admin/orders`
- `PATCH /admin/orders/:id/status`
- `GET /admin/products`
- `POST /admin/products`
- `PATCH /admin/products/:id`
- `DELETE /admin/products/:id`
- `GET /promotions`
- `POST /admin/promotions`

## Correr proyecto
```bash
cp .env.example .env
npm install
npm run dev
```

Con la configuración por defecto, el login se ejecuta contra `POST http://localhost:8080/api/v1/auth/login`.
