using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Features.Products.Queries.GetProductById;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Products.Queries.GetProductBySlug;

public sealed class GetProductBySlugQueryHandler : IRequestHandler<GetProductBySlugQuery, ProductDetailsDto?>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetProductBySlugQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProductDetailsDto?> Handle(GetProductBySlugQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.Products
            .AsNoTracking()
            .Where(product => product.Slug == request.Slug && !product.IsDeleted)
            .Select(ProductDetailsProjection.Map)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
