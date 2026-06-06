using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Features.ArtisanProfiles.Queries.GetArtisanProfileById;
using Marketplace.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.ArtisanProfiles.Queries.GetMyArtisanProfile;

public sealed class GetMyArtisanProfileQueryHandler : IRequestHandler<GetMyArtisanProfileQuery, ArtisanProfileDetailsDto?>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetMyArtisanProfileQueryHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<ArtisanProfileDetailsDto?> Handle(GetMyArtisanProfileQuery request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return null;
        }

        return await _dbContext.ArtisanProfiles
            .AsNoTracking()
            .Where(artisanProfile => artisanProfile.UserId == userId && !artisanProfile.IsDeleted)
            .Select(artisanProfile => new ArtisanProfileDetailsDto
            {
                Id = artisanProfile.Id,
                UserId = artisanProfile.UserId,
                Slug = artisanProfile.Slug,
                DisplayName = artisanProfile.DisplayName,
                Craft = artisanProfile.Craft,
                City = artisanProfile.City,
                Bio = artisanProfile.Bio,
                RatingAvg = artisanProfile.RatingAvg,
                FollowerCount = artisanProfile.FollowerCount,
                ProductCount = artisanProfile.ProductCount,
                IsVerified = artisanProfile.IsVerified,
                CreatedAt = artisanProfile.CreatedAt,
                UpdatedAt = artisanProfile.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
