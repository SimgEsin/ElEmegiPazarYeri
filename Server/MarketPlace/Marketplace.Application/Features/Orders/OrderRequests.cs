using MediatR;

namespace Marketplace.Application.Features.Orders;

public sealed record CheckoutCartCommand : IRequest<Guid>;
public sealed record GetMyOrdersQuery : IRequest<IReadOnlyList<OrderDto>>;
public sealed record RequestOrderCancellationCommand(Guid OrderId, string Reason) : IRequest<bool>;
public sealed record GetArtisanOrdersQuery : IRequest<IReadOnlyList<ArtisanOrderDto>>;
public sealed record UpdateOrderStatusCommand(Guid OrderId, Marketplace.Domain.Enums.OrderStatus Status) : IRequest<bool>;
