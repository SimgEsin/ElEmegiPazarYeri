using MediatR;

namespace Marketplace.Application.Features.Notifications;

public sealed record GetMyNotificationsQuery : IRequest<IReadOnlyList<NotificationDto>>;
public sealed record MarkNotificationReadCommand(Guid Id) : IRequest<bool>;
