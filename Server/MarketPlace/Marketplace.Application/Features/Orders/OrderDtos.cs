using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Orders;

public sealed class OrderDto
{
    public Guid Id { get; init; }
    public string OrderNo { get; init; } = string.Empty;
    public DateTime OrderDate { get; init; }
    public OrderStatus Status { get; init; }
    public decimal TotalPrice { get; init; }
    public IReadOnlyList<OrderItemDto> Items { get; init; } = new List<OrderItemDto>();
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
