namespace Marketplace.Domain.Entities;

public class Cart : BaseEntity
{
    public Guid UserId { get; set; }

    public AppUser? User { get; set; }
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}
