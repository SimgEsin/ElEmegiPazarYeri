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
            .Select(product => new ProductDetailsDto
            {
                Id = product.Id,
                ArtisanId = product.ArtisanId,
                CategoryId = product.CategoryId,
                Slug = product.Slug,
                Name = product.Name,
                Summary = product.Summary,
                StoryTitle = product.StoryTitle,
                StoryContentHtml = product.StoryContentHtml,
                Material = product.Material,
                Technique = product.Technique,
                ProductionDurationText = product.ProductionDurationText,
                DeliveryInfoText = product.DeliveryInfoText,
                Price = product.Price,
                Stock = product.Stock,
                Status = product.Status,
                SalesMode = product.SalesMode,
                HeightText = product.HeightText,
                WidthText = product.WidthText,
                WeightText = product.WeightText,
                IsSoldOut = product.IsSoldOut,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
