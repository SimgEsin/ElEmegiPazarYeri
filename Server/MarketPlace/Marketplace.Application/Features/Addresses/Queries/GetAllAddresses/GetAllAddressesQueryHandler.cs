using MediatR;
using Marketplace.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Addresses.Queries.GetAllAddresses;

public sealed class GetAllAddressesQueryHandler : IRequestHandler<GetAllAddressesQuery, IReadOnlyList<AddressListDto>>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetAllAddressesQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<AddressListDto>> Handle(GetAllAddressesQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.Addresses
            .AsNoTracking()
            .Where(address => !address.IsDeleted)
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
