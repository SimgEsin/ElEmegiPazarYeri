namespace Marketplace.Application.Features.ArtisanProfiles.Queries.GetArtisanProfileById;

public sealed class ArtisanProfileImageDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Url { get; init; } = string.Empty;
    public string? AltText { get; init; }
    public int SortOrder { get; init; }
}

public sealed class ArtisanProfileDetailsDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public string Slug { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string Craft { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public string? Bio { get; init; }
    public string? AvatarUrl { get; init; }
    public decimal RatingAvg { get; init; }
    public int FollowerCount { get; init; }
    public int ProductCount { get; init; }
    public bool IsVerified { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public List<ArtisanProfileImageDto> GalleryImages { get; init; } = new();
}
