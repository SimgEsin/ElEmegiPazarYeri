using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.ProductImages;

public sealed class CreateProductImageCommandHandler : IRequestHandler<CreateProductImageCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;

    public CreateProductImageCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Guid> Handle(CreateProductImageCommand request, CancellationToken cancellationToken)
    {
        var dto = request.ProductImage;

        var productImage = new ProductImage
        {
            ProductId = dto.ProductId,
            Type = dto.Type,
            Name = dto.Name,
            Url = dto.Url,
            AltText = dto.AltText,
            SortOrder = dto.SortOrder
        };

        await _dbContext.ProductImages.AddAsync(productImage, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return productImage.Id;
    }
}

public sealed class UpdateProductImageCommandHandler : IRequestHandler<UpdateProductImageCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;

    public UpdateProductImageCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(UpdateProductImageCommand request, CancellationToken cancellationToken)
    {
        var productImage = await _dbContext.ProductImages
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (productImage is null)
        {
            return false;
        }

        var dto = request.ProductImage;

        productImage.ProductId = dto.ProductId;
        productImage.Type = dto.Type;
        productImage.Name = dto.Name;
        productImage.Url = dto.Url;
        productImage.AltText = dto.AltText;
        productImage.SortOrder = dto.SortOrder;
        productImage.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class DeleteProductImageCommandHandler : IRequestHandler<DeleteProductImageCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;

    public DeleteProductImageCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(DeleteProductImageCommand request, CancellationToken cancellationToken)
    {
        var productImage = await _dbContext.ProductImages
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (productImage is null)
        {
            return false;
        }

        productImage.IsDeleted = true;
        productImage.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class GetAllProductImagesQueryHandler : IRequestHandler<GetAllProductImagesQuery, IReadOnlyList<ProductImageDto>>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetAllProductImagesQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ProductImageDto>> Handle(GetAllProductImagesQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.ProductImages
            .AsNoTracking()
            .Where(productImage => !productImage.IsDeleted);

        if (request.ProductId is not null)
        {
            query = query.Where(productImage => productImage.ProductId == request.ProductId);
        }

        return await query
            .OrderBy(productImage => productImage.SortOrder)
            .Select(productImage => new ProductImageDto
            {
                Id = productImage.Id,
                ProductId = productImage.ProductId,
                Type = productImage.Type,
                Name = productImage.Name,
                Url = productImage.Url,
                AltText = productImage.AltText,
                SortOrder = productImage.SortOrder,
                CreatedAt = productImage.CreatedAt,
                UpdatedAt = productImage.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}

public sealed class GetProductImageByIdQueryHandler : IRequestHandler<GetProductImageByIdQuery, ProductImageDto?>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetProductImageByIdQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProductImageDto?> Handle(GetProductImageByIdQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.ProductImages
            .AsNoTracking()
            .Where(productImage => productImage.Id == request.Id && !productImage.IsDeleted)
            .Select(productImage => new ProductImageDto
            {
                Id = productImage.Id,
                ProductId = productImage.ProductId,
                Type = productImage.Type,
                Name = productImage.Name,
                Url = productImage.Url,
                AltText = productImage.AltText,
                SortOrder = productImage.SortOrder,
                CreatedAt = productImage.CreatedAt,
                UpdatedAt = productImage.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
