namespace Marketplace.Application.Features.Favorites;

public sealed class FavoriteDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public Guid ProductId { get; init; }
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
