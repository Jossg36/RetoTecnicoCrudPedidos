# SQL Scripts - Order Management System

Esta carpeta contiene scripts SQL profesionales y bien documentados para la gestión de la base de datos OrderManagementDB.

## [SECCION] Orden de Ejecución

Los scripts deben ejecutarse en el siguiente orden para asegurar que todas las dependencias se cumplan:

### 1. **001_CreateUsersTable.sql**
Crea la tabla `Users` que almacena información de usuarios del sistema.

**Incluye:**
- Tabla principal con campos: Id, Username, Email, PasswordHash, Role, IsActive, CreatedAt, UpdatedAt
- Índices de rendimiento: Username, Email, IsActive
- Validación de duplicados mediante UNIQUE constraints
- Enumeración de roles: 0 = Usuario Regular, 1 = Administrador

**Dependencias:** Ninguna (tabla base)
-- Ejecutar desde SSMS o SQL Server Management Studio
sqlcmd -S (localdb)\mssqllocaldb -d OrderManagementDB -i 001_CreateUsersTable.sql
```

---

### 2. **002_CreateOrdersTable.sql**
Crea la tabla `Orders` para registrar órdenes de compra.

**Incluye:**
- Tabla con relación a Users (Foreign Key)
- Campos: Id, UserId, OrderNumber, Status, Description, TotalAmount, CreatedAt, UpdatedAt
- Multiple índices para consultas frecuentes: UserId, Status, CreatedAt, OrderNumber
- Integridad referencial: Cascade Delete vinculado a Users
- Enumeración de estados: 0=Pendiente, 1=Confirmada, 2=Enviada, 3=Entregada, 4=Cancelada

**Dependencias:** 001_CreateUsersTable.sql

```sql
sqlcmd -S (localdb)\mssqllocaldb -d OrderManagementDB -i 002_CreateOrdersTable.sql
```

---

### 3. **003_CreateOrderItemsTable.sql**
Crea la tabla `OrderItems` para items individuales dentro de cada orden.

**Incluye:**
- Tabla con relación a Orders (Foreign Key)
- Campos: Id, OrderId, ProductName, Quantity, UnitPrice, TotalPrice
- Índices para consultas: OrderId
- Integridad referencial: Cascade Delete vinculado a Orders
- Precisión decimal (18,2) para precios

**Dependencias:** 002_CreateOrdersTable.sql

```sql
sqlcmd -S (localdb)\mssqllocaldb -d OrderManagementDB -i 003_CreateOrderItemsTable.sql
```

---

### 4. **004_InsertTestData.sql**
Inserta datos de prueba para desarrollo y testing.

**Incluye:**
- 5 usuarios de prueba (incluyendo admin)
- 8 órdenes con diferentes estados
- 20+ items distribuidos en diferentes órdenes
- Hash de contraseña simulado (nota: usar datos reales en producción)

**Dependencias:** 001, 002, 003

```sql
sqlcmd -S (localdb)\mssqllocaldb -d OrderManagementDB -i 004_InsertTestData.sql
```

**Datos de ejemplo:**
```
Usuarios:
  - admin / admin@ordermanagement.com (Role: Admin)
  - johnsmith / john.smith@example.com (Role: User)
  - mariagarcia / maria.garcia@example.com (Role: User)
  - davidlopez / david.lopez@example.com (Role: User)
  - annamartinez / anna.martinez@example.com (Role: User)

Órdenes: 8 órdenes con estados variados y montos entre $150 y $5000
Items: 20+ productos con precios que suman los totales de las órdenes
```

---

### 5. **005_ValidateData.sql**
Valida la integridad y consistencia de los datos.

**Incluye:**
- [OK] Validación de usuarios: Conteo, estado activo, roles
- [OK] Validación de unicidad: Usernames, Emails, OrderNumbers
- [OK] Validación de integridad referencial: Huérfanos, FK constraints
- [OK] Validación de órdenes: Por estado, montos
- [OK] Validación de items: Cálculos de precios, totales
- [TOTAL] Estadísticas: Inversión total, promedio, valores extremos

**Dependencias:** 004_InsertTestData.sql (pero puede ejecutarse sin datos)

```sql
sqlcmd -S (localdb)\mssqllocaldb -d OrderManagementDB -i 005_ValidateData.sql
```

**Salida esperada:**
```
[OK] Usuarios insertados: 5 registros
[OK] Órdenes insertadas: 8 registros
[OK] Items de órdenes insertados: 20 registros
[OK] Validación de nombres únicos: APROBADO
[OK] Validación de integridad referencial: APROBADO
```

---

### 6. **006_CleanupData.sql**
Limpia y reinicia todos los datos manteniendo la estructura de tablas.

**[ADVERTENCIA] Este script elimina TODOS los datos de forma permanente.**

**Incluye:**
- Eliminación en cascada respetando FK constraints
- Reset de identidades a valor inicial
- Vueltas transaccionales para seguridad
- Opción de recargar datos con 004_InsertTestData.sql

**Dependencias:** Ninguna (pero eliminará datos)

```sql
-- [CUIDADO] Elimina todos los datos
sqlcmd -S (localdb)\mssqllocaldb -d OrderManagementDB -i 006_CleanupData.sql

-- Recargar datos después
sqlcmd -S (localdb)\mssqllocaldb -d OrderManagementDB -i 004_InsertTestData.sql
```

---

### 7. **007_CreateStoredProcedures.sql**
Crea procedimientos almacenados para operaciones comunes.

**Incluye procedimientos:**

| Procedimiento | Descripción | Parámetros |
|---|---|---|
| `sp_GetOrderDetails` | Obtiene detalles completos de una orden | `@OrderId: INT` |
| `sp_GetUserOrders` | Obtiene órdenes de un usuario | `@UserId: INT, @Status: INT (opcional)` |
| `sp_GetOrderStatistics` | Estadísticas generales del sistema | Ninguno |
| `sp_SearchOrders` | Búsqueda avanzada con filtros | `@SearchTerm, @StatusFilter, @MinAmount, @MaxAmount` |
| `sp_GetOrderStatusHistory` | Historial de cambios de estado | `@OrderId: INT` |
| `sp_GetTopCustomers` | Clientes con más órdenes | `@TopCount: INT = 10` |

**Dependencias:** 001, 002, 003

```sql
sqlcmd -S (localdb)\mssqllocaldb -d OrderManagementDB -i 007_CreateStoredProcedures.sql
```

**Ejemplos de uso:**
```sql
-- Obtener detalles de orden
EXEC sp_GetOrderDetails @OrderId = 1

-- Obtener órdenes de usuario pendientes
EXEC sp_GetUserOrders @UserId = 2, @Status = 0

-- Ver estadísticas
EXEC sp_GetOrderStatistics

-- Buscar órdenes
EXEC sp_SearchOrders @SearchTerm = 'laptop', @MinAmount = 1000, @MaxAmount = 5000

-- Top 5 clientes
EXEC sp_GetTopCustomers @TopCount = 5
```

---

## [INICIO] Ejecución Rápida - Setup Completo

Para setup completo desde cero:

```powershell
# En PowerShell (Windows)
$dbServer = "(localdb)\mssqllocaldb"
$dbName = "OrderManagementDB"
$scriptPath = "C:\Users\User\OneDrive\Desktop\Reto Técnico — Fullstack Senior (.NET + React)\backend\Scripts\SQL"

sqlcmd -S $dbServer -d $dbName -i "$scriptPath\001_CreateUsersTable.sql"
sqlcmd -S $dbServer -d $dbName -i "$scriptPath\002_CreateOrdersTable.sql"
sqlcmd -S $dbServer -d $dbName -i "$scriptPath\003_CreateOrderItemsTable.sql"
sqlcmd -S $dbServer -d $dbName -i "$scriptPath\004_InsertTestData.sql"
sqlcmd -S $dbServer -d $dbName -i "$scriptPath\005_ValidateData.sql"
sqlcmd -S $dbServer -d $dbName -i "$scriptPath\007_CreateStoredProcedures.sql"
```

---

## [ESTRUCTURA] Estructura de Base de Datos

```
OrderManagementDB
├── Users (5 campos base + timestamps)
│   ├── Id (INT, PK, Identity)
│   ├── Username (NVARCHAR(100), UNIQUE)
│   ├── Email (NVARCHAR(255), UNIQUE)
│   ├── PasswordHash (NVARCHAR(MAX))
│   ├── Role (INT, 0=User, 1=Admin)
│   ├── IsActive (BIT)
│   ├── CreatedAt (DATETIME2)
│   └── UpdatedAt (DATETIME2)
│
├── Orders (8 campos base + timestamps + totales)
│   ├── Id (INT, PK, Identity)
│   ├── UserId (INT, FK → Users)
│   ├── OrderNumber (NVARCHAR(100), UNIQUE)
│   ├── Status (INT, 0-4)
│   ├── Description (NVARCHAR(500))
│   ├── TotalAmount (DECIMAL(18,2))
│   ├── CreatedAt (DATETIME2)
│   └── UpdatedAt (DATETIME2)
│
└── OrderItems (5 campos base)
    ├── Id (INT, PK, Identity)
    ├── OrderId (INT, FK → Orders)
    ├── ProductName (NVARCHAR(255))
    ├── Quantity (INT)
    ├── UnitPrice (DECIMAL(18,2))
    └── TotalPrice (DECIMAL(18,2))
```

---

## [FUTURO] Mejoras Futuras Recomendadas

1. **Tabla de Auditoría**: Registrar cambios de estado, actualizaciones de órdenes
2. **Índices adicionales**: Mejorar rendimiento en consultas complejas
3. **Vistas personalizadas**: Simplificar consultas comunes
4. **Triggers**: Validación automática y mantenimiento de datos
5. **Backup automático**: Scripts de respaldo programados
6. **Archivado de datos**: Mover órdenes antiguas a tabla de historial

---

## [NOTAS] Notas Importantes

- [OK] Todos los scripts son **idempotentes**: Pueden ejecutarse múltiples veces sin error
- [OK] Todos incluyen **manejo de errores**: OBJECT_ID checks, validaciones
- [OK] Todos usan **transacciones**: Cuando es necesario para seguridad
- [OK] Todos incluyen **comentarios detallados**: Fácil mantenimiento
- [SEGURIDAD] Los datos de prueba tienen **hashes simulados**: Usar contraseñas reales en producción
- [CRIPTOGRAFIA] El sistema usa **BCrypt con factor 12**: Garantiza seguridad de contraseñas

---

## [AYUDA] Resolución de Problemas

### Error: "Cannot INSERT the value NULL into column 'UserId'"
**Causa**: Intenta insertar datos de órdenes sin crear usuarios primero  
**Solución**: Ejecute scripts en orden: 001 → 002 → 003 → 004

### Error: "The INSERT statement conflicted with a FOREIGN KEY constraint"
**Causa**: FK constraint violada  
**Solución**: Verifique que las tablas base existan y tengan datos

### Identity valores incorrectos
**Causa**: Identidades no reseteadas  
**Solución**: Ejecute 006_CleanupData.sql y luego 004_InsertTestData.sql

---

## [CONTACTO] Contacto y Soporte

Para reportar problemas o sugerencias sobre estos scripts, contacte al equipo de desarrollo.

**Última actualización**: 2026-02-22  
**Versión**: 1.0  
**Autor**: Team Development
