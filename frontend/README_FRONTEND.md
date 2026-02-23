# Order Management System - Frontend React

Frontend moderno y responsivo para la gestión de pedidos, construido con React, TypeScript y Vite.

## Características

- ✅ Autenticación segura con JWT
- ✅ Gestión completa de pedidos (CRUD)
- ✅ Interfaz intuitiva y responsiva
- ✅ Validación de formularios
- ✅ Manejo de errores
- ✅ Estados de carga
- ✅ Context API para estado global

## Requisitos Previos

- Node.js 16+ 
- npm o yarn

## Instalación

### 1. Instalar Dependencias

```bash
cd frontend
npm install
```

### 2. Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto frontend:

```env
VITE_API_URL=https://localhost:5001/api
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/        # Componentes React reutilizables
│   │   ├── ProtectedRoute.tsx
│   │   └── Navbar.tsx
│   ├── contexts/          # Context API para estado global
│   │   └── AuthContext.tsx
│   ├── pages/             # Páginas principales
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Dashboard.tsx
│   ├── services/          # Servicios HTTP
│   │   ├── authService.ts
│   │   └── orderService.ts
│   ├── styles/            # Estilos CSS
│   │   ├── global.css
│   │   ├── auth.css
│   │   ├── navbar.css
│   │   └── dashboard.css
│   ├── types/             # Tipos TypeScript
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Scripts npm

- `npm run dev` - Ejecutar servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Ejecutar linter

## Flujo de Autenticación

1. **Registro**: Usuario crea cuenta con email, usuario y contraseña
2. **Login**: Usuario inicia sesión
3. **Token**: API retorna JWT Bearer Token
4. **Persistencia**: Token se almacena en localStorage
5. **Autorización**: Todas las solicitudes incluyen el token en headers
6. **Rutas Protegidas**: Dashboard requiere autenticación

## Gestión de Pedidos

### Crear Pedido
- Descripción del pedido
- Artículos con producto, cantidad y precio
- Cálculo automático de totales
- Validación de datos

### Ver Pedidos
- Lista de todos los pedidos del usuario
- Información detallada con estado
- Desglose de artículos

### Editar Pedido
- Actualizar descripción
- Cambiar estado del pedido
- Validación de cambios

### Eliminar Pedido
- Confirmación antes de eliminar
- Eliminación segura

## Estados de Pedidos

- **Pendiente** (0): Pedido creado, pendiente de confirmación
- **Confirmado** (1): Pedido confirmado
- **Enviado** (2): Pedido en tránsito
- **Entregado** (3): Pedido entregado exitosamente
- **Cancelado** (4): Pedido cancelado

## Seguridad

- ✅ Contraseñas validadas en cliente y servidor
- ✅ Tokens JWT con expiración
- ✅ Protección de rutas en frontend
- ✅ Interceptores para validación de tokens
- ✅ Validación de formularios
- ✅ Redirección automática si token expira

## Validaciones

### Registro
- Usuario: mín 3 caracteres
- Email: formato válido
- Contraseña: mín 8 caracteres, mayúscula, minúscula, número

### Login
- Usuario: requerido
- Contraseña: requerida

### Pedidos
- Descripción: requerida, máx 500 caracteres
- Artículos: mín 1 requerido
- Producto: requerido, máx 200 caracteres
- Cantidad: > 0
- Precio: > 0

## Desarrollo

### Agregar Nuevo Componente

1. Crear archivo en `src/components/`
2. Exportar como default
3. Usar en rutas o componentes padre

### Agregar Nuevo Servicio

1. Crear en `src/services/`
2. Usar axios con interceptores
3. Exportar como singleton

### Agregar Nuevos Estilos

1. Crear archivo CSS en `src/styles/`
2. Importar en componente o global.css

## Troubleshooting

### CORS Error
- Asegurar que el backend tiene CORS configurado
- Verificar que `VITE_API_URL` es correcto

### Token Expirado
- Se redirige automáticamente a login
- Usuario debe iniciar sesión de nuevo

### Errores de Validación
- Revisar propiedades del DTO en backend
- Asegurar que frontend y backend están sincronizados

## Producción

### Build

```bash
npm run build
```

Genera carpeta `dist/` lista para deploy

### Deploy

Puede ser deployado a:
- Vercel
- Netlify
- GitHub Pages
- Azure Static Web Apps
- AWS S3 + CloudFront

## Contribuyendo

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Create una rama para la feature
3. Commit los cambios
4. Push a la rama
5. Abra un Pull Request

## Licencia

MIT

## Contacto

Para más información, contacte al equipo de desarrollo.
