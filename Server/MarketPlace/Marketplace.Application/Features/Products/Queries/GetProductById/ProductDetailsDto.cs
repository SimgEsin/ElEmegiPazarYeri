using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Products.Queries.GetProductById;

public sealed class ProductDetailsDto
{
    public Guid Id { get; init; }
    public Guid ArtisanId { get; init; }
    public string? ArtisanDisplayName { get; init; }
    public string? ArtisanSlug { get; init; }
    public string? ArtisanCraft { get; init; }
    public string? ArtisanBio { get; init; }
    public decimal ArtisanRatingAvg { get; init; }
    public int ArtisanProductCount { get; init; }
    public string? ArtisanAvatarUrl { get; init; }
    public Guid CategoryId { get; init; }
    public string? CategoryName { get; init; }
    public string? CategorySlug { get; init; }
    public string Slug { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Summary { get; init; }
    public string? StoryTitle { get; init; }
    public string? StoryContentHtml { get; init; }
    public string? Quote { get; init; }
    public string? Material { get; init; }
    public string? Technique { get; init; }
    public string? ProductionDurationText { get; init; }
    public string? HandcraftDurationText { get; init; }
    public string? ProductionStepsText { get; init; }
    public IReadOnlyList<string> ProductionSteps =>
        string.IsNullOrWhiteSpace(ProductionStepsText)
            ? new List<string>()
            : ProductionStepsText
                .Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .ToList();
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
    public IReadOnlyList<ProductDetailsImageDto> Images { get; init; } = new List<ProductDetailsImageDto>();
    public IReadOnlyList<ProductDetailsStoryDto> Stories { get; init; } = new List<ProductDetailsStoryDto>();
    public double ReviewAverage { get; init; }
    public int ReviewCount { get; init; }
}

public sealed class ProductDetailsImageDto
{
    public Guid Id { get; init; }
    public ProductImageType Type { get; init; }
    public string Url { get; init; } = string.Empty;
    public string? AltText { get; init; }
    public int SortOrder { get; init; }
}

public sealed class ProductDetailsStoryDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string ContentHtml { get; init; } = string.Empty;
    public string? ImageUrl { get; init; }
    public int SortOrder { get; init; }
}
