using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Notifications;

public sealed class NotificationDto
{
    public Guid Id { get; init; }
    public NotificationType Type { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public bool IsRead { get; init; }
    public string? TargetModule { get; init; }
    public Guid? TargetId { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? ReadAt { get; init; }
}
