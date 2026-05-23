namespace Marketplace.Domain.Entities;

public class ProductReport : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsResolved { get; set; }

    public AppUser? User { get; set; }
    public Product? Product { get; set; }
}
