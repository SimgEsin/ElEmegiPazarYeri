using MediatR;

namespace Marketplace.Application.Features.Products.Queries.GetAllProducts;

public sealed record GetAllProductsQuery : IRequest<IReadOnlyList<ProductListDto>>;
