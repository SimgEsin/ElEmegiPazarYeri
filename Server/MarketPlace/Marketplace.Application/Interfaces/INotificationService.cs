namespace Marketplace.Application.Interfaces;

public interface INotificationService
{
    Task SendNotificationAsync(string userId, string message, object payload);
}
