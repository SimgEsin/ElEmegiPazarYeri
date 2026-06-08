using Marketplace.Application.Features.Auth;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using Marketplace.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Seed;

public static class DbSeeder
{
    private const string DefaultPassword = "Sifre123!";

    public static async Task SeedAsync(MarketplaceDbContext dbContext, CancellationToken cancellationToken = default)
    {
        var seedUsers = new[]
        {
            (Email: "musteri@elemegi.com", FullName: "Musteri Hesabi", Role: Role.Customer),
            (Email: "zanaatkar@elemegi.com", FullName: "Zanaatkar Hesabi", Role: Role.Artisan),
            (Email: "admin@elemegi.com", FullName: "Admin Hesabi", Role: Role.Admin),
        };

        foreach (var seed in seedUsers)
        {
            var alreadyExists = await dbContext.Users
                .AnyAsync(user => user.Email == seed.Email, cancellationToken);

            if (alreadyExists)
            {
                continue;
            }

            var user = new AppUser
            {
                Email = seed.Email,
                FullName = seed.FullName,
                PasswordHash = PasswordHasher.HashPassword(DefaultPassword),
                IsActive = true,
            };

            user.UserRoles.Add(new UserRole { UserId = user.Id, Role = seed.Role });

            await dbContext.Users.AddAsync(user, cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        await SeedMehmetUstaProductAsync(dbContext, cancellationToken);
    }

    // Mevcut zanaatkar (Mehmet Usta) hesabina, mutabakat (siparise ozel uretim)
    // akisini deneyebilmek icin tum alanlari dolu MadeToOrder bir urun baglar.
    private static async Task SeedMehmetUstaProductAsync(MarketplaceDbContext dbContext, CancellationToken cancellationToken)
    {
        const string artisanEmail = "zanaatkar@elemegi.com";
        const string productSlug = "mehmet-usta-siparise-ozel-ahsap-sandik";

        var productExists = await dbContext.Products
            .AnyAsync(p => p.Slug == productSlug, cancellationToken);

        if (productExists)
        {
            return;
        }

        var artisan = await dbContext.Users
            .Include(u => u.ArtisanProfile)
            .FirstOrDefaultAsync(u => u.Email == artisanEmail, cancellationToken);

        if (artisan is null)
        {
            return;
        }

        if (artisan.ArtisanProfile is null)
        {
            var artisanProfile = new ArtisanProfile
            {
                UserId = artisan.Id,
                Slug = "mehmet-usta",
                DisplayName = "Mehmet Usta",
                Craft = "Ahsap Oyma Ustasi",
                City = "Konya",
                Bio = "Kirk yildir babadan ogrenme tekniklerle, her parcayi siparise ozel olarak elde oyan bir ahsap ustasiyim. Once konusur, mutabik kalir, sonra agaci sekillendiririm.",
                AvatarUrl = "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=400&q=80",
                RatingAvg = 4.9m,
                FollowerCount = 320,
                ProductCount = 1,
                IsVerified = true,
            };

            await dbContext.ArtisanProfiles.AddAsync(artisanProfile, cancellationToken);
        }

        var hasSalesSettings = await dbContext.ArtisanSalesSettings
            .AnyAsync(s => s.UserId == artisan.Id, cancellationToken);

        if (!hasSalesSettings)
        {
            await dbContext.ArtisanSalesSettings.AddAsync(new ArtisanSalesSettings
            {
                UserId = artisan.Id,
                CompanyTitle = "Mehmet Usta El Sanatlari",
                TaxNumber = "1234567890",
                TaxOffice = "Konya Selcuklu",
                AccountHolder = "Mehmet Usta",
                Iban = "TR00 0000 0000 0000 0000 0000 00",
                BankName = "Ziraat Bankasi",
                ShippingCompany = "Yurtici Kargo",
            }, cancellationToken);
        }

        var category = await dbContext.Categories
            .FirstOrDefaultAsync(c => c.Slug == "ahsap-oyma", cancellationToken);

        if (category is null)
        {
            category = new Category
            {
                Slug = "ahsap-oyma",
                Name = "Ahsap Oyma",
                Description = "Elde oyulmus, siparise ozel uretilen ahsap eserler.",
                Mood = "Sicak, dogal ve zamansiz",
                ImageUrl = "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
            };
            await dbContext.Categories.AddAsync(category, cancellationToken);
        }

        var product = new Product
        {
            ArtisanId = artisan.Id,
            CategoryId = category.Id,
            Slug = productSlug,
            Name = "Siparise Ozel El Oymasi Ahsap Sandik",
            Summary = "Olculeri ve motifleri sizinle mutabik kalinarak belirlenen, tamamen el oymasi ceyiz sandigi.",
            StoryTitle = "Her sandik bir anlasmayla baslar",
            StoryContentHtml = "<p>Bu sandik hazir bir urun degildir. Once sizinle konusur, kullanacaginiz mekani, motif tercihinizi ve olculeri birlikte belirleriz. Mutabik kaldiktan sonra agaci secer ve oymaya baslarim.</p>",
            Material = "Birinci sinif ceviz ve gurgen masif ahsap",
            Technique = "Geleneksel el oymasi (kalem ve tokmak)",
            ProductionDurationText = "Mutabakat sonrasi 3-5 hafta",
            HandcraftDurationText = "Yaklasik 120 saat el iscligi",
            Quote = "Acele ise ahsap gelmez; once anlasiriz, sonra oyariz.",
            ProductionStepsText = "1) Mutabakat gorusmesi ve olcu/motif onayi\n2) Agac secimi ve kurutma kontrolu\n3) Kaba kesim ve govde montaji\n4) El oymasi motif islemesi\n5) Zimpara, dogal yag ve cila\n6) Son kontrol ve ozenli paketleme",
            DeliveryInfoText = "Mutabakat ve uretim tamamlandiktan sonra sigortali olarak kargolanir. Buyuk olculer icin ozel ambalaj uygulanir.",
            Price = 8500m,
            Stock = 0,
            Status = ProductStatus.Published,
            SalesMode = SalesMode.MadeToOrder,
            HeightText = "60 cm (talebe gore degisir)",
            WidthText = "110 cm (talebe gore degisir)",
            WeightText = "Yaklasik 24 kg",
            IsSoldOut = false,
        };

        product.ProductImages.Add(new ProductImage
        {
            ProductId = product.Id,
            Type = ProductImageType.Hero,
            Name = "Ana gorsel",
            Url = "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
            AltText = "El oymasi ahsap ceyiz sandigi",
            SortOrder = 0,
        });
        product.ProductImages.Add(new ProductImage
        {
            ProductId = product.Id,
            Type = ProductImageType.Gallery,
            Name = "Motif detayi",
            Url = "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80",
            AltText = "Oyma motif detayi",
            SortOrder = 1,
        });

        await dbContext.Products.AddAsync(product, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
