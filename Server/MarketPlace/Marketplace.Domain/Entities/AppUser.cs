namespace Marketplace.Domain.Entities;

public class AppUser : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }

    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<ProductReview> ProductReviews { get; set; } = new List<ProductReview>();
    public ICollection<ProductReport> ProductReports { get; set; } = new List<ProductReport>();
    public ICollection<WorkshopApplication> WorkshopApplications { get; set; } = new List<WorkshopApplication>();
    public Cart? Cart { get; set; }
    public ICollection<Order> OrdersAsBuyer { get; set; } = new List<Order>();
    public ICollection<Order> OrdersAsArtisan { get; set; } = new List<Order>();
    public ICollection<Conversation> ConversationsAsBuyer { get; set; } = new List<Conversation>();
    public ICollection<Conversation> ConversationsAsArtisan { get; set; } = new List<Conversation>();
    public ICollection<ConversationMessage> SentMessages { get; set; } = new List<ConversationMessage>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ArtisanProfile? ArtisanProfile { get; set; }
}
