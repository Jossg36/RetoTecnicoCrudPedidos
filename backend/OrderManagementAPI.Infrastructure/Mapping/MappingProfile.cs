using AutoMapper;
using OrderManagementAPI.Application.DTOs.Auth;
using OrderManagementAPI.Application.DTOs.Orders;
using OrderManagementAPI.Domain.Entities;

namespace OrderManagementAPI.Infrastructure.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserResponse>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

        // Order mappings
        CreateMap<Order, OrderResponse>()
            .ForMember(dest => dest.NumeroPedido, opt => opt.MapFrom(src => src.OrderNumber))
            .ForMember(dest => dest.Cliente, opt => opt.MapFrom(src => src.User != null ? src.User.Username : "Sin asignar"))
            .ForMember(dest => dest.Fecha, opt => opt.MapFrom(src => src.CreatedAt.ToString("yyyy-MM-dd")))
            .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.TotalAmount))
            .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => GetStatusLabel(src.Status)))
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items));

        // OrderItem mappings - Asegurar que TotalPrice siempre se calcula
        CreateMap<OrderItem, OrderItemDto>()
            .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.TotalPrice > 0 ? src.TotalPrice : (src.Quantity * src.UnitPrice)))
            .ReverseMap();
    }

    private static string GetStatusLabel(OrderStatus status)
    {
        return status switch
        {
            OrderStatus.Pending => "Registrado",
            OrderStatus.Confirmed => "Confirmado",
            OrderStatus.Shipped => "Enviado",
            OrderStatus.Delivered => "Entregado",
            OrderStatus.Cancelled => "Cancelado",
            _ => "Desconocido"
        };
    }
}

