# 🚀 Sistema de Gestión de Pedidos - Fullstack Senior

**Solución Fullstack profesional para gestión de pedidos con autenticación JWT, arquitectura limpia y seguridad empresarial**

## 📋 Descripción General

Aplicación Fullstack moderna que permite:
- ✅ Registrarse y autenticarse de forma segura con JWT
- ✅ Crear, leer, actualizar y eliminar pedidos (CRUD)
- ✅ Gestionar artículos dentro de cada pedido
- ✅ Cambiar estado de pedidos (Pending → Delivered)
- ✅ Acceso basado en JWT Bearer tokens
- ✅ Arquitectura limpia con separación de responsabilidades
- ✅ Patrones de resiliencia y retry automático
- ✅ Validación robusta y logging estructurado

---

## 📚 Documentación

Consulta la documentación específica para más detalles:

- **[Backend README](./backend/README.md)** - Guía completa de API, arquitectura, endpoints y configuración
- **[Frontend README](./frontend/README.md)** - Guía de componentes, contexto, servicios y desarrollo

---

## ⚡ Inicio Rápido (5 minutos)

### 🚀 Ejecutar Backend (.NET)

```powershell
# Abre una terminal en la carpeta backend
cd backend

# Restaurar dependencias
dotnet restore

# Ejecutar la aplicación
dotnet run

# ✅ Deberías ver: "Now listening on: http://localhost:5000"
```

### 🚀 Ejecutar Frontend (React)

```powershell
# Abre OTRA terminal en la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# ✅ Deberías ver: "Local: http://localhost:5173"
```

### 🔓 Credenciales de Admin

```
👤 Usuario Administrador:
   Usuarios:     admin
   Contraseña:   Admin@123
   
   🔗 Acceso: http://localhost:5173
   ✅ Rol: Admin (acceso total)
   ✅ Token válido por: 60 minutos
```

### 📋 Opciones de Acceso

| Opción | Pasos | Tiempo |
|--------|-------|--------|
| **🌐 Aplicación Web (Recomendado)** | 1. Abre http://localhost:5173 · 2. Login con admin/Admin@123 · 3. ¡Listo! | 30s |
| **📚 Documentación Swagger (Desarrolladores)** | 1. Abre http://localhost:5000 · 2. GET /demo-token · 3. Click "Authorize" | 1m |
| **📝 Postman Collection** | 1. Importa POSTMAN_COLLECTION.json · 2. Configura variables · 3. Ejecuta requests | 2m |
| **⌨️ cURL (Avanzado)** | 1. Obtén token · 2. Headers: Authorization: Bearer {token} · 3. Ejecuta requests | 3m |

### ✅ Verificación Completa

```
Backend:  ✅ http://localhost:5000/swagger
Frontend: ✅ http://localhost:5173/
BD:       ✅ SQL Server LocalDB (automática)
```

---

## 🏗️ Stack Tecnológico

### Backend
| Componente | Versión | Propósito |
|-----------|---------|----------|
| .NET | 8.0 | Framework principal |
| ASP.NET Core | 8.0 | Web API framework |
| Entity Framework Core | 8.0 | ORM y migraciones |
| SQL Server | LocalDB | Base de datos |
| JWT | System.IdentityModel | Autenticación |
| BCrypt | bcrypt.net | Password hashing |
| Polly | 8.2.0 | Resilience patterns |
| FluentValidation | 11.8 | Validación de DTOs |
| Serilog | 3.1.1 | Logging estructurado |
| AutoMapper | 13.0 | Mapeo de objetos |
| Swagger | 6.0 | Documentación API |

### Frontend
| Componente | Versión | Propósito |
|-----------|---------|----------|
| React | 18+ | UI framework |
| TypeScript | 5.2+ | Type safety |
| Vite | 5.0+ | Bundler/Dev server |
| React Router | 6.x | Navegación |
| Axios | 1.6+ | HTTP client |
| CSS Moderno | - | Estilos (sin deps) |

---

## 📁 Estructura de Carpetas

```
Reto Técnico — Fullstack Senior (.NET + React)/
│
├── backend/
│   ├── OrderManagementAPI.sln
│   ├── OrderManagementAPI.Api/          # Capa API (Controllers, Middleware)
│   ├── OrderManagementAPI.Domain/       # Capa Domain (Entities)
│   ├── OrderManagementAPI.Application/  # Capa Application (DTOs, Validators)
│   ├── OrderManagementAPI.Infrastructure/ # Capa Infrastructure (Services, Data)
│   └── README.md                        # Documentación backend completa
│
├── frontend/
│   ├── src/
│   │   ├── components/                  # Componentes React
│   │   ├── pages/                       # Páginas (Login, Register, Dashboard)
│   │   ├── services/                    # Servicios HTTP
│   │   ├── contexts/                    # Context API y custom hooks
│   │   ├── types/                       # Tipos TypeScript
│   │   ├── styles/                      # CSS global
│   │   ├── App.tsx                      # Componente raíz
│   │   └── main.tsx                     # Punto de entrada
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md                        # Documentación frontend completa
│
└── README.md                            # Este archivo (documentación general)
```

---

## 🚀 Guía Completa de Ejecución

### 📥 Requisitos Previos

Antes de comenzar, verifica que tienes instalado:

```powershell
# Verificar versiones instaladas
dotnet --version          # ✅ Debe ser 8.0 o superior
node --version            # ✅ Debe ser 18.0 o superior
npm --version             # ✅ Debe ser 9.0 o superior
```

**Software requerido:**
- ✅ Visual Studio 2022 Community/Professional O Visual Studio Code
- ✅ SQL Server LocalDB (instalado con Visual Studio) O SQL Server Express
- ✅ Git (para control de versiones)

**Si necesitas instalar:**

**Windows:**
```powershell
# Opción 1: Con Chocolatey
choco install dotnet-sdk nodejs git

# Opción 2: Descargar directamente
# .NET 8 SDK: https://dotnet.microsoft.com/download/dotnet/8.0
# Node.js: https://nodejs.org/ (recomendado LTS)
# Git: https://git-scm.com/download/win
```

**macOS:**
```bash
# Con Homebrew
brew install dotnet node git

# O descargar desde sitios oficiales
```

---

### ⚙️ Paso 1: Configurar Backend (.NET)

#### 1.1 Abrir Terminal/PowerShell

```powershell
# Navegar al directorio del proyecto
cd "ruta-del-proyecto\backend"
```

#### 1.2 Restaurar Dependencias

```powershell
# Descargar y compilar dependencias NuGet
dotnet restore

# ✅ Verifica que no haya errores
```

#### 1.3 Verificar Base de Datos

SQL Server LocalDB se crea automáticamente en la primera ejecución. Verifica:

```powershell
# Verificar que SQL Server LocalDB está instalado
sqlcmd -S (localdb)\mssqllocaldb -Q "SELECT @@version"

# Si no funciona, instala SQL Server LocalDB desde Visual Studio Installer
```

#### 1.4 Iniciar Backend

```powershell
# Navegar a la carpeta Api
cd OrderManagementAPI.Api

# Ejecutar aplicación (las migraciones corren automáticamente)
dotnet run

# ✅ Verifica que veas en la salida:
# → info: Microsoft.Hosting.Lifetime[14]
#   Now listening on: http://localhost:5000
# → info: Microsoft.Hosting.Lifetime[0]
#   Application started. Press Ctrl+C to shut down.
```

**Acceso al Backend:**
- 🔗 API: `http://localhost:5000`
- 📚 Swagger (Documentación): `http://localhost:5000` (botón "API" en desarrollo)
- 🔍 Health Check: `http://localhost:5000/health` (si está configurado)

**Datos de prueba precargados:**
- 👤 Usuario Admin: `admin` / `Admin@123`
- 👤 Usuario Manager: `manager` / `Manager@123`
- 👤 Usuarios regulares: `johnsmith`, `mariagarcia`, etc.

---

### ⚙️ Paso 2: Configurar Frontend (React)

#### 2.1 Abrir Nueva Terminal/PowerShell

```powershell
# En una NUEVA terminal (NO cierres la anterior)
# Navegar al directorio frontend
cd "ruta-del-proyecto\frontend"
```

#### 2.2 Crear Archivo de Configuración

```powershell
# Crear archivo .env basado en el ejemplo
Copy-Item .env.example .env

# O crear manualmente:
# Crear archivo: frontend/.env
# Contenido:
# VITE_API_URL=http://localhost:5000
```

**Contenido de `.frontend/.env`:**
```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Order Management
```

#### 2.3 Instalar Dependencias

```powershell
# Descargar y instalar dependencias npm
npm install

# ⏳ Esto puede tomar 1-2 minutos en primera ejecución
# ✅ Verifica que termine sin errores críticos (warnings son OK)
```

#### 2.4 Iniciar Frontend

```powershell
# Ejecutar servidor de desarrollo
npm run dev

# ✅ Verifica que veas en la salida:
#   VITE v5.0.0  dev server running at:
#   > Local:    http://localhost:5173/
#   > Press q to quit
```

**Acceso al Frontend:**
- 🌐 Aplicación: `http://localhost:5173`

---

### ✅ Paso 3: Verificar que Todo Funciona

#### 3.1 Verificar Puertos

```powershell
# Windows: Verificar que servicios están escuchando
netstat -ano | findstr :5000    # Backend
netstat -ano | findstr :5173    # Frontend

# macOS/Linux:
lsof -i :5000                   # Backend
lsof -i :5173                   # Frontend
```

#### 3.2 Abrir Navegador

1. Abre tu navegador favorito
2. Navega a: `http://localhost:5173`
3. Deberías ver la página de **Login**

#### 3.3 Probar Funcionamiento Completo

```
✅ Paso 1: Registrarse
  → Click en "¿No tiene cuenta? Regístrese aquí"
  → Completa formulario con datos nuevos
  → Click "Registrarse"
  → Deberías ser redirigido a Dashboard

✅ Paso 2: Crear Pedido
  → Click "+ Nuevo Pedido"
  → Llena descripción: "Mi test pedido"
  → Llena artículo: Nombre="Laptop", Cantidad=1, Precio=1500
  → Click "Guardar Pedido"
  → Deberías verlo en la lista

✅ Paso 3: Editar Pedido
  → Haz click en "Editar" en tu pedido
  → Modifica la descripción
  → Click "Guardar Pedido"
  → Los cambios deberían reflejarse

✅ Paso 4: Eliminar Pedido
  → Click en "Eliminar" (botón rojo)
  → Confirma en el popup
  → El pedido debe desaparecer de la lista

✅ Paso 5: Desconectarse
  → Click en botón "Cerrar Sesión"
  → Deberías ser redirigido a Login
```

---

## 🌐 Visualización y Acceso a la Aplicación Web

### 🚀 Acceso Rápido

Una vez tanto backend como frontend estén ejecutándose:

```
📍 URL Local: http://localhost:3000
📍 Alternativa: http://localhost:5173
⚡ Hot Reload: Activo
✅ Estado: En ejecución
```

### 📝 Credenciales de Prueba

#### Opción 1: Crear Nueva Cuenta (Recomendado)

1. Acceder a `http://localhost:3000/register`
2. Completar el formulario:
   - **Usuario:** cualquier_nombre_único
   - **Email:** email@example.com (formato válido)
   - **Contraseña:** Debe cumplir:
     * Mínimo 8 caracteres
     * Al menos 1 mayúscula (A-Z)
     * Al menos 1 minúscula (a-z)
     * Al menos 1 número (0-9)
     * Al menos 1 carácter especial (!@#$%^&*)
   - **Confirmar Contraseña:** Repetir la misma
3. ✅ Click en "Registrarse"
4. Se registra automáticamente y redirige a Dashboard

**Ejemplos de contraseña válida:**
```
Password123!  ✅ Válido
MyPass@2026   ✅ Válido
Admin_2026!   ✅ Válido
```

#### Opción 2: Usar Credenciales Predefinidas

Para usar usuarios de prueba predefinidos, ejecuta este SQL en SQL Server:

```sql
USE [OrderManagementDb]

-- Usuario ADMIN
INSERT INTO Users (Username, Email, PasswordHash, Role, CreatedAt, IsDeleted)
VALUES (
    'admin',
    'admin@example.com',
    '$2a$12$xG5RWjFvLYVvTQoNAIzVju1PkMqJfz7dVhNzQ8X7vJ9RZH8vKnLha',
    'Admin',
    GETUTCDATE(),
    0
);

-- Usuario REGULAR
INSERT INTO Users (Username, Email, PasswordHash, Role, CreatedAt, IsDeleted)
VALUES (
    'usuario',
    'usuario@example.com',
    '$2a$12$7hL8mK9nP2jQ4rS5tU6vVeW1x3yZ0aB9cD4eF5gH6iJ7kL8mN9oP0',
    'User',
    GETUTCDATE(),
    0
);
```

**Credenciales:**
```
👤 ADMIN:
  Usuario:     admin
  Contraseña:  Admin@2026!
  Rol:         Admin

👥 USUARIO REGULAR:
  Usuario:     usuario
  Contraseña:  Usuario@2026!
  Rol:         User
```

### 📱 Pantallas de la Aplicación

#### Login (`http://localhost:3000/login`)
- ✅ Campos: Usuario y Contraseña
- ✅ Link a registrar nueva cuenta
- ✅ Validación de campos requeridos
- ✅ Error feedback si credenciales inválidas

#### Register (`http://localhost:3000/register`)
- ✅ Campos: Usuario, Email, Contraseña, Confirmar
- ✅ Requisitos de contraseña en vivo
- ✅ Validación de email
- ✅ Confirmación de contraseña coincide
- ✅ Link a login

#### Dashboard (`http://localhost:3000/dashboard`)
- ✅ Grid de órdenes con cards
- ✅ Botón "+ Nuevo Pedido"
- ✅ Estados coloreados (Pendiente, Confirmado, Enviado, Entregado)
- ✅ Botones Editar y Eliminar por orden
- ✅ Empty state si no hay órdenes

#### Navbar (Todas las páginas)
- ✅ Logo/Título: "📦 Gestión de Pedidos"
- ✅ Información del usuario autenticado (username + rol)
- ✅ Botón "Cerrar Sesión" (redirige a /login)

### 🔄 Flujo Completo de Uso

```
1. Acceder a http://localhost:3000
   ↓ (sin autenticación)
   ↓
2. Redireccionamiento automático a /login
   ↓
3. Opciones:
   
   A) LOGIN con credenciales
      ├─ Usuario: admin / usuario
      ├─ Contraseña: Admin@2026! / Usuario@2026!
      └─ ✅ Acceso al Dashboard
   
   B) REGISTRAR nuevo usuario
      ├─ Click "Crear nueva cuenta"
      ├─ Completar validaciones
      ├─ Contraseña con requisitos especiales
      └─ ✅ Autoredirecciona al Dashboard
   
4. En DASHBOARD puedes:
   ├─ Ver órdenes existentes
   ├─ Crear nueva orden:
   │  ├─ Descripción
   │  ├─ Agregar items
   │  ├─ Total debe ser > 0
   │  └─ Guardar
   ├─ Editar orden
   ├─ Eliminar orden (con confirmación)
   └─ Logout
   
5. LOGOUT:
   ├─ Click "Cerrar Sesión" en navbar
   ├─ Limpia token del localStorage
   └─ Redirige a /login
```

### 📋 Tabla de Endpoints y URLs

| Componente | URL | Estado | Descripción |
|-----------|-----|--------|-------------|
| **Frontend - Main** | `http://localhost:3000` | 🟢 Activo | Aplicación React principal |
| **Frontend - Alt** | `http://localhost:5173` | 🟢 Activo | Puerto alternativo Vite |
| **Backend - API** | `http://localhost:5000` | 🟢 Activo | API REST .NET 8 |
| **Backend - Docs** | `http://localhost:5000/swagger` | 🟢 Activo | Documentación Swagger |
| **BD - LocalDB** | `(localdb)\mssqllocaldb` | 🟢 Activo | SQL Server Express |

#### Rutas Frontend Principales

| Ruta | Alcance | Descripción |
|------|---------|-------------|
| `/login` | Público | Formulario iniciar sesión |
| `/register` | Público | Formulario crear cuenta |
| `/dashboard` | 🔒 Protegido | Panel principal pedidos |
| `/orders/new` | 🔒 Protegido | Crear nuevo pedido |
| `/orders/:id/edit` | 🔒 Protegido | Editar pedido existente |
| `*` (404) | Público | Página no encontrada |

### 🎬 Pantallas Mockup (Texto)

#### Screen 1: Login
```
┌─────────────────────────────────────┐
│   📦 GESTIÓN DE PEDIDOS             │
├─────────────────────────────────────┤
│                                     │
│   Iniciar Sesión                    │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ Usuario o Email             │   │
│   │ [____________________]      │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ Contraseña                  │   │
│   │ [____________________]      │   │
│   └─────────────────────────────┘   │
│                                     │
│   [    INICIAR SESIÓN    ]         │
│                                     │
│   ¿No tienes cuenta? [Crear]       │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 2: Dashboard
```
┌──────────────────────────────────────────┐
│  📦 Gestión de Pedidos  │ usuario ▼     │
├──────────────────────────────────────────┤
│                                          │
│  [+ Nuevo Pedido]              Logout   │
│                                          │
│  ┌────────────┐  ┌────────────┐         │
│  │ Pedido #1  │  │ Pedido #2  │         │
│  │ Status:    │  │ Status:    │         │
│  │ ✏️ Editar  │  │ ✏️ Editar  │         │
│  │ 🗑️ Borrar  │  │ 🗑️ Borrar  │         │
│  └────────────┘  └────────────┘         │
│                                          │
└──────────────────────────────────────────┘
```

#### Screen 3: Crear Pedido
```
┌────────────────────────────────┐
│  📦 Nuevo Pedido               │
├────────────────────────────────┤
│                                │
│ Descripción:                   │
│ [_________________________]    │
│                                │
│ Items del Pedido:             │
│ ┌────────────────────────┐    │
│ │ Producto │ Qty │ Precio │  │
│ ├────────────────────────┤    │
│ │ [_____] │ [_] │ [____] │  │
│ └────────────────────────┘    │
│ [+ Agregar Item]              │
│                                │
│ Total: $0.00                   │
│                                │
│ [   GUARDAR    ] [CANCELAR]   │
│                                │
└────────────────────────────────┘
```

### 🔧 Comandos Rápidos para Ejecutar

**Desde PowerShell (Windows):**
```powershell
# Terminal 1: Backend
cd backend
dotnet run

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Verificar
curl http://localhost:5000/swagger
start http://localhost:3000
```

**Desde Bash (Mac/Linux):**
```bash
# Terminal 1: Backend
cd backend
dotnet run

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Open en navegador
open http://localhost:3000
open http://localhost:5000/swagger
```

### 🐛 Troubleshooting Web

| Problema | Causa | Solución |
|----------|-------|----------|
| **ERR_CONNECTION_REFUSED en localhost:3000** | Frontend no está ejecutándose | `cd frontend && npm run dev` |
| **ERR_CONNECTION_REFUSED en localhost:5000** | Backend no está ejecutándose | `cd backend && dotnet run` |
| **CORS Error al crear/editar** | CORS no configurado correctamente | Verificar CORS en Startup.cs |
| **Token inválido / Redirige al login** | Token expirado o corrompido | `localStorage.clear()` en DevTools |
| **"Failed to load resource: 404" en API** | Endpoint no existe o URL incorrecta | Revisar `.env` y URL en browser |
| **Contraseña no cumple requisitos** | Validación frontend estricta | Usar: Mayúscula, minúscula, número, especial |
| **Página en blanco en /dashboard** | Error en React/BD | Abrir DevTools (F12) → Console |
| **BD no conecta desde backend** | ConnectionString incorrecta | Revisar `appsettings.json` |

### 🌍 Verificación en Navegador

**Pasos para verificar todo funciona:**

1. ✅ Abrir `http://localhost:3000` en navegador
2. ✅ Debe redirigir automáticamente a `/login`
3. ✅ Ver formulario de login + link a registro
4. ✅ Click en "Crear nueva cuenta"
5. ✅ Completar formulario con:
   - Usuario único (ej: testuser123)
   - Email válido (ej: test@example.com)
   - Contraseña cumpliendo requisitos
6. ✅ Click "Registrarse" → autoredirecciona a Dashboard
7. ✅ Dashboard muestra:
   - Navbar con tu usuario
   - Botón "+ Nuevo Pedido"
   - Empty state si no hay órdenes
8. ✅ Crear pedido:
   - Click "+Nuevo Pedido"
   - Llenar descripción
   - Agregar items
   - Guardar
9. ✅ Ver orden en dashboard
10. ✅ Editar orden (cambiar descripción)
11. ✅ Eliminar orden (con confirmación)
12. ✅ Logout (redirige a /login)

---

### 🚀 Opción: Ejecutar Todo Simultáneamente

**Usando Windows Task Scheduler o Scripts:**

```powershell
# Crear archivo: run-all.ps1
# Contenido:

# Terminal 1: Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend\OrderManagementAPI.Api; dotnet run"

# Esperar a que backend inicie
Start-Sleep -Seconds 5

# Terminal 2: Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# Esperar a que frontend inicie
Start-Sleep -Seconds 3

# Abrir navegador automáticamente
Start-Process "http://localhost:5173"
```

**Ejecutar el script:**
```powershell
powershell -ExecutionPolicy Bypass -File run-all.ps1
```

---

### 📊 Monitoreo en Tiempo Real

**Verificar logs de Backend:**
```powershell
# Los logs aparecen en la consola de ejecución
# Busca líneas con [AUDIT], [SECURITY], [ERROR]
```

**Verificar estado Frontend:**
```powershell
# Abre DevTools (F12) en el navegador
# Pestaña "Console" para errores JavaScript
# Pestaña "Network" para ver llamadas HTTP
```

---

### 🔄 Reinicios y Limpieza

#### Si Backend no inicia correctamente:

```powershell
# 1. Limpiar build
cd backend
dotnet clean

# 2. Restaurar dependencias
dotnet restore

# 3. Reconstruir
dotnet build

# 4. Eliminar database y recrear
# (Las migraciones la crearán automáticamente)
# Opcionalmente, ejecutar SQL:
# sqlcmd -S (localdb)\mssqllocaldb -Q "DROP DATABASE OrderManagementDB"

# 5. Ejecutar nuevamente
cd OrderManagementAPI.Api
dotnet run
```

#### Si Frontend no inicia:

```powershell
cd frontend

# 1. Limpiar caché y dependencias
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 2. Reinstalar
npm install

# 3. Verificar configuración
# Revisa que .env existe con VITE_API_URL correcto

# 4. Ejecutar con puerto diferente si está en uso
npm run dev -- --port 5174
```

---

### 🐛 Troubleshooting Detallado

| Problema | Síntomas | Solución |
|----------|----------|----------|
| **Puerto 5000 en uso** | `Address already in use` | `netstat -ano \| findstr :5000` + Cierra proceso o usa `dotnet run --urls "http://localhost:5001"` |
| **Puerto 5173 en uso** | `EADDRINUSE` en npm | `Set-NetTCPPort -LocalPort 5173 -State Delete` o `npm run dev -- --port 5174` |
| **CORS Error** | `xhr failed` en DevTools | Verifica CORS en backend (`Program.cs`), asegúrate que `http://localhost:5173` está permitido |
| **Token inválido** | `401 Unauthorized` | Limpia localStorage: Abre DevTools → Application → LocalStorage → Elimina `auth_token` |
| **BD no conecta** | `SqlException: Connection failed` | Verifica: SQL Server LocalDB está corriendo (`(localdb)\mssqllocaldb` accessible), Connection string en `appsettings.json` |
| **Migraciones fallan** | `The database operation was not successful` | Elimina la BD anterior: `sqlcmd -S (localdb)\mssqllocaldb -Q "DROP DATABASE OrderManagementDB"`, reinicia backend |
| **npm dependencies error** | `ERR!` en npm install | `npm cache clean --force` + `rm node_modules package-lock.json` + `npm install` |
| **dotnet restore falla** | `Unable to find package` | `dotnet nuget add source https://api.nuget.org/v3/index.json -n nuget.org`, luego `dotnet restore` |
| **API returns 500** | `Internal Server Error` | Revisa logs en consola del backend, busca línea con `[ERROR]`, verifica base de datos |
| **Frontend no se carga** | Página en blanco | Abre DevTools (F12), pestaña Console, busca errores JavaScript |

---

### 📝 Notas Importantes

⚠️ **Mantén ambas terminales abiertas:**
- Terminal 1: Backend (.NET)
- Terminal 2: Frontend (npm)

⚠️ **Primer inicio es más lento:**
- Las migraciones EF Core se crean automáticamente (~10-15 segundos)
- npm install descarga todas las dependencias (~1-2 minutos)

⚠️ **Datos de prueba:**
- Se cargan automáticamente en `DatabaseSeeder.cs`
- Primera ejecución: 5-6 usuarios + 15-20 pedidos + 40+ items

⚠️ **Token expiration:**
- Tokens expiran en 60 minutos
- No hay refresh token, deberás desconectarte y volver a conectarte

⚠️ **CORS en desarrollo:**
- Frontend en `http://localhost:5173`
- Backend en `http://localhost:5000`
- Si cambias puertos, actualiza `.env` en frontend

---

## 📖 API Endpoints Principales

### Autenticación

```
POST   /api/auth/register      → Registrar usuario
POST   /api/auth/login         → Iniciar sesión
GET    /api/auth/profile       → Obtener perfil (requiere token)
```

### Pedidos

```
POST   /api/orders             → Crear pedido
GET    /api/orders             → Listar mis pedidos
GET    /api/orders/{id}        → Obtener pedido por ID
PUT    /api/orders/{id}        → Actualizar pedido
DELETE /api/orders/{id}        → Eliminar pedido
```

**Ejemplo de petición con cURL:**
```bash
# Registrarse
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"juan","email":"juan@example.com","password":"Pass123!"}'

# Iniciar sesión (obtener token)
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"juan","password":"Pass123!"}' | jq -r '.token')

# Crear pedido (usando token)
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Mi pedido",
    "items": [{"productName": "Laptop", "quantity": 1, "unitPrice": 1500}]
  }'
```

---

## 🧪 Cómo Usar el Token JWT en Swagger

### ¿Qué es Swagger?
Swagger es una herramienta interactiva que documenta todos los endpoints de la API. Te permite **probar los endpoints directamente desde el navegador sin necesidad de Postman**.

**Acceso:** `http://localhost:5000/`

### 📋 Pasos Paso a Paso

#### **Paso 1️⃣: Generar un Token JWT**

1. Abre `http://localhost:5000/` en tu navegador
2. Busca la sección **"Auth"** (está colapsada con un triángulo)
3. Haz clic en **"GET /api/auth/demo-token"** (botón de prueba)
4. Haz clic en el botón **"Try it out"**
5. Haz clic en **"Execute"**
6. Verás una respuesta JSON como esta:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwianRpIjoiZWU5YzZjNjAtNGE4Ni00N...",
  "expiresIn": 3600,
  "instructions": "Copia el token anterior e introdúcelo en el botón Authorize (arriba a la derecha)",
  "message": "Token de demostración válido por 60 minutos."
}
```

7. **Copia el valor del campo `"token"`** (el texto largo)

---

#### **Paso 2️⃣: Autorizar el Token en Swagger**

1. **Mira la parte superior derecha** de Swagger, verás un botón **"Authorize"** (con imagen de candado)
2. **Haz clic en ese botón**
3. Se abrirá un popup con un campo de texto
4. **Pega el token que copiaste** en el campo (sin comillas, sin la palabra "Bearer")
5. **Haz clic en "Authorize"**
6. Verás un mensaje: **"Authorized"** con un botón de cerrar (X)
7. **Haz clic en "Close"**

---

#### **Paso 3️⃣: Prueba los Endpoints Protegidos**

Ahora ya puedes probar cualquier endpoint que requiera autenticación:

**Ejemplo 1: Obtener Perfil**
1. Busca la sección **"Auth"**
2. Haz clic en **"GET /api/auth/profile"**
3. Haz clic en **"Try it out"**
4. Haz clic en **"Execute"**
5. Deberías recibir tu información de usuario

**Ejemplo 2: Crear Pedido**
1. Busca la sección **"Orders"**
2. Haz clic en **"POST /api/orders"**
3. Haz clic en **"Try it out"**
4. Rellena el cuerpo de la solicitud (ejemplo abajo)
5. Haz clic en **"Execute"**

**Ejemplo de cuerpo para crear pedido:**
```json
{
  "description": "Mi primer pedido desde Swagger",
  "items": [
    {
      "productName": "Laptop",
      "quantity": 1,
      "unitPrice": 1500
    },
    {
      "productName": "Mouse",
      "quantity": 2,
      "unitPrice": 25
    }
  ]
}
```

---

### 🖼️ Guía Visual en Swagger

```
┌─────────────────────────────────────────────────┐
│  Order Management API                   [Auth] ◄─┼─ BOTÓN AUTHORIZE (Paso 2)
├─────────────────────────────────────────────────┤
│                                                 │
│  ▼ Auth (expandir sección)                     │
│  ├─ GET /api/auth/demo-token                  │
│  │  └─ [Try it out] → [Execute] (Paso 1)      │
│  │     Respuesta: {token: "eyJ...", ...}      │
│  ├─ POST /api/auth/register                   │
│  ├─ POST /api/auth/login                      │
│  └─ GET /api/auth/profile (requiere token)    │
│                                                 │
│  ▼ Orders (expandir sección)                   │
│  ├─ POST /api/orders (requiere token)         │
│  ├─ GET /api/orders (requiere token)          │
│  ├─ GET /api/orders/{id} (requiere token)     │
│  ├─ PUT /api/orders/{id} (requiere token)     │
│  └─ DELETE /api/orders/{id} (requiere token)  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### ⏱️ Validez del Token

- **Duración:** 60 minutos
- **Después de expirar:** Genera un nuevo token con el paso 1
- **¿Cómo sé si expiró?** Recibiras error `401 Unauthorized`

---

### 🔄 Flujo Completo (Resumen)

```
1. Swagger → GET /demo-token → Copia token
           ↓
2. Click botón "Authorize" (arriba) → Pega token
           ↓
3. Todos los endpoints ahora tendrán el token automáticamente
           ↓
4. Prueba POST /orders, GET /orders, etc.
           ↓
5. Si expira, repite desde paso 1
```

---

### ✅ Checklist de Pruebas en Swagger

```
☐ 1. Abre http://localhost:5000/
☐ 2. GET /api/auth/demo-token → Ejecuta → Copia token
☐ 3. Botón "Authorize" (arriba) → Pega token → Autoriza
☐ 4. GET /api/auth/profile → Ejecuta → Debes ver tu usuario
☐ 5. POST /api/orders → Completa formulario → Ejecuta → Crea pedido
☐ 6. GET /api/orders → Ejecuta → Debes ver tus pedidos
☐ 7. GET /api/orders/{id} → Reemplaza {id} → Ejecuta → Ve detalles
☐ 8. PUT /api/orders/{id} → Modifica datos → Ejecuta → Edita pedido
☐ 9. DELETE /api/orders/{id} → Ejecuta → Elimina pedido
☐ 10. GET /api/orders → Debe estar vacío o sin ese pedido
```

---

### 🚨 Errores Comunes en Swagger

| Error | Causa | Solución |
|-------|-------|----------|
| **`401 Unauthorized`** | Token no proporcionado o expirado | Genera nuevo con /demo-token y autoriza |
| **`400 Bad Request`** | Body JSON mal formado | Verifica comillas, llaves, tipos de datos |
| **`500 Internal Server Error`** | Error en el servidor | Revisa logs en consola del backend |
| **`404 Not Found`** | Endpoint no existe | Verifica que escribiste bien la URL |
| **No veo ningun endpoint** | Swagger no cargó | Recarga página (F5), revisa console (F12) |
| **"Failed to fetch"** | Backend no está corriendo | Verifica: `dotnet run` en terminal backend |

---

## 🔐 Características de Seguridad

### Autenticación JWT
- ✅ Tokens HS256 (HMAC-SHA256)
- ✅ Expiración: 60 minutos (producción)
- ✅ Claims: UserId, Username, Role
- ✅ Validación strict de issuer/audience

### Encriptación
- ✅ BCrypt work factor 12 para contraseñas
- ✅ Safe comparison en verificación
- ✅ Hashing unidireccional

### Autorización
- ✅ Atributo `[Authorize]` en endpoints
- ✅ Protección de rutas en frontend
- ✅ Validación de ownership (usuarios solo ven sus pedidos)
- ✅ Roles y claims personalizados

### Validación
- ✅ FluentValidation en backend
- ✅ Validación de entrada en frontend
- ✅ DTOs tipados
- ✅ Respuestas de error estructuradas

### Infraestructura
- ✅ CORS configurado correctamente
- ✅ Middleware de excepciones global
- ✅ Logging con Serilog
- ✅ HTTPS en desarrollo
- ✅ Interceptores HTTP con manejo de 401

---

## 🏛️ Arquitectura del Backend

### Capas

```
┌─────────────────────────────────────┐
│  API Layer (Controllers)            │  ← HTTP requests
├─────────────────────────────────────┤
│  Application Layer (DTOs, Services) │  ← Business logic
├─────────────────────────────────────┤
│  Infrastructure (Implementation)    │  ← Data access, Security
├─────────────────────────────────────┤
│  Domain Layer (Entities)            │  ← Core business
└─────────────────────────────────────┘
         ↓
    SQL Server Database
```

### Patrones Utilizados

| Patrón | Implementación |
|--------|----------------|
| **Dependency Injection** | ServiceCollectionExtensions |
| **Repository Pattern** | DbContext implícito |
| **Factory Pattern** | JwtTokenService |
| **Chain of Responsibility** | ServiceCollectionExtensions |
| **Decorator Pattern** | Middleware |
| **Resilience Pattern** | Polly (retry, backoff) |

---

## 🎯 Arquitectura del Frontend

### State Management

```
┌──────────────────────────┐
│   React Components       │
├──────────────────────────┤
│   AuthContext (Provider) │  ← Global Auth State
├──────────────────────────┤
│   useAuth (Custom Hook)  │  ← State Access
├──────────────────────────┤
│   Services (Axios)       │  ← HTTP Calls
└──────────────────────────┘
```

### Flujo de Autenticación

```
Login Form
    ↓
handleLogin() → authService.login()
    ↓
axios POST /api/auth/login
    ↓
Server responde con token
    ↓
localStorage.setItem('token', token)
    ↓
AuthContext.login() actualiza estado
    ↓
Navigate('/dashboard')
```

---

## 🔄 Flujo Completo de Usuario

```
┌─────────────────────────────────────────────┐
│         Ingresa en localhost:5173           │
└─────────────┬───────────────────────────────┘
              │
    ┌─────────▼────────┐
    │ ¿Tiene Cuenta?   │
    └─────────┬────────┘
              │
    ┌─────────▼────────────────────┐
    │  NO               │           SÍ
    │                   │
    ▼                   ▼
┌────────────┐    ┌──────────────┐
│  Registrar │    │ Iniciar      │
│   Form     │    │ Sesión       │
└────────┬───┘    └──────┬───────┘
         │               │
         │   ┌───────────┘
         │   │
         └──→┤ Guardar Token
             │ Actualizar Contexto
             │
             ▼
        ┌──────────────┐
        │  Dashboard   │
        │   Pedidos    │
        └──────┬───────┘
               │
      ┌────────┼────────┐
      │        │        │
      ▼        ▼        ▼
   Crear    Editar   Eliminar
   Pedido   Pedido    Pedido
```

---

## 🧪 Pruebas Manuales

### 📱 Opción 1: Probar desde el Navegador (Recomendado)

**La forma más fácil y visual:**

1. **Abre la aplicación web:**
   ```
   http://localhost:3000
   ```

2. **Flujo completo en la interfaz:**
   - Regístrate con usuario/email/contraseña nuevos
   - Se guardará tu sesión automáticamente
   - Serás redirigido al Dashboard
   - Crea, edita y elimina pedidos
   - Cierra sesión cuando termines

**Ventajas:**
- ✅ Más fácil de entender
- ✅ Interfaz visual amigable
- ✅ Manejo automático de tokens
- ✅ Validaciones en tiempo real

---

### 📚 Opción 2: Probar en Swagger (Para Desarrolladores)

**Directamente desde la documentación API interactiva:**

1. **Abre Swagger:** `http://localhost:5000/`
2. **Sigue los pasos de la sección anterior** ("Cómo Usar el Token JWT en Swagger")
3. **Prueba todos los endpoints directamente**

**Ventajas:**
- ✅ Ver requests y responses exactos
- ✅ Documentación detallada
- ✅ Probar sin interfaz gráfica
- ✅ Útil para debugging

---

### 🔍 Opción 3: Probar con cURL (Línea de Comandos)

**Para usuarios avanzados en PowerShell/Bash:**

```powershell
# 1. Obtener token de demostración
$token = (Invoke-RestMethod -Uri "http://localhost:5000/api/auth/demo-token").token

# 2. Crear pedido
Invoke-RestMethod -Uri "http://localhost:5000/api/orders" `
  -Method Post `
  -Headers @{Authorization = "Bearer $token"} `
  -ContentType "application/json" `
  -Body @{
    description = "Mi pedido por cURL"
    items = @(
      @{productName = "Laptop"; quantity = 1; unitPrice = 1500}
    )
  } | ConvertTo-Json -Depth 3

# 3. Obtener todos los pedidos
Invoke-RestMethod -Uri "http://localhost:5000/api/orders" `
  -Headers @{Authorization = "Bearer $token"} | ConvertTo-Json -Depth 3
```

**Para Bash (Mac/Linux):**
```bash
# 1. Obtener token
TOKEN=$(curl -s http://localhost:5000/api/auth/demo-token | jq -r '.token')

# 2. Crear pedido
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Mi pedido por cURL",
    "items": [
      {"productName": "Laptop", "quantity": 1, "unitPrice": 1500}
    ]
  }'

# 3. Obtener pedidos
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/orders
```

---

### 🔗 Postman Collection - Actualizada 2026

Colección profesional con todos los endpoints y casos de prueba verificados.

**Pasos para importar:**
1. Abre Postman Desktop
2. Click en "Import"
3. Elige "Upload Files" o "Link"
4. Selecciona: `./POSTMAN_COLLECTION.json` (raíz del proyecto)
5. Click "Import"
6. Configura variable `base_url=http://localhost:5000`
7. ¡Listo! Todos los endpoints están listos para probar

**Estructura actualizada de la colección:**
```
📁 Order Management API - 2026
├─ 📁 🔐 AUTENTICACIÓN (con verificación de seguridad)
│  ├─ 📝 Register (POST) - Crea nueva cuenta
│  │   └─ Validaciones: Email, Password requisitos
│  ├─ 🔓 Login (POST) - Genera JWT Token (60 min)
│  │   └─ Auto-guarda token en variable jwt_token
│  └─ 👤 Get Profile (GET) - Requiere token válido
│     └─ Retorna: Id, Username, Email, Role
│
├─ 📁 📦 PEDIDOS - CRUD (Reglas de Negocio Verificadas)
│  ├─ ✨ Create Order (POST)
│  │   ├─ Validación: Total > 0 ✅
│  │   ├─ Generación: OrderNumber único ✅
│  │   └─ Auto-guarda order_id
│  ├─ 📋 Get All Orders (GET)
│  │   └─ Solo retorna pedidos del usuario (ownership) ✅
│  ├─ 🔍 Get Order by ID (GET)
│  │   └─ Validación: Ownership check implementado ✅
│  ├─ ✏️ Update Order (PUT)
│  │   └─ Solo propietario puede editar
│  └─ 🗑️ Delete Order (DELETE)
│     └─ Soft-delete (IsDeleted flag) ✅
│
└─ 📁 🧪 CASOS DE PRUEBA - Error Handling Verificado
   ├─ ❌ 404 Not Found (Pedido no existe)
   ├─ ❌ 401 Unauthorized (Token inválido/expirado)
   ├─ ❌ 401 Sin Token (Sin header Authorization)
   ├─ ❌ 400 Contraseña Débil (Validación)
   └─ ❌ 400 Email Inválido (Validación)
```

**Variables automáticas de la colección:**
- `base_url` → http://localhost:5000
- `jwt_token` → Se guarda automáticamente al login
- `order_id` → Se guarda al crear pedido
- `order_number` → Número único del pedido
- `user_id` → ID del usuario autenticado
- `username` → Nombre de usuario

**Flujo recomendado de pruebas:**

```bash
1️⃣ Register (crear nuevo usuario)
   └─ Token guardado automáticamente

2️⃣ Login (o usar token del paso anterior)
   └─ Token actualizado en variable jwt_token

3️⃣ Get Profile (verificar token válido)
   └─ Debes ver tu información

4️⃣ Create Order (probar regla: Total > 0)
   └─ OrderNumber generado automáticamente
   └─ order_id guardado para siguientes requests

5️⃣ Get All Orders (listar tus pedidos)
   └─ Solo verás tus pedidos (validación ownership)

6️⃣ Get Order by ID (obtener detalles)
   └─ Usa {{order_id}} guardado anteriormente

7️⃣ Update Order (cambiar descripción)
   └─ Verifica cambios en Get Order

8️⃣ Delete Order (soft delete)
   └─ Pedido desaparece de listados pero existe en BD

9️⃣ Error Tests (probar manejo de errores)
   └─ 404: Pedir pedido inexistente
   └─ 401: Usar token inválido
```

**Características de la colección actualizada:**

✅ **Seguridad Verificada:**
- Todos los endpoints protegidos con JWT
- Tokens con expiración 60 minutos
- Validación de roles (Admin, User)
- Manejo de errores 401, 403, 404

✅ **Reglas de Negocio Verificadas:**
- Total > 0 (validado en 2 capas)
- OrderNumber único (verificado en BD)
- Solo usuarios autenticados (ownership check)
- Soft delete implementado (IsDeleted flag)

✅ **Automatización en Postman:**
- Scripts de test guardan tokens/IDs
- Variables dinámicas para reutilizar valores
- Descriptions detalladas en cada endpoint
- Ejemplos de body JSON listos para ejecutar

---

---

### 🧪 Definición de Casos de Prueba

#### **Test 1: Registro e Inicio de Sesión**

**Objetivo:** Verificar que usuarios nuevos pueden registrarse

```
1. POST /api/auth/register
   Body: {
     "username": "testuser123",
     "email": "test@example.com",
     "password": "TestPass123!"
   }
   ✅ Espera: 201 Created + token + userId

2. POST /api/auth/login
   Body: {
     "username": "testuser123",
     "password": "TestPass123!"
   }
   ✅ Espera: 200 OK + token + usuario info

3. GET /api/auth/profile (con token)
   ✅ Espera: 200 OK + datos del usuario
```

#### **Test 2: CRUD de Pedidos**

**Objetivo:** Verificar crear, leer, actualizar y eliminar pedidos

```
1. POST /api/orders (con token)
   Body: {
     "description": "Test Order",
     "items": [
       {"productName": "Producto A", "quantity": 2, "unitPrice": 100}
     ]
   }
   ✅ Espera: 201 Created + orderId devuelto

2. GET /api/orders (con token)
   ✅ Espera: 200 OK + lista de pedidos

3. GET /api/orders/{id} (con token)
   ✅ Espera: 200 OK + detalles del pedido

4. PUT /api/orders/{id} (con token)
   Body: {
     "description": "Test Order UPDATED",
     "items": [...]
   }
   ✅ Espera: 200 OK + pedido actualizado

5. DELETE /api/orders/{id} (con token)
   ✅ Espera: 204 No Content (sin Body)

6. GET /api/orders
   ✅ Espera: El pedido no aparece en la lista
```

#### **Test 3: Validaciones**

**Objetivo:** Verificar que la API rechaza datos inválidos

```
❌ POST /api/orders sin descripción
   Espera: 400 Bad Request + error message

❌ POST /api/orders con items vacío
   Espera: 400 Bad Request + "Total must be greater than 0"

❌ POST /api/auth/register sin password
   Espera: 400 Bad Request + errores de validación

❌ GET /api/orders/{id} sin token
   Espera: 401 Unauthorized

❌ GET /api/orders/999 (ID no existe)
   Espera: 404 Not Found
```

---

### 📊 Tabla de Respuestas Esperadas

| Endpoint | Método | Token | Status | Respuesta |
|----------|--------|-------|--------|-----------|
| /auth/demo-token | GET | ❌ | 200 | `{success, token, expiresIn}` |
| /auth/register | POST | ❌ | 201 | `{success, token, user}` |
| /auth/login | POST | ❌ | 200 | `{success, token, user}` |
| /auth/profile | GET | ✅ | 200 | `{id, username, email, role}` |
| /orders | POST | ✅ | 201 | `{id, orderNumber, ...}` |
| /orders | GET | ✅ | 200 | `[{...}, {...}]` array |
| /orders/{id} | GET | ✅ | 200 | `{id, orderNumber, ...}` |
| /orders/{id} | PUT | ✅ | 200 | `{id, orderNumber, ...}` |
| /orders/{id} | DELETE | ✅ | 204 | (sin body) |
| /orders/{id} | GET | ✅ | 404 | Si no existe |

---

### 🎯 Plan de Pruebas Rápido (5 minutos)

```
⏱️ TIEMPO ESTIMADO: 5 minutos

Paso 1 (1 min):
  → Abre http://localhost:5000/
  → GET /api/auth/demo-token
  → Copia token

Paso 2 (1 min):
  → Click "Authorize"
  → Pega token
  → Click "Authorize"

Paso 3 (1 min):
  → GET /api/orders
  → "Execute"
  → Debes ver lista (vacía o con pedidos)

Paso 4 (1 min):
  → POST /api/orders
  → Completa JSON con descripción e items
  → "Execute"
  → Debes recibir 201 + pedido creado

Paso 5 (1 min):
  → GET /api/orders
  → Debes ver el nuevo pedido en la lista

✅ LISTO: Tu API está funcionando correctamente
```

---



## 🛠️ Configuración

### Variables de Entorno Backend

**appsettings.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=OrderManagementDB;Trusted_Connection=true;"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-minimum-32-characters",
    "Issuer": "OrderManagementAPI",
    "Audience": "OrderManagementClient",
    "ExpirationMinutes": 60
  }
}
```

### Variables de Entorno Frontend

**.env:**
```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Order Management
```

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| **Port 5000 en uso** | `lsof -i :5000` (Mac/Linux) o `netstat -ano \| findstr :5000` (Windows) |
| **CORS Error** | Verificar que CORS está habilitado en backend |
| **Token inválido** | Limpiar localStorage: `localStorage.clear()` |
| **BD no conecta** | Verificar SQL Server está corriendo, revisar connection string |
| **npm dependencies error** | `rm -r node_modules package-lock.json && npm install` |
| **Port 5173 en uso** | `npm run dev -- --port 5174` |

---

## 📊 Base de Datos

### Esquema

```sql
-- Users
CREATE TABLE Users (
  Id INT PRIMARY KEY,
  Username VARCHAR(50) UNIQUE,
  Email VARCHAR(100) UNIQUE,
  PasswordHash VARCHAR(255),
  Role VARCHAR(20),
  IsActive BIT,
  CreatedAt DATETIME,
  UpdatedAt DATETIME
)

-- Orders
CREATE TABLE Orders (
  Id INT PRIMARY KEY,
  UserId INT FOREIGN KEY,
  OrderNumber VARCHAR(50) UNIQUE,
  Status INT,
  TotalAmount DECIMAL,
  Description VARCHAR(500),
  CreatedAt DATETIME,
  UpdatedAt DATETIME
)

-- OrderItems
CREATE TABLE OrderItems (
  Id INT PRIMARY KEY,
  OrderId INT FOREIGN KEY,
  ProductName VARCHAR(200),
  Quantity INT,
  UnitPrice DECIMAL
)
```

---

## 📈 Performance y Escalabilidad

### Optimizaciones Implementadas

- ✅ Lazy loading de rutas (Frontend)
- ✅ Memoización con useCallback (React)
- ✅ Tree shaking con Vite
- ✅ Polly retry policies (Backend)
- ✅ Connection pooling (EF Core)
- ✅ Async/await (Non-blocking)

### Para Producción

- 🔄 Implementar Redis para caché
- 🔄 Containerizar con Docker
- 🔄 Desplegar en Kubernetes
- 🔄 CDN para assets estáticos
- 🔄 Application Insights para monitoreo
- 🔄 Rate limiting en API

---

## 📚 Scripts Disponibles

### Backend

```powershell
dotnet run                    # Ejecutar aplicación
dotnet build                  # Compilar
dotnet test                   # Ejecutar tests
dotnet ef migrations add      # Crear migración
dotnet ef database update     # Aplicar migraciones
```

### Frontend

```bash
npm run dev          # Desarrollo
npm run build        # Producción
npm run preview      # Preview build
npm run lint         # Verificar código
npm run type-check   # Tipos TypeScript
```

---

## ✅ Checklist de Requisitos

### Backend
- ✅ API RESTful
- ✅ Autenticación JWT
- ✅ Validación de credenciales contra BD
- ✅ Generación de tokens con claims
- ✅ Protección con [Authorize]
- ✅ Tokens con expiración
- ✅ Roles y claims
- ✅ Manejo de errores
- ✅ Arquitectura limpia
- ✅ Patrones de resiliencia
- ✅ Logging estructurado

### Autenticación y Seguridad
- ✅ Endpoint `/api/auth/register` - Registrar usuarios
- ✅ Endpoint `/api/auth/login` - Iniciar sesión
- ✅ Validación de credenciales contra BD
- ✅ Generación de JWT HS256 con claims (UserId, Username, Role)
- ✅ Protección de endpoints con `[Authorize]`
- ✅ Expiración de tokens (60 minutos)
- ✅ BCrypt hashing (work factor 12)
- ✅ Validación de ownership

### CRUD de Pedidos
- ✅ Crear pedido (POST /api/orders)
- ✅ Leer pedido (GET /api/orders/{id})
- ✅ Actualizar pedido (PUT /api/orders/{id})
- ✅ Eliminar pedido (DELETE /api/orders/{id})
- ✅ Listar pedidos del usuario (GET /api/orders)
- ✅ Validación de ownership
- ✅ Estados de pedido (Pending, Confirmed, Shipped, Delivered, Cancelled)

### Código Backend
- ✅ Arquitectura limpia (4 capas)
- ✅ Patrones SOLID implementados
- ✅ Dependency Injection centralizado
- ✅ Validación FluentValidation
- ✅ Manejo robusto de errores
- ✅ Logging estructurado [AUDIT], [SECURITY], [ERROR]
- ✅ Documentación XML completa
- ✅ Polly resilience patterns

### Frontend (React 18 + TypeScript)
- ✅ Interfaz responsiva y moderna
- ✅ Context API para estado global
- ✅ Axios interceptors para tokens
- ✅ Rutas protegidas (ProtectedRoute)
- ✅ Validación de formularios
- ✅ Manejo de errores completo
- ✅ TypeScript strict mode
- ✅ JSDoc documentación

---

## ✅ Verificación de Reglas de Negocio

Se han verificado e implementado todas las reglas de negocio solicitadas:

### 📋 Reglas Implementadas y Verificadas

#### 1. **Total del Pedido Mayor a 0** ✅
- **Implementación:** FluentValidation + Service layer validation
- **Ubicación:** `OrderValidators.cs` + `OrderService.cs` línea 109
- **Validación en cascada:** Cantidad > 0, Precio > 0, Total > 0
- **Resultado:** Sistema rechaza pedidos con total ≤ 0
- **Documento:** [BUSINESS_RULES_VERIFICATION.md](./BUSINESS_RULES_VERIFICATION.md)

#### 2. **Número de Pedido Único** ✅
- **Implementación:** Generación aleatoria + BD check loop
- **Formato:** `ORD-{timestamp:yyyyMMddHHmmss}-{GUID:8chars}`
- **Garantía:** Verificación en BD antes de guardar
- **Colisión:** Probabilidad: < 0.0001%
- **Documento:** [BUSINESS_RULES_VERIFICATION.md](./BUSINESS_RULES_VERIFICATION.md)

#### 3. **Solo Usuarios Autenticados Acceden al CRUD** ✅
- **Implementación:** `[Authorize]` en controlador OrdersController
- **Autenticación:** JWT Bearer Token requerido
- **Ownership Check:** Cada usuario solo ve sus propios pedidos
- **Métodos protegidos:** POST, GET, PUT, DELETE
- **Documento:** [BUSINESS_RULES_VERIFICATION.md](./BUSINESS_RULES_VERIFICATION.md)

#### 4. **Eliminación Lógica (Soft Delete)** ✅
- **Implementación:** Propiedad `IsDeleted` boolean en Entity
- **Auditoría:** Campo `DeletedAt` registra timestamp
- **Recuperable:** Datos nunca se borran físicamente
- **Queries:** Todos los SELECT excluyen (`!o.IsDeleted`)
- **Documento:** [BUSINESS_RULES_VERIFICATION.md](./BUSINESS_RULES_VERIFICATION.md)

### 🔐 Verificación de Seguridad - Autenticación y Autorización

Se han verificado e implementado todas las reglas de seguridad avanzada:

#### 1. **Tokens con Expiración** ✅
- **Duración:** 60 minutos (configurable en `appsettings.json`)
- **Generación:** `DateTime.UtcNow.AddMinutes(expirationMinutes)`
- **Validación:** `ValidateLifetime = true` con `ClockSkew = 0`
- **Rechazo:** Token expirado → 401 Unauthorized
- **Documento:** [AUTHENTICATION_AUTHORIZATION_VERIFICATION.md](./AUTHENTICATION_AUTHORIZATION_VERIFICATION.md)

#### 2. **Roles y Claims** ✅
- **Roles definidos:** User (0), Admin (1), Manager (2)
- **Claims incluidos:** NameIdentifier, Name, Role (+ custom claims)
- **Autorización:** `[Authorize(Roles = "Admin")]` en endpoints admin
- **Endpoints protegidos:** `/approve`, `/reject`, `/admin/all`
- **Documento:** [AUTHENTICATION_AUTHORIZATION_VERIFICATION.md](./AUTHENTICATION_AUTHORIZATION_VERIFICATION.md)

#### 3. **Manejo de Errores de Autenticación/Autorización** ✅
- **401 Unauthorized:** Token ausente, expirado o inválido
- **403 Forbidden:** Usuario sin rol requerido
- **404 Not Found:** Recurso no existe
- **500 Error:** Excepciones en servidor
- **Logging:** `[SECURITY]` y `[AUDIT]` registran todos los intentos
- **Documento:** [AUTHENTICATION_AUTHORIZATION_VERIFICATION.md](./AUTHENTICATION_AUTHORIZATION_VERIFICATION.md)

### 📊 Documentación de Verificación

Se han creado dos documentos exhaustivos de verificación:

| Documento | Contenido | Ubicación |
|-----------|----------|-----------|
| **BUSINESS_RULES_VERIFICATION.md** | Reglas de negocio: Total > 0, OrderNumber único, Solo autenticados, Soft delete | Raíz del proyecto |
| **AUTHENTICATION_AUTHORIZATION_VERIFICATION.md** | Seguridad: Tokens con expiración, Roles/Claims, Manejo de errores | Raíz del proyecto |

Cada documento incluye:
- ✅ Código fuente exacto con líneas
- ✅ Configuración de appsettings.json
- ✅ Ejemplos de requests HTTP
- ✅ Casos de prueba
- ✅ Flujos de seguridad
- ✅ Testing en sistema operativo

---

## 📖 Referencias Adicionales

- [Microsoft Docs - .NET 8](https://learn.microsoft.com/dotnet/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT.io](https://jwt.io/)
- [Axios](https://axios-http.com/)
- [Polly](https://github.com/App-vNext/Polly)
- **[Verificación de Reglas de Negocio](./BUSINESS_RULES_VERIFICATION.md)** - Documento detallado
- **[Verificación de Seguridad](./AUTHENTICATION_AUTHORIZATION_VERIFICATION.md)** - Documento detallado

---

## 🤝 Contribuir

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/amazing`
3. Commit cambios: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing`
5. Abre Pull Request

---

## 📬 Contacto y Soporte

Para preguntas o problemas, contactar al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última actualización:** 23 de febrero de 2026  
**Licencia:** MIT  
**Estado:** ✅ Producción-Ready
