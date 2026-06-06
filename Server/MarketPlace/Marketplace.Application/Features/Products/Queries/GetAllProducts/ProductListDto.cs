using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Products.Queries.GetAllProducts;

public sealed class ProductListDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public ProductStatus Status { get; init; }
    public SalesMode SalesMode { get; init; }
    public int Stock { get; init; }
    public bool IsSoldOut { get; init; }
    public string? Summary { get; init; }
    public Guid CategoryId { get; init; }
    public string? CategoryName { get; init; }
    public string? CategorySlug { get; init; }
    public Guid ArtisanId { get; init; }
    public string? ArtisanDisplayName { get; init; }
    public string? ArtisanSlug { get; init; }
    public string? PrimaryImageUrl { get; init; }
}
