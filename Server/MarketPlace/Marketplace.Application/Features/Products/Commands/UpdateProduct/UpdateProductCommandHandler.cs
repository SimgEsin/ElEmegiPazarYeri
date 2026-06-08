using MediatR;
using Marketplace.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Products.Commands.UpdateProduct;

public sealed class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;

    public UpdateProductCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _dbContext.Products
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (product is null)
        {
            return false;
        }

        var dto = request.Product;

        product.Name = dto.Name;
        product.CategoryId = dto.CategoryId;
        product.Price = dto.Price;
        product.Status = dto.Status;
        product.SalesMode = dto.SalesMode;
        product.Slug = dto.Slug;
        product.Summary = dto.Summary;
        product.StoryTitle = dto.StoryTitle;
        product.StoryContentHtml = dto.StoryContentHtml;
        product.Material = dto.Material;
        product.Technique = dto.Technique;
        product.ProductionDurationText = dto.ProductionDurationText;
        product.HandcraftDurationText = dto.HandcraftDurationText;
        product.Quote = dto.Quote;
        product.ProductionStepsText = dto.ProductionStepsText;
        product.DeliveryInfoText = dto.DeliveryInfoText;
        product.Stock = dto.Stock;
        product.HeightText = dto.HeightText;
        product.WidthText = dto.WidthText;
        product.WeightText = dto.WeightText;
        product.IsSoldOut = dto.IsSoldOut;
        product.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
