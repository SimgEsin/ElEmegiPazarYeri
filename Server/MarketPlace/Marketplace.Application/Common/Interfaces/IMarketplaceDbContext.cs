using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Common.Interfaces;

public interface IMarketplaceDbContext
{
    DbSet<AppUser> Users { get; }
    DbSet<UserRole> UserRoles { get; }
    DbSet<ArtisanProfile> ArtisanProfiles { get; }
    DbSet<ArtisanProfileImage> ArtisanProfileImages { get; }
    DbSet<ArtisanSalesSettings> ArtisanSalesSettings { get; }
    DbSet<Address> Addresses { get; }
    DbSet<Category> Categories { get; }
    DbSet<Product> Products { get; }
    DbSet<ProductImage> ProductImages { get; }
    DbSet<ProductStory> ProductStories { get; }
    DbSet<Favorite> Favorites { get; }
    DbSet<ProductReview> ProductReviews { get; }
    DbSet<ProductReport> ProductReports { get; }
    DbSet<WorkshopApplication> WorkshopApplications { get; }
    DbSet<Cart> Carts { get; }
    DbSet<CartItem> CartItems { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<Conversation> Conversations { get; }
    DbSet<ConversationMessage> ConversationMessages { get; }
    DbSet<Offer> Offers { get; }
    DbSet<Notification> Notifications { get; }
    DbSet<Follow> Follows { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
