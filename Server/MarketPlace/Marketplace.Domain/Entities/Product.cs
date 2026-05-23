using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class Product : BaseEntity
{
    public Guid ArtisanId { get; set; }
    public Guid CategoryId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string? StoryTitle { get; set; }
    public string? StoryContentHtml { get; set; }
    public string? Material { get; set; }
    public string? Technique { get; set; }
    public string? ProductionDurationText { get; set; }
    public string? DeliveryInfoText { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public ProductStatus Status { get; set; } = ProductStatus.Draft;
    public SalesMode SalesMode { get; set; } = SalesMode.ReadyToShip;
    public string? HeightText { get; set; }
    public string? WidthText { get; set; }
    public string? WeightText { get; set; }
    public bool IsSoldOut { get; set; }

    public AppUser? Artisan { get; set; }
    public Category? Category { get; set; }
    public ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
    public ICollection<ProductStory> ProductStories { get; set; } = new List<ProductStory>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<ProductReview> ProductReviews { get; set; } = new List<ProductReview>();
    public ICollection<ProductReport> ProductReports { get; set; } = new List<ProductReport>();
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
}
