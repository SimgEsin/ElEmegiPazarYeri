using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class Offer : BaseEntity
{
    public Guid ConversationId { get; set; }
    public decimal ProposedPrice { get; set; }
    public int EstimatedDeliveryDays { get; set; }
    public string ProductDetails { get; set; } = string.Empty;
    public OfferStatus Status { get; set; } = OfferStatus.Pending;
    public AgreementStage Stage { get; set; } = AgreementStage.None;
    public string? FinalProductNote { get; set; }
    public string? FinalProductImageUrl { get; set; }
    public string? ShippingTrackingInfo { get; set; }

    public Conversation? Conversation { get; set; }
}
