using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Admin;

public sealed class AdminOrderDto
{
    public Guid Id { get; init; }
    public string OrderNo { get; init; } = string.Empty;
    public string CustomerName { get; init; } = string.Empty;
    public string ArtisanName { get; init; } = string.Empty;
    public string ProductName { get; init; } = string.Empty;
    public int Quantity { get; init; }
    public decimal TotalPrice { get; init; }
    public OrderStatus Status { get; init; }
    public DateTime OrderDate { get; init; }
    public string? CancellationReason { get; init; }
    public DateTime? CancellationRequestedAt { get; init; }
}
