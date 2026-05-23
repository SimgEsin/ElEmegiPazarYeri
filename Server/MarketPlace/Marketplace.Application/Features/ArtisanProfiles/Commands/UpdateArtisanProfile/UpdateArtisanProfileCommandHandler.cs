using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.ArtisanProfiles.Commands.UpdateArtisanProfile;

public sealed class UpdateArtisanProfileCommandHandler : IRequestHandler<UpdateArtisanProfileCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public UpdateArtisanProfileCommandHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateArtisanProfileCommand request, CancellationToken cancellationToken)
    {
        var artisanProfile = await _dbContext.ArtisanProfiles
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (artisanProfile is null)
        {
            return false;
        }

        var dto = request.ArtisanProfile;

        artisanProfile.UserId = GetCurrentUserId();
        artisanProfile.Slug = dto.Slug;
        artisanProfile.DisplayName = dto.DisplayName;
        artisanProfile.Craft = dto.Craft;
        artisanProfile.City = dto.City;
        artisanProfile.Bio = dto.Bio;
        artisanProfile.RatingAvg = dto.RatingAvg;
        artisanProfile.FollowerCount = dto.FollowerCount;
        artisanProfile.ProductCount = dto.ProductCount;
        artisanProfile.IsVerified = dto.IsVerified;
        artisanProfile.UpdatedAt = DateTime.UtcNow;

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
