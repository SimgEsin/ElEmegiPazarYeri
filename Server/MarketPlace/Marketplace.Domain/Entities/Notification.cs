using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class Notification : BaseEntity
{
    public Guid UserId { get; set; }
    public NotificationType Type { get; set; } = NotificationType.System;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsRead { get; set; }
    public string? TargetModule { get; set; }
    public Guid? TargetId { get; set; }
    public DateTime? ReadAt { get; set; }

    public AppUser? User { get; set; }
}
