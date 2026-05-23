using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.ProductImages;

public sealed class ProductImageDto
{
    public Guid Id { get; init; }
    public Guid ProductId { get; init; }
    public ProductImageType Type { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Url { get; init; } = string.Empty;
    public string? AltText { get; init; }
    public int SortOrder { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}

public sealed class CreateProductImageDto
{
    public required Guid ProductId { get; init; }
    public ProductImageType Type { get; init; } = ProductImageType.Gallery;
    public required string Name { get; init; }
    public required string Url { get; init; }
    public string? AltText { get; init; }
    public int SortOrder { get; init; }
}

public sealed class UpdateProductImageDto
{
    public required Guid ProductId { get; init; }
    public ProductImageType Type { get; init; } = ProductImageType.Gallery;
    public required string Name { get; init; }
    public required string Url { get; init; }
    public string? AltText { get; init; }
    public int SortOrder { get; init; }
}
