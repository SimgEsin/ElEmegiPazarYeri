using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Favorites;

public sealed class CreateFavoriteCommandHandler : IRequestHandler<CreateFavoriteCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public CreateFavoriteCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(CreateFavoriteCommand request, CancellationToken cancellationToken)
    {
        var favorite = new Favorite
        {
            UserId = GetCurrentUserId(),
            ProductId = request.Favorite.ProductId
        };

        await _dbContext.Favorites.AddAsync(favorite, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return favorite.Id;
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

public sealed class UpdateFavoriteCommandHandler : IRequestHandler<UpdateFavoriteCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public UpdateFavoriteCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateFavoriteCommand request, CancellationToken cancellationToken)
    {
        var favorite = await _dbContext.Favorites
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (favorite is null)
        {
            return false;
        }

        favorite.UserId = GetCurrentUserId();
        favorite.ProductId = request.Favorite.ProductId;
        favorite.UpdatedAt = DateTime.UtcNow;

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

public sealed class DeleteFavoriteCommandHandler : IRequestHandler<DeleteFavoriteCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;

    public DeleteFavoriteCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(DeleteFavoriteCommand request, CancellationToken cancellationToken)
    {
        var favorite = await _dbContext.Favorites
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (favorite is null)
        {
            return false;
        }

        favorite.IsDeleted = true;
        favorite.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class GetAllFavoritesQueryHandler : IRequestHandler<GetAllFavoritesQuery, IReadOnlyList<FavoriteDto>>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetAllFavoritesQueryHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<FavoriteDto>> Handle(GetAllFavoritesQuery request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return Array.Empty<FavoriteDto>();
        }

        return await _dbContext.Favorites
            .AsNoTracking()
            .Where(favorite => !favorite.IsDeleted && favorite.UserId == userId)
            .OrderByDescending(favorite => favorite.CreatedAt)
            .Select(favorite => new FavoriteDto
            {
                Id = favorite.Id,
                UserId = favorite.UserId,
                ProductId = favorite.ProductId,
                ProductName = favorite.Product != null ? favorite.Product.Name : null,
                ProductSlug = favorite.Product != null ? favorite.Product.Slug : null,
                ProductPrice = favorite.Product != null ? favorite.Product.Price : 0,
                CategoryName = favorite.Product != null && favorite.Product.Category != null
                    ? favorite.Product.Category.Name
                    : null,
                IsSoldOut = favorite.Product != null && favorite.Product.IsSoldOut,
                ProductImageUrl = favorite.Product != null
                    ? favorite.Product.ProductImages
                        .Where(image => !image.IsDeleted)
                        .OrderBy(image => image.SortOrder)
                        .Select(image => image.Url)
                        .FirstOrDefault()
                    : null,
                ArtisanDisplayName = _dbContext.ArtisanProfiles
                    .Where(profile => favorite.Product != null && profile.UserId == favorite.Product.ArtisanId && !profile.IsDeleted)
                    .Select(profile => profile.DisplayName)
                    .FirstOrDefault(),
                CreatedAt = favorite.CreatedAt,
                UpdatedAt = favorite.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}

public sealed class GetFavoriteByIdQueryHandler : IRequestHandler<GetFavoriteByIdQuery, FavoriteDto?>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetFavoriteByIdQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<FavoriteDto?> Handle(GetFavoriteByIdQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.Favorites
            .AsNoTracking()
            .Where(favorite => favorite.Id == request.Id && !favorite.IsDeleted)
            .Select(favorite => new FavoriteDto
            {
                Id = favorite.Id,
                UserId = favorite.UserId,
                ProductId = favorite.ProductId,
                CreatedAt = favorite.CreatedAt,
                UpdatedAt = favorite.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
