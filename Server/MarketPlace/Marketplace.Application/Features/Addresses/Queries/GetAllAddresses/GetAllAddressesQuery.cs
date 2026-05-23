using MediatR;

namespace Marketplace.Application.Features.Addresses.Queries.GetAllAddresses;

public sealed record GetAllAddressesQuery : IRequest<IReadOnlyList<AddressListDto>>;
