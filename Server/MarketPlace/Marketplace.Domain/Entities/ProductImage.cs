using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class ProductImage : BaseEntity
{
    public Guid ProductId { get; set; }
    public ProductImageType Type { get; set; } = ProductImageType.Gallery;
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public int SortOrder { get; set; }

    public Product? Product { get; set; }
}
