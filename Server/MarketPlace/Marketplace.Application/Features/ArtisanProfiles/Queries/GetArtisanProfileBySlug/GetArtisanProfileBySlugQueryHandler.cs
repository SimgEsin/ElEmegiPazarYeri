using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Features.ArtisanProfiles.Queries.GetArtisanProfileById;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.ArtisanProfiles.Queries.GetArtisanProfileBySlug;

public sealed class GetArtisanProfileBySlugQueryHandler : IRequestHandler<GetArtisanProfileBySlugQuery, ArtisanProfileDetailsDto?>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetArtisanProfileBySlugQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ArtisanProfileDetailsDto?> Handle(GetArtisanProfileBySlugQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.ArtisanProfiles
            .AsNoTracking()
            .Where(artisanProfile => artisanProfile.Slug == request.Slug && !artisanProfile.IsDeleted)
            .Select(artisanProfile => new ArtisanProfileDetailsDto
            {
                Id = artisanProfile.Id,
                UserId = artisanProfile.UserId,
                Slug = artisanProfile.Slug,
                DisplayName = artisanProfile.DisplayName,
                Craft = artisanProfile.Craft,
                City = artisanProfile.City,
                Bio = artisanProfile.Bio,
                AvatarUrl = string.IsNullOrEmpty(artisanProfile.AvatarUrl)
                    ? (artisanProfile.User != null ? artisanProfile.User.AvatarUrl : null)
                    : artisanProfile.AvatarUrl,
                RatingAvg = artisanProfile.RatingAvg,
                FollowerCount = artisanProfile.FollowerCount,
                ProductCount = artisanProfile.ProductCount,
                IsVerified = artisanProfile.IsVerified,
                CreatedAt = artisanProfile.CreatedAt,
                UpdatedAt = artisanProfile.UpdatedAt,
                GalleryImages = artisanProfile.GalleryImages
                    .Where(image => !image.IsDeleted)
                    .OrderBy(image => image.SortOrder)
                    .Select(image => new ArtisanProfileImageDto
                    {
                        Id = image.Id,
                        Name = image.Name,
                        Url = image.Url,
                        AltText = image.AltText,
                        SortOrder = image.SortOrder
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
