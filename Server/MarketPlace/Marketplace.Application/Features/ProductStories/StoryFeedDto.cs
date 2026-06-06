namespace Marketplace.Application.Features.ProductStories;

public sealed class StoryFeedDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string ContentHtml { get; init; } = string.Empty;
    public string? ImageUrl { get; init; }
    public Guid ProductId { get; init; }
    public string ProductName { get; init; } = string.Empty;
    public string ProductSlug { get; init; } = string.Empty;
    public string? ArtisanDisplayName { get; init; }
    public string? CategoryName { get; init; }
    public int SortOrder { get; init; }
    public DateTime CreatedAt { get; init; }
}
