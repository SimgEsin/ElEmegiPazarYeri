using MediatR;
using Marketplace.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Products.Queries.GetProductById;

public sealed class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDetailsDto?>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetProductByIdQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProductDetailsDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.Products
            .AsNoTracking()
            .Where(product => product.Id == request.Id && !product.IsDeleted)
            .Select(ProductDetailsProjection.Map)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
