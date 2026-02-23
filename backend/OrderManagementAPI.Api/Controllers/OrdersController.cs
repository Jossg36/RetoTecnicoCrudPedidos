using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using OrderManagementAPI.Application.DTOs.Orders;
using OrderManagementAPI.Application.Interfaces;
using System.Security.Claims;

namespace OrderManagementAPI.Api.Controllers;

/// <summary>
/// Controlador para gestión de pedidos (CRUD).
/// TODOS los endpoints requieren autenticación JWT.
/// Las operaciones se limitan a los pedidos del usuario autenticado (ownership check).
/// </summary>
[ApiController]
[Route("api/{controller}")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IValidator<CreateOrderRequest> _createValidator;
    private readonly IValidator<UpdateOrderRequest> _updateValidator;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(
        IOrderService orderService,
        IValidator<CreateOrderRequest> createValidator,
        IValidator<UpdateOrderRequest> updateValidator,
        ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _logger = logger;
    }

    /// <summary>
    /// ✅ Crea un nuevo pedido con sus artículos asociados.
    /// </summary>
    /// <remarks>
    /// **Autenticación**: Requiere JWT Bearer Token (usuario debe estar logueado)
    /// 
    /// **Reglas de Negocio Implementadas**:
    /// - Descripción requerida (máximo 500 caracteres)
    /// - Mínimo 1 artículo, máximo 100 por pedido
    /// - Cantidad > 0 y precio unitario > 0 para cada artículo
    /// - **Total del pedido DEBE ser > 0** (validación en dos capas)
    /// - Número de pedido único garantizado (formato: ORD-YYYYMMDDHHmmss-XXXXXXXX)
    /// 
    /// **Ejemplo de Solicitud**:
    /// ```json
    /// {
    ///   "description": "Equipamiento para oficina principal",
    ///   "items": [
    ///     {
    ///       "productName": "Laptop Dell XPS 15",
    ///       "quantity": 2,
    ///       "unitPrice": 1299.99
    ///     },
    ///     {
    ///       "productName": "Monitor Samsung 4K 27\"",
    ///       "quantity": 2,
    ///       "unitPrice": 349.99
    ///     }
    ///   ]
    /// }
    /// ```
    /// 
    /// **Estados Iniciales**: El pedido se crea siempre en estado **Pending (0)**
    /// 
    /// **Auditoría**: Se registra la creación con timestamp, usuario, total y cantidad de items
    /// </remarks>
    /// <param name="request">Datos del pedido (descripción e items)</param>
    /// <returns>Pedido creado con ID, número único, estado y total calculado</returns>
    /// <response code="201">Pedido creado exitosamente. Retorna Location header con URI.</response>
    /// <response code="400">Validación fallida (descripción vacía, total <= 0, items incompletos, etc).</response>
    /// <response code="401">Token no válido o expirado.</response>
    /// <response code="500">Error interno del servidor.</response>
    [HttpPost]
    public async Task<ActionResult<OrderResponse>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        try
        {
            // Extraer UserId del JWT token
            var userId = GetUserIdFromToken();
            if (userId == 0)
            {
                _logger.LogWarning("[SECURITY] Intento de crear pedido con token inválido");
                return Unauthorized(new { message = "Token inválido o expirado" });
            }

            // Validar modelo de entrada usando FluentValidation
            var validationResult = await _createValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning($"Validación fallida al crear pedido para usuario {userId}");
                return BadRequest(new 
                { 
                    success = false,
                    message = "Datos del pedido inválidos",
                    errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList()
                });
            }

            // Crear pedido en base de datos
            var order = await _orderService.CreateOrderAsync(userId, request);
            
            _logger.LogInformation($"[AUDIT] Pedido creado: Número={order.NumeroPedido} | Usuario={userId} | Total=${order.Total:F2} | Items={order.Items.Count} | Timestamp={DateTime.UtcNow:O}");
            
            // Retornar 201 Created con URI del nuevo recurso
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Excepción al crear pedido: {ex.Message}");
            return StatusCode(500, new 
            { 
                success = false,
                message = "Error al crear pedido",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// 📋 Obtiene la lista completa de pedidos del usuario autenticado.
    /// </summary>
    /// <remarks>
    /// **Autenticación**: Requiere JWT Bearer Token
    /// 
    /// **Características**:
    /// - Solo retorna pedidos que pertenecen al usuario autenticado (ownership check)
    /// - Excluye automáticamente pedidos eliminados (soft delete)
    /// - Ordenados por fecha de creación descendente (más recientes primero)
    /// - Incluye todos los artículos asociados a cada pedido
    /// - Puede retornar lista vacía si no hay pedidos
    /// 
    /// **Ejemplo de Respuesta**:
    /// ```json
    /// [
    ///   {
    ///     "id": 1,
    ///     "userId": 42,
    ///     "orderNumber": "ORD-20260223143045-a7b8c9d1",
    ///     "status": 1,
    ///     "totalAmount": 2999.96,
    ///     "description": "Equipamiento para oficina",
    ///     "createdAt": "2026-02-23T14:30:45.123Z",
    ///     "updatedAt": null,
    ///     "items": [
    ///       {
    ///         "id": 10,
    ///         "productName": "Laptop Dell XPS 15",
    ///         "quantity": 2,
    ///         "unitPrice": 1299.99,
    ///         "totalPrice": 2599.98
    ///       }
    ///     ]
    ///   }
    /// ]
    /// ```
    /// </remarks>
    /// <returns>Lista de pedidos del usuario (puede estar vacía)</returns>
    /// <response code="200">Lista de pedidos obtenida exitosamente (puede estar vacía: []).</response>
    /// <response code="401">Token no válido o expirado.</response>
    /// <response code="500">Error interno del servidor.</response>
    [HttpGet]
    public async Task<ActionResult<List<OrderResponse>>> GetMyOrders()
    {
        try
        {
            // Extraer y validar UserId del token
            var userId = GetUserIdFromToken();
            if (userId == 0)
            {
                _logger.LogWarning("[SECURITY] Intento de listar pedidos con token inválido");
                return Unauthorized(new { message = "Token inválido o expirado" });
            }

            // Obtener todos los pedidos del usuario
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            
            _logger.LogInformation($"[AUDIT] Pedidos listados: Usuario={userId} | Cantidad={orders.Count} | Timestamp={DateTime.UtcNow:O}");
            
            return Ok(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Excepción al listar pedidos: {ex.Message}");
            return StatusCode(500, new 
            { 
                success = false,
                message = "Error al obtener pedidos",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// 🔍 Obtiene los detalles de un pedido específico por su ID.
    /// </summary>
    /// <remarks>
    /// **Autenticación**: Requiere JWT Bearer Token
    /// 
    /// **Seguridad**: Solo el propietario del pedido puede acceder a él
    /// - Si intentas acceder a un pedido de otro usuario, retorna 404 Not Found
    /// - Los pedidos eliminados (soft delete) también retornan 404
    /// 
    /// **Contenido Retornado**:
    /// - Metadata completa del pedido (ID, número, estado, totales)
    /// - Todos los artículos asociados con precios individuales y totales
    /// - Fechas de creación y última actualización (si aplica)
    /// - UserId para referencia
    /// </remarks>
    /// <param name="id">ID único del pedido a obtener</param>
    /// <returns>Detalles completos del pedido incluyendo artículos</returns>
    /// <response code="200">Pedido obtenido exitosamente con todos sus detalles.</response>
    /// <response code="401">Token no válido o expirado.</response>
    /// <response code="404">Pedido no encontrado, no pertenece al usuario, o fue eliminado.</response>
    /// <response code="500">Error interno del servidor.</response>
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponse>> GetOrder(int id)
    {
        try
        {
            // Validar token y obtener UserId
            var userId = GetUserIdFromToken();
            if (userId == 0)
            {
                _logger.LogWarning("[SECURITY] Intento de obtener pedido con token inválido");
                return Unauthorized(new { message = "Token inválido o expirado" });
            }

            // Obtener pedido (solo si pertenece al usuario autenticado)
            var order = await _orderService.GetOrderByIdAsync(id, userId);
            
            if (order == null)
            {
                _logger.LogWarning($"[SECURITY] Intento de acceso a pedido inexistente o no autorizado: PedidoID={id} | Usuario={userId}");
                return NotFound(new 
                { 
                    success = false,
                    message = "Pedido no encontrado"
                });
            }

            _logger.LogInformation($"[AUDIT] Pedido obtenido: PedidoID={id} | Usuario={userId} | Timestamp={DateTime.UtcNow:O}");
            
            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Excepción al obtener pedido: {ex.Message}");
            return StatusCode(500, new 
            { 
                success = false,
                message = "Error al obtener pedido",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// ✏️ Actualiza un pedido existente (descripción y estado).
    /// </summary>
    /// <remarks>
    /// **Autenticación**: Requiere JWT Bearer Token
    /// 
    /// **Limitaciones de Actualización**:
    /// - ✅ Puedes modificar la descripción del pedido
    /// - ✅ Puedes cambiar el estado del pedido (Pending → Shipped → Delivered, etc)
    /// - ❌ NO se pueden actualizar artículos (debes eliminar y crear nuevo pedido si necesitas)
    /// - ❌ NO se puede cambiar UserId ni OrderNumber (auditoría inmutable)
    /// - ❌ NO se puede cambiar TotalAmount (se calcula automático de items)
    /// 
    /// **Estados Válidos**:
    /// - 0 = Pending (Pendiente)
    /// - 1 = Confirmed (Confirmado) 
    /// - 2 = Shipped (Enviado)
    /// - 3 = Delivered (Entregado)
    /// - 4 = Cancelled (Cancelado)
    /// 
    /// **Ejemplo de Solicitud**:
    /// ```json
    /// {
    ///   "description": "Equipamiento actualizado - Se descuenta 1 monitor",
    ///   "status": 2
    /// }
    /// ```
    /// 
    /// **Auditoría**: Se actualiza automáticamente el campo UpdatedAt con timestamp actual
    /// </remarks>
    /// <param name="id">ID del pedido a actualizar</param>
    /// <param name="request">Datos a actualizar (descripción, estado)</param>
    /// <returns>Pedido actualizado con nuevos valores</returns>
    /// <response code="200">Pedido actualizado exitosamente.</response>
    /// <response code="400">Validación fallida (estado inválido, descripción muy larga, etc).</response>
    /// <response code="401">Token no válido o expirado.</response>
    /// <response code="404">Pedido no encontrado o pertenece a otro usuario.</response>
    /// <response code="500">Error interno del servidor.</response>
    [HttpPut("{id}")]
    public async Task<ActionResult<OrderResponse>> UpdateOrder(int id, [FromBody] UpdateOrderRequest request)
    {
        try
        {
            // Validar token y obtener UserId
            var userId = GetUserIdFromToken();
            if (userId == 0)
            {
                _logger.LogWarning("[SECURITY] Intento de actualizar pedido con token inválido");
                return Unauthorized(new { message = "Token inválido o expirado" });
            }

            // Validar datos de entrada
            var validationResult = await _updateValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning($"Validación fallida al actualizar pedido {id}");
                return BadRequest(new 
                { 
                    success = false,
                    message = "Datos de actualización inválidos",
                    errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList()
                });
            }

            // Actualizar pedido en base de datos
            var order = await _orderService.UpdateOrderAsync(id, userId, request);
            
            if (order == null)
            {
                _logger.LogWarning($"[SECURITY] Intento de actualizar pedido inexistente o no autorizado: PedidoID={id} | Usuario={userId}");
                return NotFound(new 
                { 
                    success = false,
                    message = "Pedido no encontrado"
                });
            }

            _logger.LogInformation($"[AUDIT] Pedido actualizado: PedidoID={id} | Usuario={userId} | NuevoEstado={request.Status} | Timestamp={DateTime.UtcNow:O}");
            
            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Excepción al actualizar pedido: {ex.Message}");
            return StatusCode(500, new 
            { 
                success = false,
                message = "Error al actualizar pedido",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// 🗑️ Elimina un pedido (soft delete - eliminación lógica).
    /// </summary>
    /// <remarks>
    /// **Autenticación**: Requiere JWT Bearer Token
    /// 
    /// **Tipo de Eliminación**: SOFT DELETE (Eliminación Lógica)
    /// - ✅ El pedido NO se borra físicamente de la base de datos
    /// - ✅ Se marca como eliminado (IsDeleted = true)
    /// - ✅ Se registra automáticamente DeletedAt con timestamp
    /// - ✅ Preserva datos para auditoría y recuperación potencial
    /// - ✅ El pedido no aparece en listados (GetMyOrders excluye IsDeleted)
    /// 
    /// **Restricciones**:
    /// - Solo el propietario puede eliminar su pedido
    /// - Pedidos ya eliminados retornan 404 (no se pueden "eliminar dos veces")
    /// - La eliminación es irreversible desde la API (requiere intervención de DBA para revertir)
    /// 
    /// **Respuesta**: Retorna 204 No Content (respuesta estándar HTTP para DELETE exitoso)
    /// - NO contiene cuerpo de respuesta
    /// - Verificar status 204 para confirmar éxito
    /// 
    /// **Auditoría Completa**:
    /// - Fecha exacta de eliminación (DeletedAt)
    /// - UserId del usuario que eliminó
    /// - Todos los datos originales preservados para auditoría
    /// - Logs registran la operación con [AUDIT] tag
    /// </remarks>
    /// <param name="id">ID del pedido a eliminar</param>
    /// <returns>Sin contenido (204 No Content)</returns>
    /// <response code="204">Pedido eliminado exitosamente (soft delete).</response>
    /// <response code="401">Token no válido o expirado.</response>
    /// <response code="404">Pedido no encontrado, pertenece a otro usuario, o ya fue eliminado.</response>
    /// <response code="500">Error interno del servidor.</response>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        try
        {
            // Validar token y obtener UserId
            var userId = GetUserIdFromToken();
            if (userId == 0)
            {
                _logger.LogWarning("[SECURITY] Intento de eliminar pedido con token inválido");
                return Unauthorized(new { message = "Token inválido o expirado" });
            }

            // Eliminar pedido (solo si pertenece al usuario autenticado)
            var deleted = await _orderService.DeleteOrderAsync(id, userId);
            
            if (!deleted)
            {
                _logger.LogWarning($"[SECURITY] Intento de eliminar pedido inexistente o no autorizado: PedidoID={id} | Usuario={userId}");
                return NotFound(new 
                { 
                    success = false,
                    message = "Pedido no encontrado"
                });
            }

            _logger.LogInformation($"[AUDIT] Pedido eliminado: PedidoID={id} | Usuario={userId} | Timestamp={DateTime.UtcNow:O}");
            
            // 204 No Content es la respuesta estándar para DELETE exitoso
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Excepción al eliminar pedido: {ex.Message}");
            return StatusCode(500, new 
            { 
                success = false,
                message = "Error al eliminar pedido",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// 📊 Obtiene todos los pedidos del sistema (solo para Administrador).
    /// </summary>
    /// <remarks>
    /// **Restricción**: Solo usuarios con rol **Admin** pueden acceder.
    /// 
    /// **Features**:
    /// - Retorna todos los pedidos de todos los usuarios
    /// - Ordenados por fecha de creación descendente
    /// - Incluye información del usuario que registró el pedido
    /// - Excluye pedidos eliminados (soft delete)
    /// - Muestra estado de aprobación del admin
    /// 
    /// **Estados de Aprobación**: Pending, Approved, Rejected
    /// </remarks>
    /// <returns>Lista de todos los pedidos del sistema</returns>
    /// <response code="200">Lista obtenida exitosamente</response>
    /// <response code="401">Token no válido o expirado</response>
    /// <response code="403">Usuario no tiene rol de Admin</response>
    [HttpGet("admin/all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<OrderResponse>>> GetAllOrders()
    {
        try
        {
            var userId = GetUserIdFromToken();
            if (userId == 0)
            {
                _logger.LogWarning("[SECURITY] Intento de listar todos los pedidos con token inválido");
                return Unauthorized(new { message = "Token inválido o expirado" });
            }

            // Obtener todos los pedidos
            var orders = await _orderService.GetAllOrdersAsync();
            
            _logger.LogInformation($"[AUDIT] Admin lista todos los pedidos: Admin={userId} | Cantidad={orders.Count} | Timestamp={DateTime.UtcNow:O}");
            
            return Ok(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Excepción al listar todos los pedidos: {ex.Message}");
            return StatusCode(500, new 
            { 
                success = false,
                message = "Error al obtener pedidos",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// ✅ Aprueba un pedido específico (solo para Administrador).
    /// </summary>
    /// <remarks>
    /// **Restricción**: Solo usuarios con rol **Admin** pueden acceder.
    /// 
    /// **Funcionalidad**:
    /// - Cambia el estado de ApprovalStatus de Pending a Approved
    /// - Registra la fecha de aprobación (ApprovedAt)
    /// - Limpia cualquier razón de rechazo previo
    /// 
    /// **Auditoría**: Se registra quién aprobó, fecha y hora exacta
    /// </remarks>
    /// <param name="id">ID del pedido a aprobar</param>
    /// <returns>Pedido actualizado con estado Approved</returns>
    /// <response code="200">Pedido aprobado exitosamente</response>
    /// <response code="401">Token no válido o expirado</response>
    /// <response code="403">Usuario no tiene rol de Admin</response>
    /// <response code="404">Pedido no encontrado</response>
    [HttpPost("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<OrderResponse>> ApproveOrder(int id)
    {
        try
        {
            var userId = GetUserIdFromToken();
            if (userId == 0)
            {
                _logger.LogWarning("[SECURITY] Intento de aprobar pedido con token inválido");
                return Unauthorized(new { message = "Token inválido o expirado" });
            }

            // Aprobar pedido
            var order = await _orderService.ApproveOrderAsync(id);
            
            if (order == null)
            {
                _logger.LogWarning($"[SECURITY] Intento de aprobar pedido inexistente: PedidoID={id} | Admin={userId}");
                return NotFound(new 
                { 
                    success = false,
                    message = "Pedido no encontrado"
                });
            }

            _logger.LogInformation($"[AUDIT] Pedido aprobado: PedidoID={id} | Admin={userId} | NumeroPedido={order.NumeroPedido} | Timestamp={DateTime.UtcNow:O}");
            
            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Excepción al aprobar pedido: {ex.Message}");
            return StatusCode(500, new 
            { 
                success = false,
                message = "Error al aprobar pedido",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// ❌ Rechaza un pedido específico (solo para Administrador).
    /// </summary>
    /// <remarks>
    /// **Restricción**: Solo usuarios con rol **Admin** pueden acceder.
    /// 
    /// **Funcionalidad**:
    /// - Cambia el estado de ApprovalStatus de Pending a Rejected
    /// - Permite incluir una razón de rechazo (motivo)
    /// - Limpia la fecha de aprobación si existía
    /// 
    /// **Auditoría**: Se registra quién rechazó, razón, fecha y hora
    /// </remarks>
    /// <param name="id">ID del pedido a rechazar</param>
    /// <param name="request">Datos de rechazo (razón)</param>
    /// <returns>Pedido actualizado con estado Rejected</returns>
    /// <response code="200">Pedido rechazado exitosamente</response>
    /// <response code="401">Token no válido o expirado</response>
    /// <response code="403">Usuario no tiene rol de Admin</response>
    /// <response code="404">Pedido no encontrado</response>
    [HttpPost("{id}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<OrderResponse>> RejectOrder(int id, [FromBody] RejectOrderRequest request)
    {
        try
        {
            var userId = GetUserIdFromToken();
            if (userId == 0)
            {
                _logger.LogWarning("[SECURITY] Intento de rechazar pedido con token inválido");
                return Unauthorized(new { message = "Token inválido o expirado" });
            }

            // Validar que la razón no sea vacía
            if (string.IsNullOrWhiteSpace(request?.Reason))
            {
                return BadRequest(new 
                { 
                    success = false,
                    message = "Debe proporcionar una razón de rechazo"
                });
            }

            // Rechazar pedido
            var order = await _orderService.RejectOrderAsync(id, request.Reason);
            
            if (order == null)
            {
                _logger.LogWarning($"[SECURITY] Intento de rechazar pedido inexistente: PedidoID={id} | Admin={userId}");
                return NotFound(new 
                { 
                    success = false,
                    message = "Pedido no encontrado"
                });
            }

            _logger.LogInformation($"[AUDIT] Pedido rechazado: PedidoID={id} | Admin={userId} | NumeroPedido={order.NumeroPedido} | Reason={request.Reason} | Timestamp={DateTime.UtcNow:O}");
            
            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Excepción al rechazar pedido: {ex.Message}");
            return StatusCode(500, new 
            { 
                success = false,
                message = "Error al rechazar pedido",
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Extrae y valida el UserId del JWT token.
    /// Este método garantiza que solo usuarios autenticados accedan al CRUD.
    /// </summary>
    /// <remarks>
    /// Busca el claim ClaimTypes.NameIdentifier en el token JWT.
    /// El claim se agregó durante el login en JwtTokenService.
    /// Retorna 0 si no encuentra el claim o no es convertible a int.
    /// Este método es reutilizable en todos los endpoints protegidos.
    /// </remarks>
    /// <returns>UserId si es válido, 0 si no lo es</returns>
    private int GetUserIdFromToken()
    {
        // El claim NameIdentifier se agregó durante el login en JwtTokenService
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out int userId) ? userId : 0;
    }
}

/// <summary>
/// DTO para solicitar rechazo de un pedido
/// </summary>
public class RejectOrderRequest
{
    public string Reason { get; set; } = string.Empty;
}
