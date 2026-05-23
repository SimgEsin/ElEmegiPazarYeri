namespace Marketplace.Application.Features.Categories.Queries.GetAllCategories;

public sealed class CategoryListDto
{
    public Guid Id { get; init; }
    public string Slug { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Mood { get; init; }
    public string? ImageUrl { get; init; }
}
