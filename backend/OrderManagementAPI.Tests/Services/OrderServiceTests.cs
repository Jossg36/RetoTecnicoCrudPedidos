using Xunit;
using Moq;
using FluentAssertions;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OrderManagementAPI.Application.DTOs.Orders;
using OrderManagementAPI.Application.Interfaces;
using OrderManagementAPI.Domain.Entities;
using OrderManagementAPI.Infrastructure.Data;
using OrderManagementAPI.Infrastructure.Services;

namespace OrderManagementAPI.Tests.Services;

/// <summary>
/// Pruebas unitarias para OrderService
/// Cubre: CRUD de órdenes, soft delete, validación de negocio
/// </summary>
public class OrderServiceTests
{
    private readonly ApplicationDbContext _context;
    private readonly Mock<ILogger<OrderService>> _loggerMock;
    private readonly OrderService _orderService;

    public OrderServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _loggerMock = new Mock<ILogger<OrderService>>();

        _orderService = new OrderService(_context, _loggerMock.Object);
    }

    #region GetOrderById

    [Fact]
    public async Task GetOrderByIdAsync_WithValidId_ReturnsOrder()
    {
        // Arrange
        var user = new User { Username = "testuser", Email = "test@example.com", PasswordHash = "$2a$12$hash" };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var order = new Order
        {
            UserId = user.Id,
            OrderNumber = Guid.NewGuid().ToString(),
            Description = "Test Order",
            Status = 0,  // Pending
            TotalAmount = 100.00m,
            IsDeleted = false
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Act
        var result = await _orderService.GetOrderByIdAsync(order.Id, user.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(order.Id);
        result.OrderNumber.Should().Be(order.OrderNumber);
        result.Description.Should().Be("Test Order");
    }

    [Fact]
    public async Task GetOrderByIdAsync_WithDeletedOrder_ReturnsNull()
    {
        // Arrange
        var user = new User { Username = "testuser", Email = "test@example.com", PasswordHash = "$2a$12$hash" };
        _context.Users.Add(user);

        var order = new Order
        {
            UserId = user.Id,
            OrderNumber = Guid.NewGuid().ToString(),
            Description = "Deleted Order",
            Status = 0,
            TotalAmount = 100.00m,
            IsDeleted = true,  // ← Eliminado lógicamente
            DeletedAt = DateTime.UtcNow
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Act
        var result = await _orderService.GetOrderByIdAsync(order.Id, user.Id);

        // Assert
        result.Should().BeNull();  // No retorna órdenes eliminadas
    }

    [Fact]
    public async Task GetOrderByIdAsync_WithDifferentUser_ReturnsNull()
    {
        // Arrange
        var user1 = new User { Username = "user1", Email = "user1@example.com", PasswordHash = "$2a$12$hash" };
        var user2 = new User { Username = "user2", Email = "user2@example.com", PasswordHash = "$2a$12$hash" };
        _context.Users.AddRange(user1, user2);

        var order = new Order
        {
            UserId = user1.Id,
            OrderNumber = Guid.NewGuid().ToString(),
            Description = "User1 Order",
            Status = 0,
            TotalAmount = 100.00m
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Act
        var result = await _orderService.GetOrderByIdAsync(order.Id, user2.Id);  // ← User2 intenta acceder

        // Assert
        result.Should().BeNull();  // No permite acceso cruzado
    }

    #endregion

    #region CreateOrder

    [Fact]
    public async Task CreateOrderAsync_WithValidData_CreatesOrder()
    {
        // Arrange
        var user = new User { Username = "testuser", Email = "test@example.com", PasswordHash = "$2a$12$hash" };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var createRequest = new CreateOrderRequest
        {
            Description = "New Order",
            Items = new List<CreateOrderItemRequest>
            {
                new() { ProductName = "Product A", Quantity = 2, UnitPrice = 50.00m },
                new() { ProductName = "Product B", Quantity = 1, UnitPrice = 100.00m }
            }
        };

        // Act
        var result = await _orderService.CreateOrderAsync(user.Id, createRequest);

        // Assert
        result.Should().NotBeNull();
        result!.Description.Should().Be("New Order");
        result.TotalAmount.Should().Be(200.00m);  // (2*50) + (1*100)
        result.Items.Should().HaveCount(2);
    }

    [Fact]
    public async Task CreateOrderAsync_WithTotalZero_FailsValidation()
    {
        // Arrange
        var user = new User { Username = "testuser", Email = "test@example.com", PasswordHash = "$2a$12$hash" };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var createRequest = new CreateOrderRequest
        {
            Description = "Zero Total Order",
            Items = new List<CreateOrderItemRequest>
            {
                new() { ProductName = "Product", Quantity = 0, UnitPrice = 0.00m }
            }
        };

        // Act
        var result = await _orderService.CreateOrderAsync(user.Id, createRequest);

        // Assert
        result.Should().BeNull();  // Validación fallida
    }

    #endregion

    #region UpdateOrder

    [Fact]
    public async Task UpdateOrderAsync_WithValidData_UpdatesOrder()
    {
        // Arrange
        var user = new User { Username = "testuser", Email = "test@example.com", PasswordHash = "$2a$12$hash" };
        _context.Users.Add(user);

        var order = new Order
        {
            UserId = user.Id,
            OrderNumber = Guid.NewGuid().ToString(),
            Description = "Original Description",
            Status = 0,
            TotalAmount = 100.00m
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var updateRequest = new UpdateOrderRequest
        {
            Description = "Updated Description",
            Status = 1  // Cambiar a Confirmed
        };

        // Act
        var result = await _orderService.UpdateOrderAsync(order.Id, user.Id, updateRequest);

        // Assert
        result.Should().NotBeNull();
        result!.Description.Should().Be("Updated Description");
        result.Status.Should().Be(1);
    }

    [Fact]
    public async Task UpdateOrderAsync_WithDeletedOrder_ReturnsNull()
    {
        // Arrange
        var user = new User { Username = "testuser", Email = "test@example.com", PasswordHash = "$2a$12$hash" };
        _context.Users.Add(user);

        var order = new Order
        {
            UserId = user.Id,
            OrderNumber = Guid.NewGuid().ToString(),
            Description = "Deleted",
            Status = 0,
            TotalAmount = 100.00m,
            IsDeleted = true,
            DeletedAt = DateTime.UtcNow
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var updateRequest = new UpdateOrderRequest
        {
            Description = "Cannot Update",
            Status = 1
        };

        // Act
        var result = await _orderService.UpdateOrderAsync(order.Id, user.Id, updateRequest);

        // Assert
        result.Should().BeNull();
    }

    #endregion

    #region DeleteOrder (Soft Delete)

    [Fact]
    public async Task DeleteOrderAsync_WithValidId_SoftDeletesOrder()
    {
        // Arrange
        var user = new User { Username = "testuser", Email = "test@example.com", PasswordHash = "$2a$12$hash" };
        _context.Users.Add(user);

        var order = new Order
        {
            UserId = user.Id,
            OrderNumber = Guid.NewGuid().ToString(),
            Description = "To Delete",
            Status = 0,
            TotalAmount = 100.00m,
            IsDeleted = false
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Act
        var result = await _orderService.DeleteOrderAsync(order.Id, user.Id);

        // Assert
        result.Should().BeTrue();

        // Verifica que se marcó como eliminado
        var deletedOrder = await _context.Orders.FirstOrDefaultAsync(o => o.Id == order.Id);
        deletedOrder.Should().NotBeNull();
        deletedOrder!.IsDeleted.Should().BeTrue();
        deletedOrder.DeletedAt.Should().NotBeNull();
    }

    [Fact]
    public async Task DeleteOrderAsync_WithDifferentUser_ReturnsFalse()
    {
        // Arrange
        var user1 = new User { Username = "user1", Email = "user1@example.com", PasswordHash = "$2a$12$hash" };
        var user2 = new User { Username = "user2", Email = "user2@example.com", PasswordHash = "$2a$12$hash" };
        _context.Users.AddRange(user1, user2);

        var order = new Order
        {
            UserId = user1.Id,
            OrderNumber = Guid.NewGuid().ToString(),
            Description = "User1 Order",
            Status = 0,
            TotalAmount = 100.00m
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Act
        var result = await _orderService.DeleteOrderAsync(order.Id, user2.Id);  // ← User2 intenta eliminar

        // Assert
        result.Should().BeFalse();  // No permite eliminación cruzada
    }

    #endregion

    #region GetOrdersByUserId

    [Fact]
    public async Task GetOrdersByUserIdAsync_ReturnsOnlyActiveOrders()
    {
        // Arrange
        var user = new User { Username = "testuser", Email = "test@example.com", PasswordHash = "$2a$12$hash" };
        _context.Users.Add(user);

        var activeOrder = new Order
        {
            UserId = user.Id,
            OrderNumber = "ORD-001",
            Description = "Active",
            Status = 0,
            TotalAmount = 100.00m,
            IsDeleted = false
        };

        var deletedOrder = new Order
        {
            UserId = user.Id,
            OrderNumber = "ORD-002",
            Description = "Deleted",
            Status = 0,
            TotalAmount = 50.00m,
            IsDeleted = true,
            DeletedAt = DateTime.UtcNow
        };

        _context.Orders.AddRange(activeOrder, deletedOrder);
        await _context.SaveChangesAsync();

        // Act
        var result = await _orderService.GetOrdersByUserIdAsync(user.Id);

        // Assert
        result.Should().HaveCount(1);
        result[0].OrderNumber.Should().Be("ORD-001");
        result.All(o => !o.IsDeleted).Should().BeTrue();
    }

    #endregion
}
