using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class ConversationMessage : BaseEntity
{
    public Guid ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public MessageSenderRole SenderRole { get; set; } = MessageSenderRole.Buyer;
    public string Content { get; set; } = string.Empty;
    public string MessageText { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public Conversation? Conversation { get; set; }
    public AppUser? Sender { get; set; }
}
