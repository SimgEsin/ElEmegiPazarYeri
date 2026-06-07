using MediatR;

namespace Marketplace.Application.Features.Admin;

public sealed record GetAdminOrdersQuery : IRequest<IReadOnlyList<AdminOrderDto>>;

public sealed record CancelOrderForAdminCommand(Guid OrderId) : IRequest<bool>;
