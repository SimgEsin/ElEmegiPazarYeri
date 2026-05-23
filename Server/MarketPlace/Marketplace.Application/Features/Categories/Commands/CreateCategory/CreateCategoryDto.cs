namespace Marketplace.Application.Features.Categories.Commands.CreateCategory;

public sealed class CreateCategoryDto
{
    public required string Slug { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public string? Mood { get; init; }
    public string? ImageUrl { get; init; }
}
