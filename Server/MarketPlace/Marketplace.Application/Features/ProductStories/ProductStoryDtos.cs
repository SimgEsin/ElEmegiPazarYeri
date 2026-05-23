namespace Marketplace.Application.Features.ProductStories;

public sealed class ProductStoryDto
{
    public Guid Id { get; init; }
    public Guid ProductId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string ContentHtml { get; init; } = string.Empty;
    public string? ImageUrl { get; init; }
    public int SortOrder { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}

public sealed class CreateProductStoryDto
{
    public required Guid ProductId { get; init; }
    public required string Title { get; init; }
    public required string ContentHtml { get; init; }
    public string? ImageUrl { get; init; }
    public int SortOrder { get; init; }
}

public sealed class UpdateProductStoryDto
{
    public required Guid ProductId { get; init; }
    public required string Title { get; init; }
    public required string ContentHtml { get; init; }
    public string? ImageUrl { get; init; }
    public int SortOrder { get; init; }
}
