using MediatR;

namespace Marketplace.Application.Features.Categories.Commands.UpdateCategory;

public sealed record UpdateCategoryCommand(Guid Id, UpdateCategoryDto Category) : IRequest<bool>;
