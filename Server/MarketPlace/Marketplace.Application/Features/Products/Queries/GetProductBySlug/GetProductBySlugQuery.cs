using MediatR;
using Marketplace.Application.Features.Products.Queries.GetProductById;

namespace Marketplace.Application.Features.Products.Queries.GetProductBySlug;

public sealed record GetProductBySlugQuery(string Slug) : IRequest<ProductDetailsDto?>;
