using MediatR;

namespace Marketplace.Application.Features.Categories.Commands.CreateCategory;

public sealed record CreateCategoryCommand(CreateCategoryDto Category) : IRequest<Guid>;
