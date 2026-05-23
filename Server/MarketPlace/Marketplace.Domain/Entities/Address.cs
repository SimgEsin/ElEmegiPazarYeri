namespace Marketplace.Domain.Entities;

public class Address : BaseEntity
{
    public Guid UserId { get; set; }
    public string Label { get; set; } = string.Empty;
    public string FullAddress { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public bool IsDefault { get; set; }

    public AppUser? User { get; set; }
    public ICollection<Order> OrdersAsDeliveryAddress { get; set; } = new List<Order>();
}
