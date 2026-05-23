using MediatR;

namespace Marketplace.Application.Features.Products.Commands.UpdateProduct;

public sealed record UpdateProductCommand(Guid Id, UpdateProductDto Product) : IRequest<bool>;
