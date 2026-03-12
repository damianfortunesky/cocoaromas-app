# CocoAromas Frontend

Frontend ecommerce profesional construido con **React + TypeScript + Vite + SCSS Modules**.

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
      infrastructure/  # repositorios, adapters y mock services
      presentation/    # páginas y componentes UI del módulo
  shared/
    api/               # cliente HTTP reusable
    styles/            # tokens, mixins y estilos base
    ui/                # componentes UI reutilizables
    types/             # tipos transversales
  mocks/               # fake backend in-memory
```

## Reglas del negocio implementadas
- Compra solo para usuarios autenticados (guard en `/checkout`).
- Roles y permisos por ruta: admin/owner/employee/client.
- Gestión de roles reservada conceptualmente a admin (listo para backend real).
- Stock editable por admin/owner/employee.
- Estados de pedidos editables por admin/employee.
- Productos sin stock visibles y sombreados.
- Base preparada para promociones desde backend.
- Flujo transferencia bancaria y placeholder de Mercado Pago sin integración final.


## Configuración API HTTP base
- `src/shared/api/httpClient.ts`: instancia Axios reusable con `baseURL`, headers por defecto y manejo centralizado de errores.
- `src/shared/api/httpErrors.ts`: normalización de errores HTTP para que la UI reciba un formato consistente.
- `src/shared/api/apiEndpoints.ts`: catálogo centralizado de rutas para evitar URLs hardcodeadas en componentes.
- `src/modules/products/infrastructure/productsApiRepository.ts`: ejemplo tipado de consumo `GET` y `POST` usando la capa base.

Variables de entorno:
- `VITE_API_URL`: URL base de la API Java REST.
- `VITE_USE_MOCK_API`: `true` para mock local, `false` para repositorios HTTP.

## Integración backend Java (puntos claros)
Actualmente se usan repositorios mock (`src/modules/**/infrastructure/mock*Repository.ts`).
Para conectar API REST:
1. Crear repositorios HTTP por módulo usando `httpClient`.
2. Cambiar wiring en hooks de `application/` para inyectar repositorio HTTP.
3. Mantener contratos de `domain/` para evitar refactor en UI.

## Endpoints esperados (ejemplo)
- `POST /auth/login`
- `POST /auth/refresh` (futuro)
- `GET /catalog/products?search=&category=&sort=&page=`
- `GET /catalog/products/:id`
- `POST /admin/products`
- `PATCH /admin/products/:id`
- `PATCH /admin/products/:id/stock`
- `GET /admin/orders`
- `PATCH /admin/orders/:id/status`
- `GET /promotions`
- `POST /admin/promotions`
- `POST /orders`
- `GET /orders/me`

## Mercado Pago (arquitectura preparada)
- Método de pago modelado: `transfer | mercado_pago`.
- Estado de orden desacoplado de UI.
- Próximo paso: agregar `PaymentGateway` en `modules/orders/domain` y adapter MercadoPago en `infrastructure`.

## Correr proyecto
```bash
npm install
npm run dev
```

Credenciales mock:
- admin@cocoaromas.com / Admin123!
- staff@cocoaromas.com / Staff123!
- client@cocoaromas.com / Client123!
