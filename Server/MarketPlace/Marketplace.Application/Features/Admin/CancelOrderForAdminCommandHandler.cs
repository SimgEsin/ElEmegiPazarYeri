using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Admin;

public sealed class CancelOrderForAdminCommandHandler : IRequestHandler<CancelOrderForAdminCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;

    public CancelOrderForAdminCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(CancelOrderForAdminCommand request, CancellationToken cancellationToken)
    {
        var order = await _dbContext.Orders
            .FirstOrDefaultAsync(entity => entity.Id == request.OrderId && !entity.IsDeleted, cancellationToken);

        if (order is null)
        {
            return false;
        }

        if (order.Status == OrderStatus.Cancelled)
        {
            return true;
        }

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;

        var buyerNotification = new Notification
        {
            UserId = order.BuyerId,
            Type = NotificationType.Order,
            Title = "Siparişiniz iptal edildi",
            Description = $"{order.OrderNo} numaralı siparişiniz yönetici tarafından iptal edildi.",
            TargetModule = "orders",
            TargetId = order.Id
        };
        await _dbContext.Notifications.AddAsync(buyerNotification, cancellationToken);

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
