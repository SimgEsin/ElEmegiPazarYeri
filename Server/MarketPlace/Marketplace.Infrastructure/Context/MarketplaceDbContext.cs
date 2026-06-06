using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Context;

public class MarketplaceDbContext : DbContext, IMarketplaceDbContext
{
    // Veritaban� ba�lant� ayarlar�n� d��ar�dan (API katman�ndan) alabilmek i�in Constructor
    public MarketplaceDbContext(DbContextOptions<MarketplaceDbContext> options) : base(options)
    {
    }

    // Tablolar�m�z (DbSet'ler)
    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<ArtisanProfile> ArtisanProfiles { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductImage> ProductImages { get; set; }
    public DbSet<ProductStory> ProductStories { get; set; }
    public DbSet<Favorite> Favorites { get; set; }
    public DbSet<ProductReview> ProductReviews { get; set; }
    public DbSet<ProductReport> ProductReports { get; set; }
    public DbSet<WorkshopApplication> WorkshopApplications { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<ConversationMessage> ConversationMessages { get; set; }
    public DbSet<Offer> Offers { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Follow> Follows { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ArtisanProfile>()
            .Property(artisanProfile => artisanProfile.RatingAvg)
            .HasPrecision(18, 2);

        modelBuilder.Entity<CartItem>()
            .Property(cartItem => cartItem.UnitPriceSnapshot)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(order => order.Subtotal)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(order => order.ShippingFee)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(order => order.Total)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(order => order.TotalPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(orderItem => orderItem.UnitPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(orderItem => orderItem.LineTotal)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Product>()
            .Property(product => product.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Offer>()
            .Property(offer => offer.ProposedPrice)
            .HasPrecision(18, 2);

        // 1. Conversation - AppUser Iliskileri (Alici ve Satici)
        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.Buyer)
            .WithMany(u => u.ConversationsAsBuyer)
            .HasForeignKey(c => c.BuyerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.Artisan)
            .WithMany(u => u.ConversationsAsArtisan)
            .HasForeignKey(c => c.ArtisanId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.ArtisanProfile)
            .WithMany(ap => ap.Conversations)
            .HasForeignKey(c => c.ArtisanProfileId)
            .OnDelete(DeleteBehavior.Restrict);

        // 2. Order - AppUser Iliskileri (Alici ve Satici)
        modelBuilder.Entity<Order>()
            .HasOne(o => o.Buyer)
            .WithMany(u => u.OrdersAsBuyer)
            .HasForeignKey(o => o.BuyerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.Artisan)
            .WithMany(u => u.OrdersAsArtisan)
            .HasForeignKey(o => o.ArtisanId)
            .OnDelete(DeleteBehavior.Restrict);

        // 3. OrderItem - Product Iliskisi (Hayalet ProductId1 kolonunu engeller)
        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany(product => product.OrderItems)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);


        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.Product)
            .WithMany(p => p.Favorites)
            .HasForeignKey(f => f.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProductReview>()
            .HasOne(pr => pr.User)
            .WithMany(u => u.ProductReviews)
            .HasForeignKey(pr => pr.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProductReview>()
            .HasOne(pr => pr.Product)
            .WithMany(p => p.ProductReviews)
            .HasForeignKey(pr => pr.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProductReport>()
            .HasOne(pr => pr.User)
            .WithMany(u => u.ProductReports)
            .HasForeignKey(pr => pr.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProductReport>()
            .HasOne(pr => pr.Product)
            .WithMany(p => p.ProductReports)
            .HasForeignKey(pr => pr.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<WorkshopApplication>()
            .HasOne(wa => wa.User)
            .WithMany(u => u.WorkshopApplications)
            .HasForeignKey(wa => wa.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<WorkshopApplication>()
            .HasOne(wa => wa.ArtisanProfile)
            .WithMany(ap => ap.WorkshopApplications)
            .HasForeignKey(wa => wa.ArtisanProfileId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Cart>()
            .HasOne(cart => cart.User)
            .WithOne(user => user.Cart)
            .HasForeignKey<Cart>(cart => cart.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Cart>()
            .HasIndex(cart => cart.UserId)
            .IsUnique();

        modelBuilder.Entity<CartItem>()
            .HasOne(cartItem => cartItem.Cart)
            .WithMany(cart => cart.CartItems)
            .HasForeignKey(cartItem => cartItem.CartId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<CartItem>()
            .HasOne(cartItem => cartItem.Product)
            .WithMany(product => product.CartItems)
            .HasForeignKey(cartItem => cartItem.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        // 4. ConversationMessage - AppUser Iliskisi
        modelBuilder.Entity<ConversationMessage>()
            .HasOne(cm => cm.Sender)
            .WithMany()
            .HasForeignKey(cm => cm.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ConversationMessage>()
            .HasOne(cm => cm.Conversation)
            .WithMany(c => c.Messages)
            .HasForeignKey(cm => cm.ConversationId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Offer>()
            .HasOne(offer => offer.Conversation)
            .WithMany(conversation => conversation.Offers)
            .HasForeignKey(offer => offer.ConversationId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Follow>()
            .HasOne(follow => follow.User)
            .WithMany()
            .HasForeignKey(follow => follow.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Follow>()
            .HasOne(follow => follow.ArtisanProfile)
            .WithMany()
            .HasForeignKey(follow => follow.ArtisanProfileId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Follow>()
            .HasIndex(follow => new { follow.UserId, follow.ArtisanProfileId });
    }
}
