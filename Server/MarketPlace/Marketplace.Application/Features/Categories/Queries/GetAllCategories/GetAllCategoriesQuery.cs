using MediatR;

namespace Marketplace.Application.Features.Categories.Queries.GetAllCategories;

public sealed record GetAllCategoriesQuery : IRequest<IReadOnlyList<CategoryListDto>>;
