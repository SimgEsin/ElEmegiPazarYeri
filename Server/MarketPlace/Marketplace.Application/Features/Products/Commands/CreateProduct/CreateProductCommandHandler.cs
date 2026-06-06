using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Features.Products.Commands.CreateProduct;

public sealed class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public CreateProductCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Product;

        var product = new Product
        {
            Name = dto.Name,
            CategoryId = dto.CategoryId,
            ArtisanId = GetCurrentUserId(),
            Price = dto.Price,
            Status = dto.Status,
            SalesMode = dto.SalesMode,
            Slug = dto.Slug,
            Summary = dto.Summary,
            StoryTitle = dto.StoryTitle,
            StoryContentHtml = dto.StoryContentHtml,
            Material = dto.Material,
            Technique = dto.Technique,
            ProductionDurationText = dto.ProductionDurationText,
            HandcraftDurationText = dto.HandcraftDurationText,
            Quote = dto.Quote,
            ProductionStepsText = dto.ProductionStepsText,
            DeliveryInfoText = dto.DeliveryInfoText,
            Stock = dto.Stock,
            HeightText = dto.HeightText,
            WidthText = dto.WidthText,
            WeightText = dto.WeightText,
            IsSoldOut = dto.IsSoldOut
        };

        await _dbContext.Products.AddAsync(product, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return product.Id;
    }

    private Guid GetCurrentUserId()
    {
        if (Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
    }
}
