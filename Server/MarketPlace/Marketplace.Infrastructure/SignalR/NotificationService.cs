using Marketplace.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace Marketplace.Infrastructure.SignalR;

public class NotificationService : INotificationService
{
    private readonly IHubContext<ChatHub> _hubContext;

    public NotificationService(IHubContext<ChatHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendNotificationAsync(string userId, string message, object payload)
    {
        await _hubContext.Clients.User(userId)
            .SendAsync("ReceiveNotification", message, payload);
    }
}
