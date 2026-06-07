using Marketplace.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Users.Queries.GetProfile;

public sealed class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, GetProfileDto?>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetProfileQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<GetProfileDto?> Handle(GetProfileQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.Users
            .Where(user => user.Id == request.UserId && !user.IsDeleted)
            .Select(user => new GetProfileDto(
                user.FullName,
                user.Email,
                user.PhoneNumber,
                user.DateOfBirth,
                user.AvatarUrl,
                user.CreatedAt))
            .FirstOrDefaultAsync(cancellationToken);
    }
}
