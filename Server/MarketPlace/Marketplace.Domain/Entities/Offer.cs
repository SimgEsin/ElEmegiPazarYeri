using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class Offer : BaseEntity
{
    public Guid ConversationId { get; set; }
    public decimal ProposedPrice { get; set; }
    public OfferStatus Status { get; set; } = OfferStatus.Pending;

    public Conversation? Conversation { get; set; }
}
