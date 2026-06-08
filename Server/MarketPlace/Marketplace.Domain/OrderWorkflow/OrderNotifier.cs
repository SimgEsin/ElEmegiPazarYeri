using Marketplace.Domain.Enums;

namespace Marketplace.Domain.OrderWorkflow;

// OBSERVER (davranissal) tasarim kalibi.
// Gozlemci arayuzu: siparis durumu degistiginde haberdar edilecek taraflarin sozlesmesi.
public interface IOrderObserver
{
    void OnOrderStatusChanged(string orderNo, OrderStatus newStatus);
}

// SUBJECT (gozlenen). Gozlemcileri tutar ve bir olay olunca hepsine otomatik haber verir.
// Gozlenen taraf, kendisini kimlerin dinledigini bilmek zorunda degildir (gevsek baglilik).
public sealed class OrderNotifier
{
    private readonly List<IOrderObserver> _observers = new();

    public void Subscribe(IOrderObserver observer) => _observers.Add(observer);

    public void Unsubscribe(IOrderObserver observer) => _observers.Remove(observer);

    public void NotifyStatusChanged(string orderNo, OrderStatus newStatus)
    {
        foreach (var observer in _observers)
        {
            observer.OnOrderStatusChanged(orderNo, newStatus);
        }
    }
}

// Somut gozlemci 1: musteriye e-posta bildirimi hazirlar.
public sealed class CustomerEmailObserver : IOrderObserver
{
    public string LastMessage { get; private set; } = string.Empty;

    public void OnOrderStatusChanged(string orderNo, OrderStatus newStatus)
        => LastMessage = $"[E-posta] {orderNo} numarali siparisinizin durumu guncellendi: {newStatus}";
}

// Somut gozlemci 2: zanaatkar paneline bildirim dusurur.
public sealed class ArtisanPanelObserver : IOrderObserver
{
    public string LastMessage { get; private set; } = string.Empty;

    public void OnOrderStatusChanged(string orderNo, OrderStatus newStatus)
        => LastMessage = $"[Panel] {orderNo} numarali siparis guncellendi: {newStatus}";
}
