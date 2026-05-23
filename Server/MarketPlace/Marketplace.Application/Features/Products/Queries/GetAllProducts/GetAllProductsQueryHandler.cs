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
        return await _dbContext.Products
            .AsNoTracking()
            .Where(product => !product.IsDeleted && product.Status == ProductStatus.Published)
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
                IsSoldOut = product.IsSoldOut
            })
            .ToListAsync(cancellationToken);
    }
}
