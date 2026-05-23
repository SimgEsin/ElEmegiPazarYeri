using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.ProductReviews;

public sealed class CreateProductReviewCommandHandler : IRequestHandler<CreateProductReviewCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public CreateProductReviewCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(CreateProductReviewCommand request, CancellationToken cancellationToken)
    {
        var dto = request.ProductReview;

        var productReview = new ProductReview
        {
            UserId = GetCurrentUserId(),
            ProductId = dto.ProductId,
            Rating = dto.Rating,
            Comment = dto.Comment
        };

        await _dbContext.ProductReviews.AddAsync(productReview, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return productReview.Id;
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

public sealed class UpdateProductReviewCommandHandler : IRequestHandler<UpdateProductReviewCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public UpdateProductReviewCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateProductReviewCommand request, CancellationToken cancellationToken)
    {
        var productReview = await _dbContext.ProductReviews
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (productReview is null)
        {
            return false;
        }

        var dto = request.ProductReview;

        productReview.UserId = GetCurrentUserId();
        productReview.ProductId = dto.ProductId;
        productReview.Rating = dto.Rating;
        productReview.Comment = dto.Comment;
        productReview.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
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

public sealed class DeleteProductReviewCommandHandler : IRequestHandler<DeleteProductReviewCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;

    public DeleteProductReviewCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(DeleteProductReviewCommand request, CancellationToken cancellationToken)
    {
        var productReview = await _dbContext.ProductReviews
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (productReview is null)
        {
            return false;
        }

        productReview.IsDeleted = true;
        productReview.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class GetAllProductReviewsQueryHandler : IRequestHandler<GetAllProductReviewsQuery, IReadOnlyList<ProductReviewDto>>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetAllProductReviewsQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ProductReviewDto>> Handle(GetAllProductReviewsQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.ProductReviews
            .AsNoTracking()
            .Where(productReview => !productReview.IsDeleted)
            .OrderByDescending(productReview => productReview.CreatedAt)
            .Select(productReview => new ProductReviewDto
            {
                Id = productReview.Id,
                UserId = productReview.UserId,
                ProductId = productReview.ProductId,
                Rating = productReview.Rating,
                Comment = productReview.Comment,
                CreatedAt = productReview.CreatedAt,
                UpdatedAt = productReview.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}

public sealed class GetProductReviewByIdQueryHandler : IRequestHandler<GetProductReviewByIdQuery, ProductReviewDto?>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetProductReviewByIdQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProductReviewDto?> Handle(GetProductReviewByIdQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.ProductReviews
            .AsNoTracking()
            .Where(productReview => productReview.Id == request.Id && !productReview.IsDeleted)
            .Select(productReview => new ProductReviewDto
            {
                Id = productReview.Id,
                UserId = productReview.UserId,
                ProductId = productReview.ProductId,
                Rating = productReview.Rating,
                Comment = productReview.Comment,
                CreatedAt = productReview.CreatedAt,
                UpdatedAt = productReview.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
