namespace Marketplace.Domain.Entities;

public class ArtisanProfileImage : BaseEntity
{
    public Guid ArtisanProfileId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public int SortOrder { get; set; }

    public ArtisanProfile? ArtisanProfile { get; set; }
}
