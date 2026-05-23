using MediatR;

namespace Marketplace.Application.Features.Orders;

public sealed record CheckoutCartCommand : IRequest<Guid>;
public sealed record GetMyOrdersQuery : IRequest<IReadOnlyList<OrderDto>>;
