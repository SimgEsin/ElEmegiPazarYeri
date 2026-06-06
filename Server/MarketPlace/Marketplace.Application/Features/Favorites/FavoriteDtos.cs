namespace Marketplace.Application.Features.Favorites;

public sealed class FavoriteDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public Guid ProductId { get; init; }
    public string? ProductName { get; init; }
    public string? ProductSlug { get; init; }
    public decimal ProductPrice { get; init; }
    public string? ProductImageUrl { get; init; }
    public string? CategoryName { get; init; }
    public string? ArtisanDisplayName { get; init; }
    public bool IsSoldOut { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}

public sealed class CreateFavoriteDto
{
    public required Guid ProductId { get; init; }
}

public sealed class UpdateFavoriteDto
{
    public required Guid ProductId { get; init; }
}
