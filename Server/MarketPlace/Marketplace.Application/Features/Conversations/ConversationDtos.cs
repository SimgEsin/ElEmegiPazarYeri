using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Conversations;

public sealed class SendMessageDto
{
    public required Guid ProductId { get; init; }
    public required Guid ArtisanProfileId { get; init; }
    public required string Content { get; init; }
}

public sealed class MakeOfferDto
{
    public required Guid ConversationId { get; init; }
    public required decimal ProposedPrice { get; init; }
}

public sealed class RespondToOfferDto
{
    public required Guid OfferId { get; init; }
    public bool IsAccepted { get; init; }
}

public sealed class ConversationListDto
{
    public Guid Id { get; init; }
    public Guid ProductId { get; init; }
    public string ProductName { get; init; } = string.Empty;
    public string? ProductImageUrl { get; init; }
    public Guid BuyerId { get; init; }
    public Guid ArtisanId { get; init; }
    public Guid? ArtisanProfileId { get; init; }
    public string ArtisanDisplayName { get; init; } = string.Empty;
    public string? LastMessage { get; init; }
    public DateTime? LastMessageAt { get; init; }
    public OfferSummaryDto? ActiveOffer { get; init; }
}

public sealed class OfferSummaryDto
{
    public Guid Id { get; init; }
    public decimal ProposedPrice { get; init; }
    public OfferStatus Status { get; init; }
}

public sealed class ConversationMessageDto
{
    public Guid Id { get; init; }
    public Guid SenderId { get; init; }
    public MessageSenderRole SenderRole { get; init; }
    public string Content { get; init; } = string.Empty;
    public DateTime SentAt { get; init; }
}
