using OrderManagementAPI.Application.DTOs.Orders;

namespace OrderManagementAPI.Application.Interfaces;

public interface IOrderService
{
    // Operaciones de usuario
    Task<OrderResponse> CreateOrderAsync(int userId, CreateOrderRequest request);
    Task<OrderResponse?> GetOrderByIdAsync(int orderId, int userId);
    Task<List<OrderResponse>> GetOrdersByUserIdAsync(int userId);
    Task<OrderResponse?> UpdateOrderAsync(int orderId, int userId, UpdateOrderRequest request);
    Task<bool> DeleteOrderAsync(int orderId, int userId);

    // Operaciones de Admin
    Task<List<OrderResponse>> GetAllOrdersAsync();
    Task<OrderResponse?> ApproveOrderAsync(int orderId);
    Task<OrderResponse?> RejectOrderAsync(int orderId, string reason);
}
