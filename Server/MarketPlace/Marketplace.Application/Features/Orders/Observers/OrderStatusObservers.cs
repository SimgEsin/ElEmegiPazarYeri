using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using Marketplace.Domain.OrderWorkflow;

namespace Marketplace.Application.Features.Orders.Observers;

// Somut gozlemci 1: durum degisikligini veritabanina kalici bildirim olarak yazar.
// Boylece kullanici daha sonra giris yaptiginda da bildirimi gorebilir.
public sealed class DatabaseNotificationObserver : IOrderObserver
{
    private readonly IMarketplaceDbContext _dbContext;

    public DatabaseNotificationObserver(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task OnOrderStatusChangedAsync(OrderStatusChangedEvent statusChange, CancellationToken cancellationToken)
    {
        var notification = new Notification
        {
            UserId = statusChange.RecipientUserId,
            Type = NotificationType.Order,
            Title = "Sipariş durumu güncellendi",
            Description = $"{statusChange.OrderNo} numaralı siparişinizin durumu güncellendi.",
            TargetModule = "orders",
            TargetId = statusChange.OrderId
        };

        await _dbContext.Notifications.AddAsync(notification, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

// Somut gozlemci 2: durum degisikligini SignalR ile alicinin ekranina anlik olarak iletir.
public sealed class RealtimeNotificationObserver : IOrderObserver
{
    private readonly INotificationService _notificationService;

    public RealtimeNotificationObserver(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public Task OnOrderStatusChangedAsync(OrderStatusChangedEvent statusChange, CancellationToken cancellationToken)
    {
        return _notificationService.SendNotificationAsync(
            statusChange.RecipientUserId.ToString(),
            "Sipariş durumunuz güncellendi.",
            new
            {
                OrderId = statusChange.OrderId,
                OrderNo = statusChange.OrderNo,
                Status = statusChange.NewStatus
            });
    }
}
