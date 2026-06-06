using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Notifications;

public sealed class GetMyNotificationsQueryHandler : IRequestHandler<GetMyNotificationsQuery, IReadOnlyList<NotificationDto>>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetMyNotificationsQueryHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<NotificationDto>> Handle(GetMyNotificationsQuery request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return Array.Empty<NotificationDto>();
        }

        return await _dbContext.Notifications
            .AsNoTracking()
            .Where(notification => notification.UserId == userId && !notification.IsDeleted)
            .OrderByDescending(notification => notification.CreatedAt)
            .Select(notification => new NotificationDto
            {
                Id = notification.Id,
                Type = notification.Type,
                Title = notification.Title,
                Description = notification.Description,
                IsRead = notification.IsRead,
                TargetModule = notification.TargetModule,
                TargetId = notification.TargetId,
                CreatedAt = notification.CreatedAt,
                ReadAt = notification.ReadAt
            })
            .ToListAsync(cancellationToken);
    }
}

public sealed class MarkNotificationReadCommandHandler : IRequestHandler<MarkNotificationReadCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public MarkNotificationReadCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(MarkNotificationReadCommand request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return false;
        }

        var notification = await _dbContext.Notifications
            .FirstOrDefaultAsync(
                entity => entity.Id == request.Id && entity.UserId == userId && !entity.IsDeleted,
                cancellationToken);

        if (notification is null)
        {
            return false;
        }

        if (!notification.IsRead)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
            notification.UpdatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return true;
    }
}
