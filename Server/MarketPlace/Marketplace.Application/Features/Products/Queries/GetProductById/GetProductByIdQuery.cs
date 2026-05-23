using MediatR;

namespace Marketplace.Application.Features.Products.Queries.GetProductById;

public sealed record GetProductByIdQuery(Guid Id) : IRequest<ProductDetailsDto?>;
