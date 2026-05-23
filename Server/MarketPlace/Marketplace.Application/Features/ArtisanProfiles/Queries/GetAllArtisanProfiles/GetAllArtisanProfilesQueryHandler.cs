using MediatR;
using Marketplace.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.ArtisanProfiles.Queries.GetAllArtisanProfiles;

public sealed class GetAllArtisanProfilesQueryHandler : IRequestHandler<GetAllArtisanProfilesQuery, IReadOnlyList<ArtisanProfileListDto>>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetAllArtisanProfilesQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ArtisanProfileListDto>> Handle(GetAllArtisanProfilesQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.ArtisanProfiles
            .AsNoTracking()
            .Where(artisanProfile => !artisanProfile.IsDeleted)
            .OrderBy(artisanProfile => artisanProfile.DisplayName)
            .Select(artisanProfile => new ArtisanProfileListDto
            {
                Id = artisanProfile.Id,
                UserId = artisanProfile.UserId,
                Slug = artisanProfile.Slug,
                DisplayName = artisanProfile.DisplayName,
                Craft = artisanProfile.Craft,
                City = artisanProfile.City,
                RatingAvg = artisanProfile.RatingAvg,
                FollowerCount = artisanProfile.FollowerCount,
                ProductCount = artisanProfile.ProductCount,
                IsVerified = artisanProfile.IsVerified
            })
            .ToListAsync(cancellationToken);
    }
}
