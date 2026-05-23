namespace Marketplace.Domain.Entities;

public class WorkshopApplication : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ArtisanProfileId { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";

    public AppUser? User { get; set; }
    public ArtisanProfile? ArtisanProfile { get; set; }
}
