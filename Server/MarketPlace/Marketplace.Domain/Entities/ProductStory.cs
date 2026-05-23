namespace Marketplace.Domain.Entities;

public class ProductStory : BaseEntity
{
    public Guid ProductId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; }

    public Product? Product { get; set; }
}
