using MediatR;

namespace Marketplace.Application.Features.Carts;

public sealed record GetMyCartQuery : IRequest<CartDto>;
public sealed record AddToCartCommand(AddToCartDto Item) : IRequest<Guid>;
public sealed record RemoveFromCartCommand(Guid CartItemId) : IRequest<bool>;
public sealed record UpdateCartItemCommand(Guid CartItemId, int Quantity) : IRequest<bool>;
