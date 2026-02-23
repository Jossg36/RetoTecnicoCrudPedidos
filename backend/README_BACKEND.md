# 🔧 Backend - Order Management API

**API REST para gestión de pedidos con autenticación JWT y arquitectura limpia**

## 📋 Descripción

Backend desarrollado en .NET 8.0 que proporciona una API REST completa para gestión de pedidos con:
- ✅ Autenticación y autorización con JWT
- ✅ CRUD completo de pedidos
- ✅ Validación de datos con FluentValidation
- ✅ Patrones de resiliencia con Polly
- ✅ Logging estructurado con Serilog
- ✅ Arquitectura limpia en 4 capas

## 🏗️ Arquitectura

### Capas del Proyecto

```
OrderManagementAPI/
├── Domain/              # Entidades de negocio
│   └── Entities/
│       ├── User.cs
│       ├── Order.cs
│       └── OrderItem.cs
│
├── Application/         # DTOs y contratos
│   ├── DTOs/
│   │   ├── Auth/
│   │   └── Orders/
│   ├── Interfaces/
│   │   ├── IAuthService.cs
│   │   ├── IOrderService.cs
│   │   └── IJwtTokenService.cs
│   └── Validators/      # FluentValidation
│       ├── Auth/
│       └── Orders/
│
├── Infrastructure/      # Implementaciones
│   ├── Data/
│   │   ├── ApplicationDbContext.cs
│   │   └── Migrations/
│   ├── Services/
│   │   ├── AuthService.cs
│   │   └── OrderService.cs
│   ├── Security/
│   │   ├── JwtTokenService.cs
│   │   └── PasswordHasher.cs
│   └── Mapping/
│       └── MappingProfile.cs
│
└── API/                 # Controladores y middleware
    ├── Controllers/
    │   ├── AuthController.cs
    │   └── OrdersController.cs
    ├── Middleware/
    │   ├── GlobalExceptionHandlerMiddleware.cs
    │   └── RequestLoggingMiddleware.cs
    ├── Extensions/
    │   ├── ServiceCollectionExtensions.cs
    │   └── ApplicationBuilderExtensions.cs
    ├── Program.cs
    └── appsettings.json
```

### Patrones Arquitectónicos

| Patrón | Ubicación | Beneficio |
|--------|-----------|----------|
| **Dependency Injection (DI)** | Constructores | Testeable, desacoplado |
| **Repository Pattern** | DbContext (implícito) | Aislamiento de datos |
| **Factory Pattern** | JwtTokenService | Creación de tokens |
| **Resilience Pattern** | Polly en OrderService | Retry automático |
| **Chain of Responsibility** | ServiceCollectionExtensions | Configuración modular |
| **Decorator Pattern** | Middleware | Comportamientos adicionales |

---

## 🚀 Requisitos Previos

### Sistema Operativo
- Windows 10+ o Linux/macOS con .NET Core

### Software Requerido
- **.NET 8.0 SDK** → [Descargar](https://dotnet.microsoft.com/download/dotnet/8.0)
- **SQL Server LocalDB** o **SQL Server Express** → [Descargar](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **Visual Studio Code** o **Visual Studio** (opcional)

### Verificar Instalación

```PowerShell
# Verificar .NET
dotnet --version
# Debe retornar: 8.0.x

# Verificar SQL Server (LocalDB)
sqllocaldb info mssqllocaldb
```

---

## 📦 Instalación

### 1. Clonar o Descargar el Proyecto

```bash
cd "tu-ruta-proyecto"
cd backend
```

### 2. Restaurar Dependencias

```PowerShell
dotnet restore
```

### 3. Configurar Base de Datos

#### Opción A: Migrations Automáticas (Recomendado)
Las migraciones se aplican automáticamente al iniciar la aplicación.

**appsettings.json** (ya configurado):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=OrderManagementDB;Trusted_Connection=true;"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-change-this-in-production-minimum-32-characters",
    "Issuer": "OrderManagementAPI",
    "Audience": "OrderManagementClient",
    "ExpirationMinutes": 60
  }
}
```

#### Opción B: Migraciones Manual
```PowerShell
# Actualizar base de datos
dotnet ef database update --project OrderManagementAPI.Infrastructure --startup-project OrderManagementAPI.Api

# Ver migraciones pendientes
dotnet ef migrations list --project OrderManagementAPI.Infrastructure --startup-project OrderManagementAPI.Api
```

### 4. Configurar Secrets (Producción)

```PowerShell
# Inicializar secrets locales
dotnet user-secrets init

# Establecer JWT Secret (producción)
dotnet user-secrets set "JwtSettings:SecretKey" "your-production-secret-key"
```

---

## ▶️ Ejecutar la Aplicación

### Ejecución con CLI

```PowerShell
# Navegar al directorio API
cd OrderManagementAPI.Api

# Ejecutar la aplicación
dotnet run

# La API estará disponible en:
# - HTTP:  http://localhost:5000
# - HTTPS: https://localhost:5001
# - Swagger: http://localhost:5000 (en desarrollo)
```

### Ejecución con Visual Studio

1. Abre `OrderManagementAPI.sln`
2. Asegúrate que `OrderManagementAPI.Api` es StartUp Project
3. Presiona `F5`

---

## 🔐 Autenticación

### Endpoints de Autenticación

#### 1️⃣ Registrar Usuario

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "juan",
  "email": "juan@example.com",
  "password": "Password123!"
}
```

**Respuesta (201 Created):**
```json
{
  "success": true,
  "message": "Registro completado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "juan",
    "email": "juan@example.com",
    "role": "User",
    "createdAt": "2026-02-22T10:30:00Z"
  }
}
```

#### 2️⃣ Iniciar Sesión

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "juan",
  "password": "Password123!"
}
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Autenticación completada",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "juan",
    "email": "juan@example.com",
    "role": "User"
  }
}
```

#### 3️⃣ Obtener Perfil

```http
GET /api/auth/profile
Authorization: Bearer {token}
```

**Respuesta (200 OK):**
```json
{
  "id": 1,
  "username": "juan",
  "email": "juan@example.com",
  "role": "User"
}
```

---

## 📦 Endpoints de Pedidos

### ➕ Crear Pedido

```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Pedido de prueba",
  "items": [
    {
      "productName": "Laptop",
      "quantity": 1,
      "unitPrice": 1500.00
    },
    {
      "productName": "Mouse",
      "quantity": 2,
      "unitPrice": 25.00
    }
  ]
}
```

**Respuesta (201 Created):**
```json
{
  "id": 1,
  "orderNumber": "ORD-20260222103000-a1b2c3d4",
  "description": "Pedido de prueba",
  "status": 0,
  "totalAmount": 1550.00,
  "items": [...],
  "createdAt": "2026-02-22T10:30:00Z"
}
```

### 📋 Listar Pedidos del Usuario

```http
GET /api/orders
Authorization: Bearer {token}
```

**Respuesta (200 OK):**
```json
[
  {
    "id": 1,
    "orderNumber": "ORD-20260222103000-a1b2c3d4",
    "description": "Pedido de prueba",
    "status": 0,
    "totalAmount": 1550.00,
    "createdAt": "2026-02-22T10:30:00Z"
  }
]
```

### 🔍 Obtener Pedido por ID

```http
GET /api/orders/{id}
Authorization: Bearer {token}
```

### ✏️ Actualizar Pedido

```http
PUT /api/orders/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Pedido actualizado",
  "status": 1
}
```

### 🗑️ Eliminar Pedido

```http
DELETE /api/orders/{id}
Authorization: Bearer {token}
```

**Respuesta (204 No Content)** - Eliminación exitosa

---

## 🔒 Seguridad

### JWT Token

**Estructura:**
```
Header.Payload.Signature
```

**Claims incluidos:**
- `urn:microsoft:identity:nameidentifierClaim`: User ID
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`: Username
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`: User Role

### Validación de Token

| Propiedad | Valor |
|-----------|-------|
| **Algoritmo** | HS256 (HMAC-SHA256) |
| **Expiración** | 60 minutos (configurable) |
| **Validación** | Firma, Issuer, Audience, Lifetime |
| **Clock Skew** | 0 segundos (sin tolerancia) |

### Contraseñas

- **Hashing**: BCrypt con work factor 12
- **Verificación**: Safe comparison (previene timing attacks)
- **Requisitos**: 8+ caracteres con mayúscula, minúscula y dígito

---

## 📝 Logging

### Niveles de Log

| Prefijo | Significado | Ejemplo |
|---------|-------------|---------|
| `[AUDIT]` | Acciones de usuario exitosas | Login, crear pedido |
| `[SECURITY]` | Intentos fallidos de seguridad | Login fallido, acceso denegado |
| `[VALIDATION]` | Errores de validación | Entrada inválida |
| `[ERROR]` | Excepciones y errores | Error de BD |
| `[RESILIENCE]` | Reintentos de Polly | Reintento de BD |

### Ubicación de Logs

```
logs/
└── app-{fecha}.txt

# Ejemplo:
logs/app-20260222.txt
```

---

## 🧪 Testing

### Usar Swagger/OpenAPI

1. Ejecutar la aplicación
2. Navegar a: `http://localhost:5000` (desarrollo)
3. Usar interfaz interactiva para probar endpoints

### Usar cURL

```bash
# Registrar
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"Pass123!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"Pass123!"}'
```

### Usar Postman

1. Importar endpoints desde Swagger JSON: `http://localhost:5000/swagger/v1/swagger.json`
2. Configurar autorización tipo Bearer Token
3. Usar token de login para endpoints protegidos

---

## 🛠️ Configuración Avanzada

### Cambiar Puerto

**Program.cs:**
```csharp
app.Urls.Add("https://localhost:5002");
app.Urls.Add("http://localhost:5002");
```

### Cambiar Expiración de Token

**appsettings.json:**
```json
{
  "JwtSettings": {
    "ExpirationMinutes": 120
  }
}
```

### CORS - Agregar Origen

**ServiceCollectionExtensions.cs:**
```csharp
policy.WithOrigins("https://tudominio.com")
```

---

## 📚 Estructuras de Datos

### Usuario (User)

```csharp
public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public UserRole Role { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

### Pedido (Order)

```csharp
public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string OrderNumber { get; set; }
    public string Description { get; set; }
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; set; }
    public ICollection<OrderItem> Items { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

### Estados de Pedido

```csharp
public enum OrderStatus
{
    Pending = 0,      // Pendiente
    Confirmed = 1,    // Confirmado
    Shipped = 2,      // Enviado
    Delivered = 3,    // Entregado
    Cancelled = 4     // Cancelado
}
```

---

## 🚨 Manejo de Errores

### Códigos de Respuesta

| Código | Significado |
|--------|-------------|
| **200** | Operación exitosa |
| **201** | Recurso creado |
| **204** | Eliminado sin contenido |
| **400** | Solicitud inválida (validación) |
| **401** | No autenticado (token inválido) |
| **403** | No autorizado (acceso denegado) |
| **404** | Recurso no encontrado |
| **500** | Error interno del servidor |

### Estructura de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": ["Error 1", "Error 2"],
  "timestamp": "2026-02-22T10:30:00Z"
}
```

---

## 🔄 Resilience & Retry

### Polly Policies

**OrderService** implementa:
- **Max Retries**: 3 intentos
- **Backoff**: Exponencial (100ms, 200ms, 400ms)
- **Trigger**: DbUpdateException, InvalidOperationException

---

## 📖 Referencias

- [Microsoft Docs - .NET 8](https://learn.microsoft.com/en-us/dotnet/)
- [ASP.NET Core API Best Practices](https://learn.microsoft.com/en-us/aspnet/core/web-api/)
- [JWT Authentication](https://jwt.io/)
- [Polly Resilience](https://github.com/App-vNext/Polly)
- [Entity Framework Core](https://learn.microsoft.com/ef/)

---

**Versión:** 1.0.0  
**Última actualización:** 22 de febrero de 2026  
**Licencia:** MIT
