using System.ComponentModel.DataAnnotations;

namespace OrderManagementAPI.Application.DTOs.Orders;

/// <summary>
/// Representa un artículo individual dentro de un pedido.
/// Contiene información de la descripción, cantidad y precios.
/// </summary>
public class OrderItemDto
{
    /// <summary>ID único del artículo</summary>
    [Display(Description = "Identificador único del artículo")]
    public int Id { get; set; }

    /// <summary>Nombre del producto (ej: "Laptop Dell XPS 15")</summary>
    [Required]
    [Display(Description = "Nombre o descripción del producto")]
    public string ProductName { get; set; } = string.Empty;

    /// <summary>Cantidad de unidades (ej: 2)</summary>
    [Display(Description = "Cantidad de unidades del producto")]
    public int Quantity { get; set; }

    /// <summary>Precio unitario en USD (ej: 1299.99)</summary>
    [Display(Description = "Precio unitario del producto en USD")]
    public decimal UnitPrice { get; set; }

    /// <summary>Precio total del artículo: Quantity × UnitPrice (ej: 2599.98)</summary>
    [Display(Description = "Precio total del artículo (cantidad × precio unitario)")]
    public decimal TotalPrice { get; set; }
}

/// <summary>
/// Solicitud para crear un nuevo pedido.
/// Requiere descripción y lista de artículos (mínimo 1).
/// </summary>
public class CreateOrderRequest
{
    /// <summary>Descripción del pedido (máximo 500 caracteres, requerido)</summary>
    /// <example>Equipamiento para oficina principal - Lote febrero 2026</example>
    [Required(ErrorMessage = "La descripción del pedido es requerida")]
    [StringLength(500, ErrorMessage = "La descripción no debe exceder 500 caracteres")]
    [Display(Description = "Descripción detallada del pedido para referencia")]
    public string Description { get; set; } = string.Empty;

    /// <summary>Lista de artículos del pedido (mínimo 1 artículo, máximo 100)</summary>
    /// <example>[{"productName": "Laptop Dell", "quantity": 2, "unitPrice": 1299.99}]</example>
    [Required(ErrorMessage = "El pedido debe contener al menos un artículo")]
    [MinLength(1, ErrorMessage = "El pedido debe contener al menos un artículo")]
    [MaxLength(100, ErrorMessage = "El pedido no puede contener más de 100 artículos")]
    [Display(Description = "Colección de artículos que conforman el pedido")]
    public List<CreateOrderItemRequest> Items { get; set; } = new List<CreateOrderItemRequest>();
}

/// <summary>
/// Solicitud para agregar un artículo individual a un pedido.
/// Valida que cantidad y precio sean positivos.
/// </summary>
public class CreateOrderItemRequest
{
    /// <summary>Nombre del producto (máximo 200 caracteres, requerido)</summary>
    /// <example>Monitor Samsung 4K 27"</example>
    [Required(ErrorMessage = "El nombre del producto es requerido")]
    [StringLength(200, ErrorMessage = "El nombre del producto no debe exceder 200 caracteres")]
    [Display(Description = "Nombre o descripción detallada del producto")]
    public string ProductName { get; set; } = string.Empty;

    /// <summary>Cantidad a comprar (debe ser > 0, requerido)</summary>
    /// <example>5</example>
    [Required(ErrorMessage = "La cantidad es requerida")]
    [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0")]
    [Display(Description = "Cantidad de unidades a comprar")]
    public int Quantity { get; set; }

    /// <summary>Precio unitario en USD (debe ser > 0, requerido). Máximo 2 decimales.</summary>
    /// <example>349.99</example>
    [Required(ErrorMessage = "El precio unitario es requerido")]
    [Range(0.01, 999999.99, ErrorMessage = "El precio unitario debe ser mayor a 0")]
    [Display(Description = "Precio unitario del producto en dólares USD")]
    public decimal UnitPrice { get; set; }
}

/// <summary>
/// Solicitud para actualizar un pedido existente.
/// Permite modificar descripción, artículos y estado.
/// </summary>
public class UpdateOrderRequest
{
    /// <summary>Nueva descripción del pedido (opcional, máximo 500 caracteres)</summary>
    /// <example>Actualizado: descontar 2 monitores por rotura en transporte</example>
    [StringLength(500, ErrorMessage = "La descripción no debe exceder 500 caracteres")]
    [Display(Description = "Descripción actualizada del pedido (opcional)")]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Nuevo estado del pedido (requerido).
    /// Valores válidos: 0=Pending, 1=Confirmed, 2=Shipped, 3=Delivered, 4=Cancelled
    /// </summary>
    /// <example>2</example>
    [Required(ErrorMessage = "El estado del pedido es requerido")]
    [Range(0, 4, ErrorMessage = "El estado debe estar entre 0 (Pending) y 4 (Cancelled)")]
    [Display(Description = "Estado del pedido (0=Pending, 1=Confirmed, 2=Shipped, 3=Delivered, 4=Cancelled)")]
    public int Status { get; set; }

    /// <summary>Lista actualizada de artículos del pedido (opcional, mínimo 1 si se proporciona)</summary>
    /// <example>[{"productName": "Laptop Actualizada", "quantity": 3, "unitPrice": 1299.99}]</example>
    [Display(Description = "Artículos actualizados del pedido (opcional)")]
    public List<CreateOrderItemRequest>? Items { get; set; }
}

/// <summary>
/// Respuesta que contiene los detalles completos de un pedido.
/// Incluye metadata, artículos, total y fechas de auditoría.
/// </summary>
public class OrderResponse
{
    /// <summary>Identificador único del pedido</summary>
    public int Id { get; set; }

    /// <summary>Número de pedido único (ej: PED-001, PED-002, etc.)</summary>
    public string NumeroPedido { get; set; } = string.Empty;

    /// <summary>Nombre del cliente (usuario que creó el pedido)</summary>
    public string Cliente { get; set; } = string.Empty;

    /// <summary>Fecha de creación del pedido (formato: YYYY-MM-DD)</summary>
    public string Fecha { get; set; } = string.Empty;

    /// <summary>Monto total del pedido</summary>
    public decimal Total { get; set; }

    /// <summary>Estado del pedido como texto (ej: Registrado, Confirmado, Enviado, etc.)</summary>
    public string Estado { get; set; } = string.Empty;

    /// <summary>Descripción del pedido (opcional)</summary>
    public string? Description { get; set; }

    /// <summary>Colección de artículos incluidos en el pedido</summary>
    public List<OrderItemDto> Items { get; set; } = new();
}

/// <summary>
/// DTO mínimo de usuario para incluir en respuestas de pedidos
/// </summary>
public class UserDto
{
    /// <summary>Identificador único del usuario</summary>
    public int Id { get; set; }

    /// <summary>Nombre de usuario</summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>Correo electrónico del usuario</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Rol del usuario</summary>
    public string Role { get; set; } = string.Empty;
}