using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Products.Queries.GetProductById;

public sealed class ProductDetailsDto
{
    public Guid Id { get; init; }
    public Guid ArtisanId { get; init; }
    public Guid CategoryId { get; init; }
    public string Slug { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Summary { get; init; }
    public string? StoryTitle { get; init; }
    public string? StoryContentHtml { get; init; }
    public string? Material { get; init; }
    public string? Technique { get; init; }
    public string? ProductionDurationText { get; init; }
    public string? DeliveryInfoText { get; init; }
    public decimal Price { get; init; }
    public int Stock { get; init; }
    public ProductStatus Status { get; init; }
    public SalesMode SalesMode { get; init; }
    public string? HeightText { get; init; }
    public string? WidthText { get; init; }
    public string? WeightText { get; init; }
    public bool IsSoldOut { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}
