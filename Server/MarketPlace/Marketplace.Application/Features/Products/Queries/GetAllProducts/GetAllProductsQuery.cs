using MediatR;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Products.Queries.GetAllProducts;

public sealed record GetAllProductsQuery(
    Guid? CategoryId = null,
    string? CategorySlug = null,
    Guid? ArtisanId = null,
    string? Search = null,
    ProductStatus? Status = ProductStatus.Published) : IRequest<IReadOnlyList<ProductListDto>>;
