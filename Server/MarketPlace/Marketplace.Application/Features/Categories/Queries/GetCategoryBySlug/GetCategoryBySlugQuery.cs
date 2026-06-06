using MediatR;
using Marketplace.Application.Features.Categories.Queries.GetCategoryById;

namespace Marketplace.Application.Features.Categories.Queries.GetCategoryBySlug;

public sealed record GetCategoryBySlugQuery(string Slug) : IRequest<CategoryDetailsDto?>;
