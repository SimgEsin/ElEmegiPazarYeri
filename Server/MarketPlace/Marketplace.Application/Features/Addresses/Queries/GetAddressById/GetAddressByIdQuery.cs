using MediatR;

namespace Marketplace.Application.Features.Addresses.Queries.GetAddressById;

public sealed record GetAddressByIdQuery(Guid Id) : IRequest<AddressDetailsDto?>;
