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
    }
}
