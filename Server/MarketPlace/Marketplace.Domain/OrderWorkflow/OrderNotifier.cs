using Marketplace.Domain.Enums;

namespace Marketplace.Domain.OrderWorkflow;

// OBSERVER (davranissal) tasarim kalibi.
// Siparis durumu degistiginde gozlemcilere iletilen olay verisi.
public sealed class OrderStatusChangedEvent
{
    public Guid OrderId { get; init; }
    public string OrderNo { get; init; } = string.Empty;
    public OrderStatus NewStatus { get; init; }
    public Guid RecipientUserId { get; init; }
}

// Gozlemci arayuzu: siparis durumu degistiginde haberdar edilecek taraflarin sozlesmesi.
public interface IOrderObserver
{
    Task OnOrderStatusChangedAsync(OrderStatusChangedEvent statusChange, CancellationToken cancellationToken);
}

// SUBJECT (gozlenen). Gozlemcileri tutar ve bir olay olunca hepsine otomatik haber verir.
// Gozlenen taraf, kendisini kimlerin dinledigini bilmek zorunda degildir (gevsek baglilik).
public sealed class OrderNotifier
{
    private readonly List<IOrderObserver> _observers = new();

    public void Subscribe(IOrderObserver observer) => _observers.Add(observer);

    public void Unsubscribe(IOrderObserver observer) => _observers.Remove(observer);

    public async Task NotifyStatusChangedAsync(OrderStatusChangedEvent statusChange, CancellationToken cancellationToken)
    {
        foreach (var observer in _observers)
        {
            await observer.OnOrderStatusChangedAsync(statusChange, cancellationToken);
        }
    }
}
