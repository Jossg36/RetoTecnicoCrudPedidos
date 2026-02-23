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

## 📚 Documentación de API

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

### Backend Tests
```powershell
cd backend

# Run all tests
dotnet test

# Run with coverage
dotnet test /p:CollectCoverageFlag=true
```

### Frontend Tests
```powershell
cd frontend

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

---

## 🚀 Deployment

### Backend Deployment
1. Publish the application: `dotnet publish -c Release`
2. Configure SQL Server on target environment
3. Update connection string in `appsettings.json`
4. Set environment variables for JWT secret
5. Deploy to IIS, Azure App Service, or docker container

### Frontend Deployment
1. Build the application: `npm run build`
2. Upload `dist` folder to static hosting (Netlify, Vercel, GitHub Pages)
3. Or serve with any HTTP server configured for SPA routing

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY,
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) DEFAULT 'User',
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

### Orders Table
```sql
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY,
    NumeroPedido NVARCHAR(50) NOT NULL,
    UserId INT FOREIGN KEY REFERENCES Users(Id),
    Fecha DATETIME DEFAULT GETDATE(),
    Total DECIMAL(10, 2) NOT NULL,
    Estado NVARCHAR(50) DEFAULT 'Pending',
    Description NVARCHAR(MAX)
);
```

### OrderItems Table
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

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Port 5000 already in use
```powershell
# Kill process on port 5000
Get-Process | Where-Object {$_.Id -eq (Get-NetTCPConnection -LocalPort 5000).OwningProcess} | Stop-Process
```

**Problem:** Database connection failed
```powershell
# Verify SQL Server is running
sqlcmd -S localhost\SQLEXPRESS -Q "SELECT @@VERSION"
```

**Problem:** JWT token invalid
- Ensure token is fresh (not expired)
- Check Authorization header format: `Bearer {token}`
- Verify JWT secret is configured correctly

### Frontend Issues

**Problem:** Cannot connect to backend
- Verify backend is running on port 5000
- Check CORS configuration in Program.cs
- Ensure API_BASE_URL is correct in .env

**Problem:** Vite build errors
```powershell
# Clear cache and reinstall
npm cache clean --force
rm -r node_modules
npm install
npm run dev
```

---

## 📞 Support & Contact

For issues, questions, or contributions:
1. Check existing documentation in `/backend/README.md` and `/frontend/README.md`
2. Review error messages and logs
3. Check database migrations status
4. Verify environment configuration

---

## 📄 License

This project is provided as-is for educational and professional purposes.

---

## ✨ Features Highlights

- 🔐 **Enterprise Security:** JWT + Role-based access control
- 📊 **Clean Architecture:** Domain-driven design principles
- 🧪 **Comprehensive Testing:** Unit and integration tests
- 📚 **Well Documented:** Extensive inline comments and README files
- 🎨 **Modern UI:** Responsive design with professional styling
- ⚡ **Performance:** Optimized queries and efficient state management
- 🔄 **Resiliance:** Retry mechanisms and error handling
- 📱 **Responsive:** Works on desktop, tablet, and mobile devices

---

**Last Updated:** February 23, 2026

