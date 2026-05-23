using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class Order : BaseEntity
{
    public string OrderNo { get; set; } = string.Empty;
    public Guid BuyerId { get; set; }
    public Guid ArtisanId { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public string Source { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal Subtotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Total { get; set; }
    public decimal TotalPrice { get; set; }
    public string? ShippingCompany { get; set; }
    public string? ShippingEtaText { get; set; }
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.CreditCard;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    public Guid? DeliveryAddressId { get; set; }
    public string ContactPhone { get; set; } = string.Empty;
    public string? Note { get; set; }

    public AppUser? Buyer { get; set; }
    public AppUser? Artisan { get; set; }
    public Address? DeliveryAddress { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
