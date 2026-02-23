# ⚛️ Frontend - Order Management Dashboard

**Aplicación React 18+ con autenticación JWT y gestión de pedidos**

## 📋 Descripción

Frontend desarrollado con React 18, TypeScript, y Vite que proporciona:
- ✅ Interfaz moderna y responsiva
- ✅ Autenticación con JWT Bearer Token
- ✅ Gestión completa de pedidos (CRUD)
- ✅ Context API para state management
- ✅ TypeScript strict mode para type safety
- ✅ Axios interceptors para manejo automático de tokens
- ✅ React Router v6 para navegación
- ✅ Progressive Web App compatible

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ProtectedRoute.tsx
│   │   ├── Navbar.tsx
│   │   ├── OrderForm.tsx
│   │   ├── OrderList.tsx
│   │   └── OrderCard.tsx
│   │
│   ├── pages/               # Páginas de la aplicación
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── services/            # Servicios HTTP
│   │   ├── authService.ts
│   │   ├── orderService.ts
│   │   └── httpClient.ts    # Cliente Axios
│   │
│   ├── contexts/            # Context API
│   │   ├── AuthContext.tsx
│   │   └── useAuth.ts       # Custom hook
│   │
│   ├── types/               # Tipos TypeScript
│   │   ├── auth.ts
│   │   └── order.ts
│   │
│   ├── styles/              # Estilos globales
│   │   └── App.css
│   │
│   ├── App.tsx              # Componente raíz
│   ├── main.tsx             # Entrada de la app
│   └── env.d.ts             # Tipos de Vite
│
├── public/                  # Archivos estáticos
├── vite.config.ts           # Configuración Vite
├── tsconfig.json            # Configuración TypeScript
├── package.json             # Dependencias
└── .env.example             # Variables de entorno
```

---

## 🚀 Requisitos Previos

### Software Requerido
- **Node.js 18+** → [Descargar](https://nodejs.org/)
- **npm 9+** (incluido con Node.js)
- **Git** (opcional)

### Verificar Instalación

```bash
node --version    # Debe retornar: v18.x.x o superior
npm --version     # Debe retornar: 9.x.x o superior
```

---

## 📦 Instalación

### 1. Navegar a la Carpeta Frontend

```bash
cd "tu-ruta-proyecto"
cd frontend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del frontend:

```env
# API Backend
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000

# Aplicación
VITE_APP_NAME=Order Management
```

Para desarrolladores locales, el archivo `.env.development.local` (opcional):

```env
VITE_API_URL=http://localhost:5000
VITE_DEBUG=true
```

---

## ▶️ Ejecutar la Aplicación

### Desarrollo

```bash
npm run dev

# La aplicación estará disponible en:
# http://localhost:5173
```

### Build para Producción

```bash
npm run build

# Generar archivos optimizados en dist/
```

### Preview de Build

```bash
npm run preview

# Vista previa de la versión producción en local
```

### Linting (TypeScript/ESLint)

```bash
npm run lint

# Verificar código
```

---

## 🔐 Autenticación

### Flujo de Autenticación

#### 1. Registro de Usuario

**Componente:** `RegisterPage.tsx`

```typescript
const handleRegister = async (username: string, email: string, password: string) => {
  // Validación de campos
  if (!username || !email || !password) {
    setError('Todos los campos son requeridos');
    return;
  }

  // Llamada al servicio
  const response = await authService.register({ username, email, password });

  if (response.success) {
    // Guardar token y usuario
    localStorage.setItem('token', response.token);
    // Redirigir a dashboard
  }
};
```

#### 2. Iniciar Sesión

**Componente:** `LoginPage.tsx`

```typescript
const handleLogin = async (username: string, password: string) => {
  const response = await authService.login({ username, password });

  if (response.success) {
    // Guardar token en localStorage
    localStorage.setItem('token', response.token);

    // Actualizar contexto
    login(response.user, response.token);

    // Redirigir a dashboard
    navigate('/dashboard');
  }
};
```

#### 3. Protección de Rutas

**Componente:** `ProtectedRoute.tsx`

```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

---

## 📦 Servicios HTTP

### Cliente HTTP (Axios)

**Archivo:** `services/httpClient.ts`

```typescript
import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
});

// Interceptor de solicitud (agregar token)
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de respuesta (manejar errores)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default httpClient;
```

---

## 🎯 Context API y State Management

### AuthContext

**Archivo:** `contexts/AuthContext.tsx`

```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

---

## 🎨 Estilos y Diseño

Sistema de diseño moderno con CSS variables, componentes reutilizables y responsividad mobile-first.

---

## 📱 Características Principales

### 1. Autenticación Segura
- JWT Bearer Token management
- Auto-logout en token expirado
- Protección de rutas

### 2. Gestión de Pedidos
- Crear nuevos pedidos
- Ver lista completa
- Editar estado
- Eliminar pedidos

### 3. Interfaz Responsiva
- Mobile-first design
- Compatible con todos los navegadores modernos

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@vite/client'"

```bash
npm install
npm run dev
```

### Error: "CORS policy"

Verificar que:
- Backend está ejecutando en `http://localhost:5000`
- Valor de `VITE_API_URL` es correcto

---

## 📚 Scripts Disponibles

| Script | Función |
|--------|---------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Build para producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Verificar código |

---

**Versión:** 1.0.0  
**Licencia:** MIT
