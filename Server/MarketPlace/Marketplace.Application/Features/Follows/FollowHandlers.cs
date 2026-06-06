using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Follows;

public sealed class FollowArtisanCommandHandler : IRequestHandler<FollowArtisanCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public FollowArtisanCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(FollowArtisanCommand request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
        }

        var artisanProfile = await _dbContext.ArtisanProfiles
            .FirstOrDefaultAsync(profile => profile.Id == request.ArtisanProfileId && !profile.IsDeleted, cancellationToken);

        if (artisanProfile is null)
        {
            return false;
        }

        var existing = await _dbContext.Follows
            .FirstOrDefaultAsync(
                follow => follow.UserId == userId && follow.ArtisanProfileId == request.ArtisanProfileId && !follow.IsDeleted,
                cancellationToken);

        if (existing is not null)
        {
            return true;
        }

        await _dbContext.Follows.AddAsync(new Follow
        {
            UserId = userId,
            ArtisanProfileId = request.ArtisanProfileId
        }, cancellationToken);

        artisanProfile.FollowerCount += 1;
        artisanProfile.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class UnfollowArtisanCommandHandler : IRequestHandler<UnfollowArtisanCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public UnfollowArtisanCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UnfollowArtisanCommand request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            throw new UnauthorizedAccessException("Kullanici bilgisi bulunamadi.");
        }

        var follow = await _dbContext.Follows
            .FirstOrDefaultAsync(
                entity => entity.UserId == userId && entity.ArtisanProfileId == request.ArtisanProfileId && !entity.IsDeleted,
                cancellationToken);

        if (follow is null)
        {
            return false;
        }

        follow.IsDeleted = true;
        follow.UpdatedAt = DateTime.UtcNow;

        var artisanProfile = await _dbContext.ArtisanProfiles
            .FirstOrDefaultAsync(profile => profile.Id == request.ArtisanProfileId, cancellationToken);

        if (artisanProfile is not null && artisanProfile.FollowerCount > 0)
        {
            artisanProfile.FollowerCount -= 1;
            artisanProfile.UpdatedAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

public sealed class GetMyFollowingQueryHandler : IRequestHandler<GetMyFollowingQuery, IReadOnlyList<FollowedArtisanDto>>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetMyFollowingQueryHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<FollowedArtisanDto>> Handle(GetMyFollowingQuery request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return Array.Empty<FollowedArtisanDto>();
        }

        return await _dbContext.Follows
            .AsNoTracking()
            .Where(follow => follow.UserId == userId && !follow.IsDeleted && follow.ArtisanProfile != null && !follow.ArtisanProfile.IsDeleted)
            .OrderByDescending(follow => follow.CreatedAt)
            .Select(follow => new FollowedArtisanDto
            {
                FollowId = follow.Id,
                ArtisanProfileId = follow.ArtisanProfileId,
                Slug = follow.ArtisanProfile!.Slug,
                DisplayName = follow.ArtisanProfile.DisplayName,
                Craft = follow.ArtisanProfile.Craft,
                City = follow.ArtisanProfile.City,
                RatingAvg = follow.ArtisanProfile.RatingAvg,
                ProductCount = follow.ArtisanProfile.ProductCount
            })
            .ToListAsync(cancellationToken);
    }
}

public sealed class IsFollowingQueryHandler : IRequestHandler<IsFollowingQuery, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public IsFollowingQueryHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(IsFollowingQuery request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return false;
        }

        return await _dbContext.Follows
            .AsNoTracking()
            .AnyAsync(
                follow => follow.UserId == userId && follow.ArtisanProfileId == request.ArtisanProfileId && !follow.IsDeleted,
                cancellationToken);
    }
}
