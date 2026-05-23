namespace Marketplace.Application.Features.ArtisanProfiles.Commands.UpdateArtisanProfile;

public sealed class UpdateArtisanProfileDto
{
    public required string Slug { get; init; }
    public required string DisplayName { get; init; }
    public required string Craft { get; init; }
    public required string City { get; init; }
    public string? Bio { get; init; }
    public decimal RatingAvg { get; init; }
    public int FollowerCount { get; init; }
    public int ProductCount { get; init; }
    public bool IsVerified { get; init; }
}
