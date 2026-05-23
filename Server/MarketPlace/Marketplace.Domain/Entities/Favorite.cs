namespace Marketplace.Domain.Entities;

public class Favorite : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }

    public AppUser? User { get; set; }
    public Product? Product { get; set; }
}
