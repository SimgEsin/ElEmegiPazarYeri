using MediatR;

namespace Marketplace.Application.Features.Addresses.Commands.UpdateAddress;

public sealed record UpdateAddressCommand(Guid Id, UpdateAddressDto Address) : IRequest<bool>;
