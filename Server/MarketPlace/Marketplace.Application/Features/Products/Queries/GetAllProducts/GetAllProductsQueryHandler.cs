using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Products.Queries.GetAllProducts;

public sealed class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, IReadOnlyList<ProductListDto>>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetAllProductsQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ProductListDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Products
            .AsNoTracking()
            .Where(product => !product.IsDeleted);

        if (request.Status is not null)
        {
            query = query.Where(product => product.Status == request.Status);
        }

        if (request.CategoryId is not null)
        {
            query = query.Where(product => product.CategoryId == request.CategoryId);
        }

        if (!string.IsNullOrWhiteSpace(request.CategorySlug))
        {
            query = query.Where(product => product.Category != null && product.Category.Slug == request.CategorySlug);
        }

        if (request.ArtisanId is not null)
        {
            query = query.Where(product => product.ArtisanId == request.ArtisanId);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();
            query = query.Where(product =>
                EF.Functions.Like(product.Name, $"%{search}%") ||
                (product.Summary != null && EF.Functions.Like(product.Summary, $"%{search}%")));
        }

        return await query
            .OrderByDescending(product => product.CreatedAt)
            .Select(product => new ProductListDto
            {
                Id = product.Id,
                Name = product.Name,
                Slug = product.Slug,
                Price = product.Price,
                Status = product.Status,
                SalesMode = product.SalesMode,
                Stock = product.Stock,
                IsSoldOut = product.IsSoldOut,
                Summary = product.Summary,
                CategoryId = product.CategoryId,
                CategoryName = product.Category != null ? product.Category.Name : null,
                CategorySlug = product.Category != null ? product.Category.Slug : null,
                ArtisanId = product.ArtisanId,
                ArtisanDisplayName = _dbContext.ArtisanProfiles
                    .Where(profile => profile.UserId == product.ArtisanId && !profile.IsDeleted)
                    .Select(profile => profile.DisplayName)
                    .FirstOrDefault(),
                ArtisanSlug = _dbContext.ArtisanProfiles
                    .Where(profile => profile.UserId == product.ArtisanId && !profile.IsDeleted)
                    .Select(profile => profile.Slug)
                    .FirstOrDefault(),
                PrimaryImageUrl = product.ProductImages
                    .Where(image => !image.IsDeleted)
                    .OrderByDescending(image => image.Type == ProductImageType.Hero)
                    .ThenBy(image => image.SortOrder)
                    .Select(image => image.Url)
                    .FirstOrDefault()
            })
            .ToListAsync(cancellationToken);
    }
}
