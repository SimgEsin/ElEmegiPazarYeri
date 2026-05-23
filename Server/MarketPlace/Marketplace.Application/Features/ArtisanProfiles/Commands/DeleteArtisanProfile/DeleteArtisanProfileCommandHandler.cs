using MediatR;
using Marketplace.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.ArtisanProfiles.Commands.DeleteArtisanProfile;

public sealed class DeleteArtisanProfileCommandHandler : IRequestHandler<DeleteArtisanProfileCommand, bool>
{
    private readonly IMarketplaceDbContext _dbContext;

    public DeleteArtisanProfileCommandHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(DeleteArtisanProfileCommand request, CancellationToken cancellationToken)
    {
        var artisanProfile = await _dbContext.ArtisanProfiles
            .FirstOrDefaultAsync(entity => entity.Id == request.Id && !entity.IsDeleted, cancellationToken);

        if (artisanProfile is null)
        {
            return false;
        }

        artisanProfile.IsDeleted = true;
        artisanProfile.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
