using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Addresses.Queries.GetAllAddresses;

public sealed class GetAllAddressesQueryHandler : IRequestHandler<GetAllAddressesQuery, IReadOnlyList<AddressListDto>>
{
    private readonly IMarketplaceDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public GetAllAddressesQueryHandler(IMarketplaceDbContext dbContext, ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<AddressListDto>> Handle(GetAllAddressesQuery request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(_currentUserService.UserId, out var userId))
        {
            return Array.Empty<AddressListDto>();
        }

        return await _dbContext.Addresses
            .AsNoTracking()
            .Where(address => !address.IsDeleted && address.UserId == userId)
            .OrderBy(address => address.City)
            .ThenBy(address => address.Label)
            .Select(address => new AddressListDto
            {
                Id = address.Id,
                UserId = address.UserId,
                Label = address.Label,
                FullAddress = address.FullAddress,
                City = address.City,
                PostalCode = address.PostalCode,
                IsDefault = address.IsDefault
            })
            .ToListAsync(cancellationToken);
    }
}
