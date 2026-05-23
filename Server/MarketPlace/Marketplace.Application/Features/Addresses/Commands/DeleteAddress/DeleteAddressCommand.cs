using MediatR;

namespace Marketplace.Application.Features.Addresses.Commands.DeleteAddress;

public sealed record DeleteAddressCommand(Guid Id) : IRequest<bool>;
