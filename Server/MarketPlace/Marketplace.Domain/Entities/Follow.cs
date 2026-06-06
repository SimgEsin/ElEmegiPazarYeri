namespace Marketplace.Domain.Entities;

public class Follow : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ArtisanProfileId { get; set; }

    public AppUser? User { get; set; }
    public ArtisanProfile? ArtisanProfile { get; set; }
}
