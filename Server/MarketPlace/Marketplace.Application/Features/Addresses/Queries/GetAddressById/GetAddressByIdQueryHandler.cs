using MediatR;
using Marketplace.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Addresses.Queries.GetAddressById;

public sealed class GetAddressByIdQueryHandler : IRequestHandler<GetAddressByIdQuery, AddressDetailsDto?>
{
    private readonly IMarketplaceDbContext _dbContext;

    public GetAddressByIdQueryHandler(IMarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<AddressDetailsDto?> Handle(GetAddressByIdQuery request, CancellationToken cancellationToken)
    {
        return await _dbContext.Addresses
            .AsNoTracking()
            .Where(address => address.Id == request.Id && !address.IsDeleted)
            .Select(address => new AddressDetailsDto
            {
                Id = address.Id,
                UserId = address.UserId,
                Label = address.Label,
                FullAddress = address.FullAddress,
                City = address.City,
                PostalCode = address.PostalCode,
                IsDefault = address.IsDefault,
                CreatedAt = address.CreatedAt,
                UpdatedAt = address.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
