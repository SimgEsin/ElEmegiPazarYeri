using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Features.ArtisanProfiles.Commands.CreateArtisanProfile;

public sealed class CreateArtisanProfileCommandHandler : IRequestHandler<CreateArtisanProfileCommand, Guid>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public CreateArtisanProfileCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(CreateArtisanProfileCommand request, CancellationToken cancellationToken)
    {
        var dto = request.ArtisanProfile;

        var artisanProfile = new ArtisanProfile
        {
            UserId = GetCurrentUserId(),
            Slug = dto.Slug,
            DisplayName = dto.DisplayName,
            Craft = dto.Craft,
            City = dto.City,
            Bio = dto.Bio,
            AvatarUrl = dto.AvatarUrl,
            RatingAvg = dto.RatingAvg,
            FollowerCount = dto.FollowerCount,
            ProductCount = dto.ProductCount,
            IsVerified = dto.IsVerified
        };

        if (dto.GalleryImages is not null)
        {
            var sortOrder = 0;
            foreach (var image in dto.GalleryImages)
            {
                artisanProfile.GalleryImages.Add(new ArtisanProfileImage
                {
                    Name = image.Name,
                    Url = image.Url,
                    AltText = image.AltText,
                    SortOrder = image.SortOrder == 0 ? sortOrder : image.SortOrder
                });
                sortOrder++;
            }
        }

        await _dbContext.ArtisanProfiles.AddAsync(artisanProfile, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return artisanProfile.Id;
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
