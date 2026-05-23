namespace Marketplace.Domain.Entities;

public class ArtisanProfile : BaseEntity
{
    public Guid UserId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Craft { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public decimal RatingAvg { get; set; }
    public int FollowerCount { get; set; }
    public int ProductCount { get; set; }
    public bool IsVerified { get; set; }

    public AppUser? User { get; set; }
    public ICollection<WorkshopApplication> WorkshopApplications { get; set; } = new List<WorkshopApplication>();
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
}
