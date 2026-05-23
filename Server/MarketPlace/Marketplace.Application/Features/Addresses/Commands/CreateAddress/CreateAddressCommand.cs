using MediatR;

namespace Marketplace.Application.Features.Addresses.Commands.CreateAddress;

public sealed record CreateAddressCommand(CreateAddressDto Address) : IRequest<Guid>;
