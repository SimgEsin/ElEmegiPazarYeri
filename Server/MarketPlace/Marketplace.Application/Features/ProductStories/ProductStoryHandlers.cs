using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.ProductStories;

public sealed class CreateProductStoryCommandHandler : IRequestHandler<CreateProductStoryCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;

    public CreateProductStoryCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Guid> Handle(CreateProductStoryCommand request, CancellationToken cancellationToken)
    {
        var dto = request.ProductStory;

        var productStory = new ProductStory
        {
            ProductId = dto.ProductId,
            Title = dto.Title,
            ContentHtml = dto.ContentHtml,
            ImageUrl = dto.ImageUrl,
            SortOrder = dto.SortOrder
        };

        await _dbContext.ProductStories.AddAsync(productStory, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return productStory.Id;
    }
}

public sealed class UpdateProductStoryCommandHandler : IRequestHandler<UpdateProductStoryCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;

    public UpdateProductStoryCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(UpdateProductStoryCommand request, CancellationToken cancellationToken)
    {
        var productStory = await _dbContext.ProductStories
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (productStory is null)
        {
            return false;
        }

        var dto = request.ProductStory;

        productStory.ProductId = dto.ProductId;
        productStory.Title = dto.Title;
        productStory.ContentHtml = dto.ContentHtml;
        productStory.ImageUrl = dto.ImageUrl;
        productStory.SortOrder = dto.SortOrder;
        productStory.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class DeleteProductStoryCommandHandler : IRequestHandler<DeleteProductStoryCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;

    public DeleteProductStoryCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(DeleteProductStoryCommand request, CancellationToken cancellationToken)
    {
        var productStory = await _dbContext.ProductStories
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (productStory is null)
        {
            return false;
        }

        productStory.IsDeleted = true;
        productStory.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class GetAllProductStoriesQueryHandler : IRequestHandler<GetAllProductStoriesQuery, IReadOnlyList<ProductStoryDto>>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetAllProductStoriesQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ProductStoryDto>> Handle(GetAllProductStoriesQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.ProductStories
            .AsNoTracking()
            .Where(productStory => !productStory.IsDeleted);

        if (request.ProductId is not null)
        {
            query = query.Where(productStory => productStory.ProductId == request.ProductId);
        }

        return await query
            .OrderBy(productStory => productStory.SortOrder)
            .Select(productStory => new ProductStoryDto
            {
                Id = productStory.Id,
                ProductId = productStory.ProductId,
                Title = productStory.Title,
                ContentHtml = productStory.ContentHtml,
                ImageUrl = productStory.ImageUrl,
                SortOrder = productStory.SortOrder,
                CreatedAt = productStory.CreatedAt,
                UpdatedAt = productStory.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}

public sealed class GetProductStoryByIdQueryHandler : IRequestHandler<GetProductStoryByIdQuery, ProductStoryDto?>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetProductStoryByIdQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProductStoryDto?> Handle(GetProductStoryByIdQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.ProductStories
            .AsNoTracking()
            .Where(productStory => productStory.Id == request.Id && !productStory.IsDeleted)
            .Select(productStory => new ProductStoryDto
            {
                Id = productStory.Id,
                ProductId = productStory.ProductId,
                Title = productStory.Title,
                ContentHtml = productStory.ContentHtml,
                ImageUrl = productStory.ImageUrl,
                SortOrder = productStory.SortOrder,
                CreatedAt = productStory.CreatedAt,
                UpdatedAt = productStory.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
