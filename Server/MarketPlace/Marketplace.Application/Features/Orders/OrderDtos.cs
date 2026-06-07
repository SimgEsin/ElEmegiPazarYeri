using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Orders;

public sealed class OrderDto
{
    public Guid Id { get; init; }
    public string OrderNo { get; init; } = string.Empty;
    public DateTime OrderDate { get; init; }
    public OrderStatus Status { get; init; }
    public decimal TotalPrice { get; init; }
    public string? CancellationReason { get; init; }
    public DateTime? CancellationRequestedAt { get; init; }
    public IReadOnlyList<OrderItemDto> Items { get; init; } = new List<OrderItemDto>();
}

public sealed class RequestOrderCancellationDto
{
    public required string Reason { get; init; }
}

public sealed class UpdateOrderStatusDto
{
    public required OrderStatus Status { get; init; }
}

public sealed class ArtisanOrderDto
{
    public Guid Id { get; init; }
    public string OrderNo { get; init; } = string.Empty;
    public string CustomerName { get; init; } = string.Empty;
    public string ProductName { get; init; } = string.Empty;
    public int Quantity { get; init; }
    public decimal TotalPrice { get; init; }
    public OrderStatus Status { get; init; }
    public DateTime OrderDate { get; init; }
    public string? CancellationReason { get; init; }
    public DateTime? CancellationRequestedAt { get; init; }
}

public sealed class OrderItemDto
{
    public Guid Id { get; init; }
    public Guid ProductId { get; init; }
    public string ProductName { get; init; } = string.Empty;
    public string? ImageUrl { get; init; }
    public int Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal LineTotal { get; init; }
}
