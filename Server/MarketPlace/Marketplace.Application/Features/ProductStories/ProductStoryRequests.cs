using MediatR;

namespace Marketplace.Application.Features.ProductStories;

public sealed record CreateProductStoryCommand(CreateProductStoryDto ProductStory) : IRequest<Guid>;
public sealed record UpdateProductStoryCommand(Guid Id, UpdateProductStoryDto ProductStory) : IRequest<bool>;
public sealed record DeleteProductStoryCommand(Guid Id) : IRequest<bool>;
public sealed record GetAllProductStoriesQuery(Guid? ProductId = null) : IRequest<IReadOnlyList<ProductStoryDto>>;
public sealed record GetProductStoryByIdQuery(Guid Id) : IRequest<ProductStoryDto?>;
