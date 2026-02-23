# 🚀 Sistema de Gestión de Pedidos - Fullstack Senior

**Solución Fullstack profesional para gestión de pedidos con autenticación JWT, arquitectura limpia y seguridad empresarial**

## 📋 Descripción General

Aplicación Fullstack moderna que proporciona capacidades completas de gestión de pedidos:

- ✅ Registro e inicio de sesión seguro con JWT Bearer tokens
- ✅ Operaciones CRUD completas de pedidos (Crear, Leer, Actualizar, Eliminar)
- ✅ Gestión de artículos dentro de cada pedido
- ✅ Gestión del estado de pedidos (Pendiente → Entregado)
- ✅ Control de acceso basado en roles (Admin, Usuario)
- ✅ Arquitectura limpia con separación de responsabilidades
- ✅ Patrones de resiliencia y mecanismos de reintentos automáticos
- ✅ Validación robusta y logging estructurado
- ✅ UI profesional con React + TypeScript
- ✅ Diseño responsivo y estilos modernos

---

## 🏗️ Stack Tecnológico

### Backend
- **Framework:** ASP.NET Core 8.0
- **ORM:** Entity Framework Core 8.0
- **Base de Datos:** SQL Server Express (localhost\SQLEXPRESS)
- **Autenticación:** JWT Bearer Tokens (expiración 60 minutos)
- **Validación:** FluentValidation
- **Mapeo:** AutoMapper
- **Logging:** Serilog
- **Arquitectura:** Clean Architecture con principios SOLID
- **Documentación API:** Swagger/OpenAPI

### Frontend
- **Framework:** React 18+
- **Lenguaje:** TypeScript 5+
- **Bundler:** Vite 5.4+
- **Cliente HTTP:** Axios
- **Routing:** React Router v6
- **Estilos:** CSS3 con componentes modernos
- **Testing:** Vitest + React Testing Library

### Base de Datos
- **Servidor:** SQL Server Express (localhost\SQLEXPRESS)
- **Nombre BD:** OrderManagementDB
- **Tablas:** Users, Orders, OrderItems
- **Automática:** Migraciones aplicadas en la primera ejecución

---

## ⚡ Inicio Rápido (5 minutos)

### Requisitos Previos
- SDK de .NET 8.0 instalado
- Node.js 18+ y npm instalados
- SQL Server Express instalado localmente
- Git instalado

### 🚀 Configuración Backend

```powershell
# Navegar a la carpeta backend
cd backend

# Restaurar paquetes NuGet
dotnet restore

# Compilar el proyecto
dotnet build

# Ejecutar la aplicación
dotnet run --project OrderManagementAPI.Api

# ✅ Backend ejecutándose en: http://localhost:5000
# 📚 Swagger UI: http://localhost:5000/swagger
```

### 🚀 Configuración Frontend

```powershell
# Navegar a la carpeta frontend (en una nueva terminal)
cd frontend

# Instalar paquetes npm
npm install

# Iniciar servidor de desarrollo
npm run dev

# ✅ Frontend ejecutándose en: http://localhost:3000
```

### 🔐 Credenciales de Admin Predeterminadas

```
Usuario:    admin
Contraseña: Admin@123
Rol:        Administrador
```

---

## � Guía Detallada de Ejecución

### Opción 1: Ejecución Manual (Recomendado para Desarrollo)

#### Paso 1: Preparar la Base de Datos
```powershell
# Verificar que SQL Server Express está ejecutándose
sqlcmd -S localhost\SQLEXPRESS -Q "SELECT @@VERSION"

# Si no existe la base de datos, se creará automáticamente
```

#### Paso 2: Ejecutar Backend (Terminal 1)
```powershell
# Navegar a la carpeta del proyecto
cd "c:\ruta\al\proyecto"

# Ir a la carpeta backend
cd backend

# Restaurar dependencias
dotnet restore

# Compilar el proyecto
dotnet clean
dotnet build

# Ejecutar la aplicación
dotnet run --project OrderManagementAPI.Api

# Esperado: "Application started" en la consola
# Backend disponible en: http://localhost:5000
# Swagger UI: http://localhost:5000/swagger
```

#### Paso 3: Ejecutar Frontend (Terminal 2)
```powershell
# En una NUEVA terminal de PowerShell/CMD

# Navegar al proyecto
cd "c:\ruta\al\proyecto"

# Ir a la carpeta frontend
cd frontend

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar servidor de desarrollo
npm run dev

# Esperado: "VITE v5.x.x ready in XXX ms"
# Frontend disponible en: http://localhost:3000
```

#### Paso 4: Acceder a la Aplicación
```
1. Abre tu navegador en: http://localhost:3000
2. Usa las credenciales de admin:
   - Usuario: admin
   - Contraseña: Admin@123
3. ¡Listo! Puedes navegar y usar la aplicación
```

---

### Opción 2: Ejecución Usando Scripts PowerShell

Se incluyen scripts para automatizar la ejecución complete:

```powershell
# Script para ejecutar todo automáticamente
.\RUN_TESTS.ps1

# O ejecutar manualmente:
# Script para tests del backend
.\Scripts\test-backend.ps1

# Script para tests del frontend
.\Scripts\test-frontend.ps1
```

---

### Opción 3: Detener la Aplicación

Si necesitas detener los servidores:

```powershell
# Matar procesos de .NET
Get-Process -Name dotnet -ErrorAction SilentlyContinue | Stop-Process -Force

# Matar procesos de Node.js
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Verificar que se detuvo
Get-Process -Name dotnet, node -ErrorAction SilentlyContinue
```

---

### Verificación de Puertos

Asegúrate de que los puertos requeridos estén disponibles:

```powershell
# Verificar puerto 5000 (Backend)
Test-NetConnection -ComputerName localhost -Port 5000

# Verificar puerto 3000 (Frontend)
Test-NetConnection -ComputerName localhost -Port 3000

# Si están ocupados, libéralos:
Get-NetTCPConnection -LocalPort 5000 | Select-Object -First 1 | ForEach-Object {
    Get-Process -Id $_.OwningProcess | Stop-Process -Force
}
```

---

### Verificación de Requisitos

Antes de ejecutar, verifica que tienes todo instalado:

```powershell
# Verificar .NET SDK 8.0
dotnet --version

# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar SQL Server Express
sqlcmd -S localhost\SQLEXPRESS -Q "SELECT @@VERSION"
```

---

### Solución Rápida de Problemas Comunes

| Problema | Solución |
|----------|----------|
| **Port 5000 en uso** | `Get-NetTCPConnection -LocalPort 5000 \| ForEach {Stop-Process -Id $_.OwningProcess}` |
| **Port 3000 en uso** | `Get-NetTCPConnection -LocalPort 3000 \| ForEach {Stop-Process -Id $_.OwningProcess}` |
| **Error de BD** | Reinicia SQL Server o ejecuta: `sqlcmd -S localhost\SQLEXPRESS -Q "DROP DATABASE OrderManagementDB"` |
| **Frontend no compila** | Borra caché: `rm .vite dist -r; npm install; npm run dev` |
| **Error CORS** | Verifica que frontend está en puerto 3000 |
| **Token expirado** | Login nuevamente, tokens duran 60 minutos |

---

## �📚 Documentación de API

### Endpoints de Autenticación

#### Registrar Nuevo Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "juan.perez",
  "email": "juan@example.com",
  "password": "SecurePass123!"
}

Respuesta:
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 2,
    "username": "juan.perez",
    "email": "juan@example.com",
    "role": "Usuario"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "juan.perez",
  "password": "SecurePass123!"
}

Respuesta: Igual que registrar
```

### Endpoints de Gestión de Pedidos

#### Obtener Pedidos del Usuario
```http
GET /api/orders
Authorization: Bearer {token}

Respuesta:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numeroPedido": "PED001",
      "cliente": "Juan Perez",
      "fecha": "2026-02-23",
      "total": 150.50,
      "estado": "Pendiente",
      "description": "Descripción del pedido",
      "items": [...]
    }
  ]
}
```

#### Crear Pedido
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "numeroPedido": "PED001",
  "description": "Descripción del pedido",
  "items": [
    {
      "productName": "Producto 1",
      "quantity": 2,
      "unitPrice": 50.00
    }
  ]
}

Respuesta: Pedido creado con ID
```

#### Actualizar Pedido
```http
PUT /api/orders/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "numeroPedido": "PED001",
  "estado": "Entregado",
  "description": "Descripción actualizada",
  "items": [...]
}
```

#### Eliminar Pedido
```http
DELETE /api/orders/{id}
Authorization: Bearer {token}
```

---

## 🗂️ Estructura del Proyecto

```
OrderManagement/
├── backend/
│   ├── OrderManagementAPI.Api/
│   │   ├── Controllers/          # Endpoints de API
│   │   ├── Middleware/           # Middleware personalizado
│   │   ├── Authorization/        # Atributos de autorización
│   │   ├── Extensions/           # Inyección de dependencias
│   │   └── Program.cs            # Configuración de aplicación
│   ├── OrderManagementAPI.Application/
│   │   ├── Services/             # Lógica de negocio
│   │   ├── DTOs/                 # Objetos de transferencia de datos
│   │   ├── Validators/           # Reglas de validación
│   │   └── Interfaces/           # Contratos de servicios
│   ├── OrderManagementAPI.Domain/
│   │   ├── Entities/             # Modelos de dominio
│   │   └── Interfaces/           # Contratos de repositorio
│   ├── OrderManagementAPI.Infrastructure/
│   │   ├── Data/                 # Contexto de base de datos
│   │   ├── Services/             # Servicios de infraestructura
│   │   ├── Security/             # Hash de contraseñas
│   │   └── Migrations/           # Migraciones de BD
│   └── OrderManagementAPI.Tests/
│       ├── Services/             # Tests de servicios
│       └── Security/             # Tests de seguridad
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   ├── pages/                # Componentes de página
│   │   ├── services/             # Servicios de API
│   │   ├── contexts/             # Contextos de React
│   │   ├── types/                # Tipos TypeScript
│   │   ├── styles/               # Archivos CSS
│   │   └── App.tsx               # Componente principal
│   ├── public/                   # Assets estáticos
│   ├── index.html                # Punto de entrada HTML
│   └── vite.config.ts            # Configuración de Vite
│
└── README.md                      # Este archivo
```

---

## 🔑 Características Principales

### Autenticación y Autorización
- Autenticación basada en JWT Bearer tokens
- Expiración automática de tokens (60 minutos)
- Hash seguro de contraseñas con bcrypt
- Control de acceso basado en roles

### Gestión de Pedidos
- Crear, leer, actualizar y eliminar pedidos
- Seguimiento del estado del pedido (Pendiente, Entregado)
- Gestión de artículos de pedido con precios
- Generación de números de pedido
- Aislamiento de pedidos por usuario

### Validación de Datos
- Reglas FluentValidation en backend
- Validación en tiempo real en frontend
- Mensajes de error comprehensivos
- Validación de solicitud/respuesta

### Manejo de Errores
- Middleware global de excepciones
- Respuestas de error estructuradas
- Logging detallado con Serilog
- Mensajes de error amigables para el usuario

### Seguridad
- Configuración de CORS para localhost:3000
- Lista para HTTPS (desarrollo: HTTP)
- Prevención de inyección SQL (consultas parametrizadas)
- Protección contra XSS (sanitización de contenido)
- Soporte para tokens CSRF

---

## 📝 Testing

### Tests Backend
```powershell
cd backend

# Ejecutar todos los tests
dotnet test

# Ejecutar con cobertura
dotnet test /p:CollectCoverageFlag=true
```

### Tests Frontend
```powershell
cd frontend

# Ejecutar tests
npm run test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

---

## 🚀 Deployment

### Deployment Backend
1. Publicar la aplicación: `dotnet publish -c Release`
2. Configurar SQL Server en el entorno destino
3. Actualizar cadena de conexión en `appsettings.json`
4. Establecer variables de entorno para secreto JWT
5. Desplegar en IIS, Azure App Service o contenedor Docker

### Deployment Frontend
1. Compilar la aplicación: `npm run build`
2. Subir carpeta `dist` a hosting estático (Netlify, Vercel, GitHub Pages)
3. O servir con cualquier servidor HTTP configurado para SPA routing

---

## 📊 Esquema de Base de Datos

### Tabla Users
```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY,
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) DEFAULT 'Usuario',
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

### Tabla Orders
```sql
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY,
    NumeroPedido NVARCHAR(50) NOT NULL,
    UserId INT FOREIGN KEY REFERENCES Users(Id),
    Fecha DATETIME DEFAULT GETDATE(),
    Total DECIMAL(10, 2) NOT NULL,
    Estado NVARCHAR(50) DEFAULT 'Pendiente',
    Description NVARCHAR(MAX)
);
```

### Tabla OrderItems
```sql
CREATE TABLE OrderItems (
    Id INT PRIMARY KEY IDENTITY,
    OrderId INT FOREIGN KEY REFERENCES Orders(Id),
    ProductName NVARCHAR(100) NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    TotalPrice DECIMAL(10, 2) NOT NULL
);
```

---

## 🐛 Solución de Problemas

### Problemas Backend

**Problema:** Puerto 5000 ya está en uso
```powershell
# Terminar proceso en puerto 5000
Get-Process | Where-Object {$_.Id -eq (Get-NetTCPConnection -LocalPort 5000).OwningProcess} | Stop-Process
```

**Problema:** Conexión a base de datos fallida
```powershell
# Verificar que SQL Server está ejecutándose
sqlcmd -S localhost\SQLEXPRESS -Q "SELECT @@VERSION"
```

**Problema:** Token JWT inválido
- Asegurarse de que el token es reciente (no expirado)
- Verificar formato del encabezado de autorización: `Bearer {token}`
- Verificar que el secreto JWT está configurado correctamente

### Problemas Frontend

**Problema:** No se puede conectar a backend
- Verificar que backend se está ejecutando en puerto 5000
- Verificar configuración de CORS en Program.cs
- Asegurarse de que API_BASE_URL es correcto

**Problema:** Errores de compilación con Vite
```powershell
# Limpiar caché y reinstalar
npm cache clean --force
rm -r node_modules
npm install
npm run dev
```

---

## 📞 Soporte

Para problemas, preguntas o contribuciones:
1. Consulta la documentación existente en `/backend/README.md` y `/frontend/README.md`
2. Revisa los mensajes de error y logs
3. Verifica el estado de migraciones de base de datos
4. Verifica la configuración del entorno

---

## 📄 Licencia

Este proyecto se proporciona tal cual para propósitos educativos y profesionales.

---

## ✨ Características Destacadas

- 🔐 **Seguridad Empresarial:** JWT + Control de acceso basado en roles
- 📊 **Arquitectura Limpia:** Principios de diseño dirigido por dominio
- 🧪 **Testing Comprehensivo:** Tests unitarios e integración
- 📚 **Bien Documentado:** Comentarios extensos y archivos README
- 🎨 **UI Moderna:** Diseño responsivo con estilos profesionales
- ⚡ **Rendimiento:** Consultas optimizadas y gestión de estado eficiente
- 🔄 **Resiliencia:** Mecanismos de reintentos y manejo de errores
- 📱 **Responsivo:** Funciona en escritorio, tablet y dispositivos móviles

---

**Última Actualización:** 23 de febrero de 2026

