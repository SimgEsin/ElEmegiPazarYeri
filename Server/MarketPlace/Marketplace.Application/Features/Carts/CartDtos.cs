namespace Marketplace.Application.Features.Carts;

public sealed class CartDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public IReadOnlyList<CartItemDto> Items { get; init; } = new List<CartItemDto>();
    public decimal TotalPrice { get; init; }
}

public sealed class CartItemDto
{
    public Guid Id { get; init; }
    public Guid ProductId { get; init; }
    public string ProductName { get; init; } = string.Empty;
    public string? ImageUrl { get; init; }
    public int Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal TotalPrice { get; init; }
}

public sealed class AddToCartDto
{
    public required Guid ProductId { get; init; }
    public int Quantity { get; init; }
}
