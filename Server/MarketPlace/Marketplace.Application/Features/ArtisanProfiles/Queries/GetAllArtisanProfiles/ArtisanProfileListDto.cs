namespace Marketplace.Application.Features.ArtisanProfiles.Queries.GetAllArtisanProfiles;

public sealed class ArtisanProfileListDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public string Slug { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string Craft { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public decimal RatingAvg { get; init; }
    public int FollowerCount { get; init; }
    public int ProductCount { get; init; }
    public bool IsVerified { get; init; }
}
