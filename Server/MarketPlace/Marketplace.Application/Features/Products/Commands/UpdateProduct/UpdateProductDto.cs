using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Products.Commands.UpdateProduct;

public sealed class UpdateProductDto
{
    public required string Name { get; init; }
    public required Guid CategoryId { get; init; }
    public required decimal Price { get; init; }
    public ProductStatus Status { get; init; }
    public SalesMode SalesMode { get; init; }
    public string Slug { get; init; } = string.Empty;
    public string? Summary { get; init; }
    public string? StoryTitle { get; init; }
    public string? StoryContentHtml { get; init; }
    public string? Material { get; init; }
    public string? Technique { get; init; }
    public string? ProductionDurationText { get; init; }
    public string? HandcraftDurationText { get; init; }
    public string? Quote { get; init; }
    public string? ProductionStepsText { get; init; }
    public string? DeliveryInfoText { get; init; }
    public int Stock { get; init; }
    public string? HeightText { get; init; }
    public string? WidthText { get; init; }
    public string? WeightText { get; init; }
    public bool IsSoldOut { get; init; }
}
