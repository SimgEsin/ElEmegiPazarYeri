using MediatR;

namespace Marketplace.Application.Features.Products.Commands.CreateProduct;

public sealed record CreateProductCommand(CreateProductDto Product) : IRequest<Guid>;
