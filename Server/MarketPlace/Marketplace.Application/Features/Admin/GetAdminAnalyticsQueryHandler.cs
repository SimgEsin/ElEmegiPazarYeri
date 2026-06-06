using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Admin;

public sealed class GetAdminAnalyticsQueryHandler : IRequestHandler<GetAdminAnalyticsQuery, AdminAnalyticsDto>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetAdminAnalyticsQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<AdminAnalyticsDto> Handle(GetAdminAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var orders = _dbContext.Orders.AsNoTracking().Where(order => !order.IsDeleted);
        var totalRevenue = await orders.SumAsync(order => (decimal?)order.TotalPrice, cancellationToken) ?? 0m;
        var totalOrders = await orders.CountAsync(cancellationToken);

        var publishedProducts = _dbContext.Products
            .AsNoTracking()
            .Where(product => !product.IsDeleted && product.Status == ProductStatus.Published);

        var totalProducts = await publishedProducts.CountAsync(cancellationToken);
        var totalArtisans = await _dbContext.ArtisanProfiles
            .AsNoTracking()
            .CountAsync(profile => !profile.IsDeleted, cancellationToken);

        var categoryCounts = await publishedProducts
            .Where(product => product.Category != null)
            .GroupBy(product => product.Category!.Name)
            .Select(group => new { Name = group.Key, Count = group.Count() })
            .OrderByDescending(group => group.Count)
            .ToListAsync(cancellationToken);

        var categoryTotal = categoryCounts.Sum(category => category.Count);

        var categoryMix = categoryCounts
            .Select(category => new CategoryShareDto
            {
                Name = category.Name,
                ProductCount = category.Count,
                Percentage = categoryTotal == 0 ? 0 : (int)Math.Round((double)category.Count / categoryTotal * 100)
            })
            .ToList();

        return new AdminAnalyticsDto
        {
            TotalRevenue = totalRevenue,
            TotalOrders = totalOrders,
            TotalProducts = totalProducts,
            TotalArtisans = totalArtisans,
            CategoryMix = categoryMix
        };
    }
}
