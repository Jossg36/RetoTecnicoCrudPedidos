using FluentValidation;
using OrderManagementAPI.Application.DTOs.Orders;

namespace OrderManagementAPI.Application.Validators.Orders;

/// <summary>
/// Validador para solicitudes de creación de pedidos.
/// Implementa reglas de negocio: descripción requerida, items no vacíos, total > 0.
/// Ignora items incompletos (sin productName).
/// </summary>
public class CreateOrderValidator : AbstractValidator<CreateOrderRequest>
{
    // Constantes para límites de validación
    private const int MaxDescriptionLength = 500;
    private const decimal MinTotalAmount = 0;

    public CreateOrderValidator()
    {
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("La descripción del pedido es requerida")
            .MaximumLength(MaxDescriptionLength)
            .WithMessage($"La descripción no debe exceder {MaxDescriptionLength} caracteres");

        // Debe haber al menos un item con nombre de producto
        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("El pedido debe contener al menos un artículo")
            .Must(items => items.Any(i => !string.IsNullOrWhiteSpace(i.ProductName)))
            .WithMessage("El pedido debe contener al menos un artículo con nombre de producto");

        // Validar cada item COMPLETO (que tenga productName)
        RuleForEach(x => x.Items)
            .Must(item => string.IsNullOrWhiteSpace(item.ProductName) || item.Quantity > 0)
            .WithMessage("La cantidad debe ser mayor a 0")
            .Must(item => string.IsNullOrWhiteSpace(item.ProductName) || item.UnitPrice > 0)
            .WithMessage("El precio unitario debe ser mayor a 0");

        // Regla de negocio: El total debe ser mayor a 0 (solo items completos)
        RuleFor(x => x.Items)
            .Must(ValidateTotalAmount)
            .WithMessage($"El total del pedido debe ser mayor a {MinTotalAmount}");
    }

    /// <summary>
    /// Valida que el total sumado de todos los items COMPLETOS sea mayor a 0.
    /// Los items incompletos (sin productName) se ignoran para el cálculo.
    /// </summary>
    /// <param name="items">Lista de items del pedido</param>
    /// <returns>true si el total es válido, false en caso contrario</returns>
    private static bool ValidateTotalAmount(List<CreateOrderItemRequest> items)
    {
        if (items == null || items.Count == 0)
            return false;
        
        // Solo contar items que tengan productName (items completos)
        var completeItems = items.Where(i => !string.IsNullOrWhiteSpace(i.ProductName)).ToList();
        
        if (completeItems.Count == 0)
            return false;
            
        decimal total = completeItems.Sum(i => i.Quantity * i.UnitPrice);
        return total > MinTotalAmount;
    }
}

/// <summary>
/// Validador para items individuales dentro de una solicitud de creación de pedido.
/// Valida: nombre de producto, cantidad > 0, precio unitario > 0.
/// </summary>
public class CreateOrderItemValidator : AbstractValidator<CreateOrderItemRequest>
{
    // Constantes para límites de validación
    private const int MaxProductNameLength = 200;
    private const int MinQuantity = 0;
    private const decimal MinUnitPrice = 0m;

    public CreateOrderItemValidator()
    {
        RuleFor(x => x.ProductName)
            .NotEmpty().WithMessage("El nombre del producto es requerido")
            .MaximumLength(MaxProductNameLength)
            .WithMessage($"El nombre del producto no debe exceder {MaxProductNameLength} caracteres");

        RuleFor(x => x.Quantity)
            .GreaterThan(MinQuantity).WithMessage("La cantidad debe ser mayor a 0");

        RuleFor(x => x.UnitPrice)
            .GreaterThan(MinUnitPrice).WithMessage("El precio unitario debe ser mayor a 0");
    }
}

/// <summary>
/// Validador para solicitudes de actualización de pedidos.
/// Valida: descripción (opcional pero con límite), estado válido.
/// </summary>
public class UpdateOrderValidator : AbstractValidator<UpdateOrderRequest>
{
    // Constantes para límites de validación
    private const int MaxDescriptionLength = 500;
    private const int MinOrderStatus = 0;
    private const int MaxOrderStatus = 4;
    private const int MaxProductNameLength = 200;

    public UpdateOrderValidator()
    {
        RuleFor(x => x.Description)
            .MaximumLength(MaxDescriptionLength)
            .WithMessage($"La descripción no debe exceder {MaxDescriptionLength} caracteres")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Status)
            .InclusiveBetween(MinOrderStatus, MaxOrderStatus)
            .WithMessage($"El estado del pedido debe estar entre {MinOrderStatus} y {MaxOrderStatus}");

        // Validar Items si se proporcionan
        RuleFor(x => x.Items)
            .NotEmpty()
            .WithMessage("El pedido debe contener al menos un artículo")
            .When(x => x.Items != null && x.Items.Count > 0);

        RuleForEach(x => x.Items)
            .SetValidator(new CreateOrderItemValidator())
            .When(x => x.Items != null && x.Items.Count > 0);

        // Validar que si hay items, el total sea mayor a 0
        RuleFor(x => x.Items)
            .Must(items => items == null || items.Count == 0 || items.Sum(i => i.Quantity * i.UnitPrice) > 0)
            .WithMessage("El total del pedido debe ser mayor a 0")
            .When(x => x.Items != null && x.Items.Count > 0);
    }
}
