using AutoMapper;
using OrderManagementAPI.Application.DTOs.Orders;
using OrderManagementAPI.Application.Interfaces;
using OrderManagementAPI.Domain.Entities;
using OrderManagementAPI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.Retry;

namespace OrderManagementAPI.Infrastructure.Services;

/// <summary>
/// Servicio de lógica de negocio para gestión de pedidos.
/// Implementa validaciones de reglas de negocio, cálculo de totales y soft delete.
/// </summary>
public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<OrderService> _logger;
    private readonly IAsyncPolicy<bool> _resiliencePolicy;

    // Constantes para mensajes y configuración
    private const int MaxRetryAttempts = 3;
    private const int InitialRetryDelayMs = 100;
    private const string OrderNumberPrefix = "ORD";
    private const string OrderNumberDateFormat = "yyyyMMddHHmmss";

    public OrderService(
        ApplicationDbContext context,
        IMapper mapper,
        ILogger<OrderService> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        // Configurar política de reintentos para operaciones de base de datos
        _resiliencePolicy = Policy<bool>
            .Handle<DbUpdateException>()
            .Or<InvalidOperationException>()
            .OrResult(r => !r)
            .WaitAndRetryAsync(
                retryCount: MaxRetryAttempts,
                sleepDurationProvider: attempt =>
                    TimeSpan.FromMilliseconds(InitialRetryDelayMs * Math.Pow(2, attempt - 1)),
                onRetry: (outcome, timespan, retryCount, context) =>
                {
                    _logger.LogWarning(
                        $"[REINTENTOS] Intento {retryCount}/{MaxRetryAttempts} después de {timespan.TotalMilliseconds}ms");
                });
    }

    /// <summary>
    /// Crea un nuevo pedido con sus artículos.
    /// Valida reglas de negocio: total > 0, unicidad de número de pedido, usuario existe.
    /// </summary>
    /// <param name="userId">ID del usuario propietario del pedido</param>
    /// <param name="request">Datos del pedido a crear (descripción e items)</param>
    /// <returns>Respuesta con el pedido creado</returns>
    /// <exception cref="InvalidOperationException">Si falta usuario, items, total es inválido, etc.</exception>
    public async Task<OrderResponse> CreateOrderAsync(int userId, CreateOrderRequest request)
    {
        if (request?.Items == null || request.Items.Count == 0)
        {
            _logger.LogWarning("[VALIDATION] Creación de pedido fallida: sin artículos");
            throw new InvalidOperationException("El pedido debe contener al menos un artículo");
        }

        try
        {
            // Verificar que el usuario existe
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                _logger.LogWarning($"[VALIDATION] Usuario no encontrado: {userId}");
                throw new InvalidOperationException("Usuario no encontrado");
            }

            // Generar y validar número de pedido único
            string orderNumber = GenerateOrderNumber();
            while (await _context.Orders.AnyAsync(o => o.OrderNumber == orderNumber))
            {
                _logger.LogWarning($"[COLLISION] Número de pedido duplicado: {orderNumber}, regenerando...");
                orderNumber = GenerateOrderNumber();
            }

            var order = new Order
            {
                UserId = userId,
                OrderNumber = orderNumber,
                Description = request.Description,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            // Agregar items y calcular total (ignorar items incompletos)
            decimal totalAmount = 0;
            foreach (var itemRequest in request.Items)
            {
                // Ignorar items vacíos (sin nombre de producto)
                if (string.IsNullOrWhiteSpace(itemRequest.ProductName))
                    continue;

                var item = new OrderItem
                {
                    ProductName = itemRequest.ProductName.Trim(),
                    Quantity = itemRequest.Quantity,
                    UnitPrice = itemRequest.UnitPrice,
                    TotalPrice = itemRequest.Quantity * itemRequest.UnitPrice
                };
                order.Items.Add(item);
                totalAmount += item.TotalPrice;
            }

            // Regla de negocio: El total no puede ser menor o igual a 0
            if (totalAmount <= 0)
            {
                _logger.LogWarning($"[BUSINESS_RULE] Intento de crear pedido con total no válido: {totalAmount}");
                throw new InvalidOperationException("El total del pedido debe ser mayor a 0");
            }

            order.TotalAmount = totalAmount;

            _context.Orders.Add(order);
            
            // Usar política de resiliencia para guardar
            await _resiliencePolicy.ExecuteAsync(async () =>
            {
                await _context.SaveChangesAsync();
                return true;
            });

            _logger.LogInformation(
                $"[AUDIT] Pedido creado: {order.OrderNumber} | Usuario={userId} | Total=${totalAmount:F2}");

            // Recargar la orden con el User incluido para el mapeo
            var createdOrder = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == order.Id);

            return _mapper.Map<OrderResponse>(createdOrder);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "[ERROR] Error de BD al crear pedido");
            throw new InvalidOperationException("Error al guardar el pedido en la base de datos", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ERROR] Error al crear pedido: {Message}", ex.Message);
            throw;
        }
    }

    /// <summary>
    /// Obtiene un pedido específico por ID y ID de usuario.
    /// Solo retorna el pedido si pertenece al usuario autenticado y no está eliminado.
    /// </summary>
    /// <param name="orderId">ID del pedido a obtener</param>
    /// <param name="userId">ID del usuario propietario</param>
    /// <returns>Respuesta del pedido o null si no existe o no pertenece al usuario</returns>
    public async Task<OrderResponse?> GetOrderByIdAsync(int orderId, int userId)
    {
        if (orderId <= 0 || userId <= 0)
        {
            _logger.LogWarning("[VALIDATION] ID inválido: OrderId={OrderId}, UserId={UserId}", orderId, userId);
            return null;
        }

        try
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId && !o.IsDeleted);

            if (order == null)
            {
                _logger.LogInformation($"[BUSINESS] Pedido no encontrado: {orderId}");
                return null;
            }

            return _mapper.Map<OrderResponse>(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ERROR] Error al obtener pedido");
            return null;
        }
    }

    /// <summary>
    /// Obtiene todos los pedidos no eliminados de un usuario.
    /// Retorna ordenados por fecha de creación descendente (más recientes primero).
    /// </summary>
    /// <param name="userId">ID del usuario propietario</param>
    /// <returns>Lista de respuestas de pedidos del usuario</returns>
    public async Task<List<OrderResponse>> GetOrdersByUserIdAsync(int userId)
    {
        if (userId <= 0)
        {
            _logger.LogWarning("[VALIDATION] UserId inválido: {UserId}", userId);
            return new List<OrderResponse>();
        }

        try
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId && !o.IsDeleted)
                .Include(o => o.User)
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<OrderResponse>>(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ERROR] Error al listar pedidos del usuario");
            return new List<OrderResponse>();
        }
    }

    /// <summary>
    /// Actualiza un pedido existente (descripción y estado).
    /// Solo permite actualizar si el pedido pertenece al usuario y no está eliminado.
    /// </summary>
    /// <param name="orderId">ID del pedido a actualizar</param>
    /// <param name="userId">ID del usuario propietario</param>
    /// <param name="request">Datos a actualizar</param>
    /// <returns>Respuesta del pedido actualizado o null si no existe</returns>
    public async Task<OrderResponse?> UpdateOrderAsync(int orderId, int userId, UpdateOrderRequest request)
    {
        if (orderId <= 0 || userId <= 0)
        {
            _logger.LogWarning("[VALIDATION] ID inválido para actualizar");
            return null;
        }

        try
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId && !o.IsDeleted);

            if (order == null)
            {
                _logger.LogWarning($"[BUSINESS] Pedido no encontrado para actualizar: {orderId}");
                return null;
            }

            // Actualizar descripción si se proporciona
            if (!string.IsNullOrEmpty(request.Description))
                order.Description = request.Description;

            // Actualizar estado
            order.Status = (OrderStatus)request.Status;

            // Actualizar items si se proporcionan
            if (request.Items != null && request.Items.Count > 0)
            {
                // Eliminar items existentes
                foreach (var oldItem in order.Items.ToList())
                {
                    _context.OrderItems.Remove(oldItem);
                }

                // Crear nuevos items
                decimal total = 0;

                foreach (var itemRequest in request.Items)
                {
                    var newItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductName = itemRequest.ProductName,
                        Quantity = itemRequest.Quantity,
                        UnitPrice = itemRequest.UnitPrice,
                        TotalPrice = itemRequest.Quantity * itemRequest.UnitPrice
                    };
                    order.Items.Add(newItem);
                    total += newItem.TotalPrice;
                }

                order.TotalAmount = total;

                _logger.LogInformation(
                    $"[BUSINESS] Artículos actualizados: Orden={orderId} | Cantidad={request.Items.Count} | Total=${total}");
            }

            order.UpdatedAt = DateTime.UtcNow;

            await _resiliencePolicy.ExecuteAsync(async () =>
            {
                await _context.SaveChangesAsync();
                return true;
            });

            _logger.LogInformation(
                $"[AUDIT] Pedido actualizado: ID={orderId} | Usuario={userId} | Nuevo estado={request.Status} | Items={order.Items.Count}");

            // Recargar la orden actualizada con User incluido para el mapeo
            var updatedOrder = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            return _mapper.Map<OrderResponse>(updatedOrder);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "[ERROR] Error de BD al actualizar pedido");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ERROR] Error al actualizar pedido");
            return null;
        }
    }

    /// <summary>
    /// Realiza soft delete de un pedido (marca como eliminado sin borrar de la BD).
    /// Solo permite eliminar si el pedido pertenece al usuario y no está ya eliminado.
    /// </summary>
    /// <param name="orderId">ID del pedido a eliminar</param>
    /// <param name="userId">ID del usuario propietario</param>
    /// <returns>true si se eliminó exitosamente, false en caso contrario</returns>
    public async Task<bool> DeleteOrderAsync(int orderId, int userId)
    {
        if (orderId <= 0 || userId <= 0)
        {
            _logger.LogWarning("[VALIDATION] ID inválido para eliminar");
            return false;
        }

        try
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId && !o.IsDeleted);

            if (order == null)
            {
                _logger.LogWarning($"[BUSINESS] Pedido no encontrado para eliminar: {orderId}");
                return false;
            }

            order.IsDeleted = true;
            order.DeletedAt = DateTime.UtcNow;
            
            await _resiliencePolicy.ExecuteAsync(async () =>
            {
                await _context.SaveChangesAsync();
                return true;
            });

            _logger.LogInformation($"[AUDIT] Pedido eliminado (soft delete): ID={orderId} | Usuario={userId} | Timestamp={DateTime.UtcNow:O}");
            return true;
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "[ERROR] Error de BD al eliminar pedido");
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ERROR] Error al eliminar pedido");
            return false;
        }
    }

    /// <summary>
    /// Genera un número de pedido único con formato: ORD-yyyyMMddHHmmss-XXXXXXXX.
    /// Combina timestamp y GUID para garantizar unicidad prácticamente imposible de colisionar.
    /// </summary>
    /// <returns>Número de pedido generado</returns>
    private static string GenerateOrderNumber() =>
        $"{OrderNumberPrefix}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString()[..8]}";

    /// <summary>
    /// Obtiene todos los pedidos del sistema (solo para Admin).
    /// Retorna todos los pedidos ordenados por fecha descendente, incluyendo información del usuario.
    /// </summary>
    /// <returns>Lista de todos los pedidos del sistema</returns>
    public async Task<List<OrderResponse>> GetAllOrdersAsync()
    {
        try
        {
            var orders = await _context.Orders
                .Where(o => !o.IsDeleted)
                .Include(o => o.Items)
                .Include(o => o.User)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            _logger.LogInformation($"[AUDIT] Admin obtiene todos los pedidos: Cantidad={orders.Count}");
            return _mapper.Map<List<OrderResponse>>(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ERROR] Error al listar todos los pedidos");
            return new List<OrderResponse>();
        }
    }

    /// <summary>
    /// Aprueba un pedido específico (solo para Admin).
    /// Cambia el estado de aprobación a Approved y registra la fecha de aprobación.
    /// </summary>
    /// <param name="orderId">ID del pedido a aprobar</param>
    /// <returns>Respuesta del pedido aprobado o null si no existe</returns>
    public async Task<OrderResponse?> ApproveOrderAsync(int orderId)
    {
        if (orderId <= 0)
        {
            _logger.LogWarning("[VALIDATION] ID inválido para aprobar");
            return null;
        }

        try
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == orderId && !o.IsDeleted);

            if (order == null)
            {
                _logger.LogWarning($"[BUSINESS] Pedido no encontrado para aprobar: {orderId}");
                return null;
            }

            order.ApprovalStatus = ApprovalStatus.Approved;
            order.ApprovedAt = DateTime.UtcNow;
            order.RejectionReason = null;

            await _resiliencePolicy.ExecuteAsync(async () =>
            {
                await _context.SaveChangesAsync();
                return true;
            });

            _logger.LogInformation($"[AUDIT] Pedido aprobado: ID={orderId} | OrderNumber={order.OrderNumber} | Timestamp={DateTime.UtcNow:O}");
            return _mapper.Map<OrderResponse>(order);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "[ERROR] Error de BD al aprobar pedido");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ERROR] Error al aprobar pedido");
            return null;
        }
    }

    /// <summary>
    /// Rechaza un pedido específico (solo para Admin).
    /// Cambia el estado de aprobación a Rejected y registra la razón del rechazo.
    /// </summary>
    /// <param name="orderId">ID del pedido a rechazar</param>
    /// <param name="reason">Razón del rechazo</param>
    /// <returns>Respuesta del pedido rechazado o null si no existe</returns>
    public async Task<OrderResponse?> RejectOrderAsync(int orderId, string reason)
    {
        if (orderId <= 0)
        {
            _logger.LogWarning("[VALIDATION] ID inválido para rechazar");
            return null;
        }

        if (string.IsNullOrWhiteSpace(reason))
        {
            _logger.LogWarning("[VALIDATION] Razón de rechazo vacía");
            return null;
        }

        try
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == orderId && !o.IsDeleted);

            if (order == null)
            {
                _logger.LogWarning($"[BUSINESS] Pedido no encontrado para rechazar: {orderId}");
                return null;
            }

            order.ApprovalStatus = ApprovalStatus.Rejected;
            order.RejectionReason = reason;
            order.ApprovedAt = null;

            await _resiliencePolicy.ExecuteAsync(async () =>
            {
                await _context.SaveChangesAsync();
                return true;
            });

            _logger.LogInformation($"[AUDIT] Pedido rechazado: ID={orderId} | OrderNumber={order.OrderNumber} | Reason={reason} | Timestamp={DateTime.UtcNow:O}");
            return _mapper.Map<OrderResponse>(order);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "[ERROR] Error de BD al rechazar pedido");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ERROR] Error al rechazar pedido");
            return null;
        }
    }
}
