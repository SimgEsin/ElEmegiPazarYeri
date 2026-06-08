using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class Conversation : BaseEntity
{
    public Guid ProductId { get; set; }
    public Guid BuyerId { get; set; }
    public Guid ArtisanId { get; set; }
    public Guid? ArtisanProfileId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public ConversationType Type { get; set; } = ConversationType.Message;
    public ConversationStatus Status { get; set; } = ConversationStatus.Open;
    public int UnreadCountBuyer { get; set; }
    public int UnreadCountArtisan { get; set; }
    public DateTime? LastMessageAt { get; set; }

    public Product? Product { get; set; }
    public AppUser? Buyer { get; set; }
    public AppUser? Artisan { get; set; }
    public ArtisanProfile? ArtisanProfile { get; set; }
    public ICollection<ConversationMessage> Messages { get; set; } = new List<ConversationMessage>();
    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
}
