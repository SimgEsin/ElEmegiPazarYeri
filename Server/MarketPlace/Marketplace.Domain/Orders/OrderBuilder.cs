using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Orders;

// BUILDER tasarim kalibi.
// Amac: cok alanli ve adim adim kurulan Order nesnesini, okunabilir bir akisla (fluent interface)
// olusturmak. Karmasik kurulum mantigi (kalem ekleme, ara toplam/toplam hesabi) nesnenin
// kendisinden ayrilir; cagiran kod sadece anlamli adimlari zincirler ve sonunda Build() ile
// tamamlanmis Order'i alir.
//
// Ornek kullanim:
//   var order = new OrderBuilder()
//       .ForBuyer(buyerId)
//       .FromArtisan(artisanId)
//       .WithOrderNo("ELM-20260609-0001")
//       .WithPaymentMethod(PaymentMethod.CreditCard)
//       .WithContactPhone("05551112233")
//       .AddItem(product, 2)
//       .Build();
public sealed class OrderBuilder
{
    private readonly Order _order = new()
    {
        OrderDate = DateTime.UtcNow,
        Status = OrderStatus.Pending,
        PaymentStatus = PaymentStatus.Pending,
        Source = "Web",
    };

    public OrderBuilder ForBuyer(Guid buyerId)
    {
        _order.BuyerId = buyerId;
        return this;
    }

    public OrderBuilder FromArtisan(Guid artisanId)
    {
        _order.ArtisanId = artisanId;
        return this;
    }

    public OrderBuilder WithOrderNo(string orderNo)
    {
        _order.OrderNo = orderNo;
        return this;
    }

    public OrderBuilder WithPaymentMethod(PaymentMethod paymentMethod)
    {
        _order.PaymentMethod = paymentMethod;
        return this;
    }

    public OrderBuilder WithDeliveryAddress(Guid addressId)
    {
        _order.DeliveryAddressId = addressId;
        return this;
    }

    public OrderBuilder WithContactPhone(string phone)
    {
        _order.ContactPhone = phone;
        return this;
    }

    public OrderBuilder WithShipping(string companyName, decimal shippingFee)
    {
        _order.ShippingCompany = companyName;
        _order.ShippingFee = shippingFee;
        return this;
    }

    public OrderBuilder WithNote(string? note)
    {
        _order.Note = note;
        return this;
    }

    public OrderBuilder AddItem(Product product, int quantity)
    {
        _order.OrderItems.Add(new OrderItem
        {
            ProductId = product.Id,
            ProductNameSnapshot = product.Name,
            Quantity = quantity,
            UnitPrice = product.Price,
            LineTotal = product.Price * quantity,
        });
        return this;
    }

    // Insaa islemini tamamlar: ara toplam ve toplam, eklenen kalemlerden otomatik hesaplanir.
    public Order Build()
    {
        _order.Subtotal = _order.OrderItems.Sum(item => item.LineTotal);
        _order.Total = _order.Subtotal + _order.ShippingFee;
        _order.TotalPrice = _order.Total;
        return _order;
    }
}
