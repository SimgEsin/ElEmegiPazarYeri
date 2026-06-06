namespace Marketplace.Application.Features.Follows;

public sealed class FollowedArtisanDto
{
    public Guid FollowId { get; init; }
    public Guid ArtisanProfileId { get; init; }
    public string Slug { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string Craft { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public decimal RatingAvg { get; init; }
    public int ProductCount { get; init; }
}
